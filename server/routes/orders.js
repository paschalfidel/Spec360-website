import express from "express";
import crypto from "node:crypto";
import mongoose from "mongoose";

import Product from "../models/Product.js";
import Order from "../models/Order.js";
import {
  initializeTransaction,
  verifyTransaction,
  refundTransaction,
} from "../services/paystack.js";
import { env } from "../config/env.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

const emailPattern =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function makeReference() {
  return `SP360-${Date.now()}-${crypto
    .randomBytes(5)
    .toString("hex")}`;
}

function normalizeItems(items) {
  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 50
  ) {
    throw Object.assign(
      new Error(
        "Your cart is empty or invalid"
      ),
      { status: 400 }
    );
  }

  return items.map((item) => {
    if (
      !mongoose.isValidObjectId(
        item.productId
      )
    ) {
      throw Object.assign(
        new Error(
          "Invalid product in cart"
        ),
        { status: 400 }
      );
    }

    const quantity = Math.floor(
      Number(item.quantity)
    );

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      throw Object.assign(
        new Error(
          "Invalid product quantity"
        ),
        { status: 400 }
      );
    }

    return {
      productId: item.productId,
      quantity,
    };
  });
}

// -----------------------------------------------------------------------------
// BUILD ORDER FROM DATABASE
// -----------------------------------------------------------------------------
//
// IMPORTANT:
// Never trust price, product name, stock or image data coming from the client.
// The database is the source of truth.
//

async function buildOrderItems(rawItems) {
  const ids = [
    ...new Set(
      rawItems.map(
        (item) => item.productId
      )
    ),
  ];

  const products =
    await Product.find({
      _id: {
        $in: ids,
      },
    }).lean();

  const byId = new Map(
    products.map((product) => [
      product._id.toString(),
      product,
    ])
  );

  let amount = 0;
  const items = [];

  for (const requested of rawItems) {
    const product = byId.get(
      requested.productId.toString()
    );

    if (!product) {
      throw Object.assign(
        new Error(
          "One or more products no longer exist"
        ),
        { status: 400 }
      );
    }

    if (
      Number(product.stock) <
      requested.quantity
    ) {
      throw Object.assign(
        new Error(
          `${product.name} has only ${product.stock} item(s) available`
        ),
        { status: 409 }
      );
    }

    const unitPrice =
      Number(product.price);

    if (
      !Number.isFinite(unitPrice) ||
      unitPrice < 0
    ) {
      throw Object.assign(
        new Error(
          `Invalid price configured for ${product.name}`
        ),
        { status: 500 }
      );
    }

    amount +=
      unitPrice *
      requested.quantity;

    items.push({
      productId: product._id,
      name: product.name,
      unitPrice,
      quantity:
        requested.quantity,
      imageUrl:
        product.imageUrl || "",
    });
  }

  return {
    items,
    amount,
  };
}

// -----------------------------------------------------------------------------
// RESERVE STOCK
// -----------------------------------------------------------------------------

async function reserveStock(
  items,
  session
) {
  for (const item of items) {
    const updated =
      await Product.findOneAndUpdate(
        {
          _id: item.productId,
          stock: {
            $gte: item.quantity,
          },
        },
        {
          $inc: {
            stock: -item.quantity,
          },
        },
        {
          returnDocument: "after",
          session,
        }
      );

    if (!updated) {
      throw Object.assign(
        new Error(
          `Insufficient stock for ${item.name}`
        ),
        { status: 409 }
      );
    }
  }
}

// -----------------------------------------------------------------------------
// RELEASE STOCK
// -----------------------------------------------------------------------------

async function releaseStock(order) {
  if (
    !order ||
    order.stockReleasedAt
  ) {
    return order;
  }

  const session =
    await mongoose.startSession();

  try {
    let updated;

    await session.withTransaction(
      async () => {
        const locked =
          await Order.findById(
            order._id
          ).session(session);

        if (
          !locked ||
          locked.status === "paid" ||
          locked.stockReleasedAt
        ) {
          updated =
            locked || order;

          return;
        }

        for (const item of locked.items) {
          await Product.updateOne(
            {
              _id: item.productId,
            },
            {
              $inc: {
                stock:
                  item.quantity,
              },
            },
            {
              session,
            }
          );
        }

        locked.stockReleasedAt =
          new Date();

        if (
          locked.status ===
          "pending"
        ) {
          locked.status =
            "cancelled";
        }

        updated =
          await locked.save({
            session,
          });
      }
    );

    return updated;
  } finally {
    await session.endSession();
  }
}

// -----------------------------------------------------------------------------
// FULFILL / VERIFY ORDER
// -----------------------------------------------------------------------------

async function fulfillOrder(
  order,
  payment
) {
  if (!order) {
    throw Object.assign(
      new Error(
        "Order not found"
      ),
      { status: 404 }
    );
  }

  /*
   * Idempotency:
   *
   * If Paystack verification or webhook
   * processing reaches this order again,
   * do not process the successful payment
   * twice.
   */
  if (order.status === "paid") {
    return order;
  }

  // ---------------------------------------------------------------------------
  // PAYMENT FAILED / EXPIRED
  // ---------------------------------------------------------------------------

  if (
    payment.status !==
    "success"
  ) {
    if (
      payment.status ===
      "failed"
    ) {
      return releaseStock(
        order
      );
    }

    if (
      new Date() >=
      new Date(order.expiresAt)
    ) {
      return releaseStock(
        order
      );
    }

    order.status = "pending";
    order.paystackStatus =
      payment.status || "";

    await order.save();

    return order;
  }

  // ---------------------------------------------------------------------------
  // PAYMENT AMOUNT VALIDATION
  // ---------------------------------------------------------------------------

  const expectedAmountKobo =
    Math.round(
      Number(order.amount) *
        100
    );

  const paidAmountKobo =
    Number(payment.amount);

  if (
    paidAmountKobo !==
      expectedAmountKobo ||
    payment.currency !==
      order.currency
  ) {
    throw Object.assign(
      new Error(
        "Payment amount or currency mismatch"
      ),
      { status: 400 }
    );
  }

  // ---------------------------------------------------------------------------
  // PAYMENT AFTER ORDER EXPIRY
  // ---------------------------------------------------------------------------

  if (
    new Date() >
    new Date(order.expiresAt)
  ) {
    const released =
      await releaseStock(order);

    if (!released) {
      throw Object.assign(
        new Error(
          "Unable to release expired order stock"
        ),
        { status: 500 }
      );
    }

    try {
      /*
       * FIX:
       * The previous implementation referenced
       * an undefined `reference` variable here.
       *
       * Always use the order's actual Paystack
       * reference.
       */
      await refundTransaction(
        order.reference,
        expectedAmountKobo
      );

      released.status =
        "refunding";

      released.paystackStatus =
        "refund_queued";

      released.paystackTransactionId =
        String(
          payment.id || ""
        );

      await released.save();

      return released;
    } catch (refundError) {
      console.error(
        `Paystack refund failed for ${order.reference}:`,
        refundError.message
      );

      /*
       * Payment succeeded but automatic refund
       * failed. Keep the order marked as paid so
       * it cannot accidentally be processed again.
       *
       * The status tells admin that manual review
       * is required.
       */
      released.status =
        "paid";

      released.paystackStatus =
        "refund_failed_manual_review";

      released.paystackTransactionId =
        String(
          payment.id || ""
        );

      released.paidAt =
        payment.paid_at
          ? new Date(
              payment.paid_at
            )
          : new Date();

      await released.save();

      return released;
    }
  }

  // ---------------------------------------------------------------------------
  // SUCCESSFUL PAYMENT
  // ---------------------------------------------------------------------------

  order.status = "paid";

  order.paystackStatus =
    payment.status;

  order.paystackTransactionId =
    String(payment.id || "");

  order.paidAt =
    payment.paid_at
      ? new Date(
          payment.paid_at
        )
      : new Date();

  order.paymentChannel =
    payment.channel || "";

  /*
   * Do not mark fulfilledAt here.
   *
   * Payment confirmation and physical
   * fulfilment are separate concepts.
   *
   * Admin can later mark the order fulfilled
   * after delivery/pickup.
   */

  return order.save();
}

// -----------------------------------------------------------------------------
// INITIALIZE PAYMENT
// -----------------------------------------------------------------------------

router.post(
  "/initialize",
  async (req, res, next) => {
    try {
      const customer =
        req.body?.customer || {};

      const email = String(
        customer.email || ""
      )
        .trim()
        .toLowerCase();

      const name = String(
        customer.name || ""
      ).trim();

      const phone = String(
        customer.phone || ""
      ).trim();

      if (
        !name ||
        !emailPattern.test(
          email
        ) ||
        !phone
      ) {
        return res.status(400).json({
          message:
            "Valid customer name, email and phone are required",
        });
      }

      const rawItems =
        normalizeItems(
          req.body?.items
        );

      /*
       * Prices and stock are rebuilt
       * from MongoDB here.
       */
      const {
        items,
        amount,
      } =
        await buildOrderItems(
          rawItems
        );

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return res.status(400).json({
          message:
            "Order amount must be greater than zero",
        });
      }

      const reference =
        makeReference();

      /*
       * Orders are reserved for 30 minutes.
       */
      const expiresAt =
        new Date(
          Date.now() +
            30 * 60 * 1000
        );

      const session =
        await mongoose.startSession();

      let order;

      try {
        await session.withTransaction(
          async () => {
            /*
             * Atomic stock reservation.
             */
            await reserveStock(
              items,
              session
            );

            const created =
              await Order.create(
                [
                  {
                    reference,
                    customer: {
                      name,
                      email,
                      phone,
                    },
                    items,
                    amount,
                    currency: "NGN",
                    expiresAt,
                  },
                ],
                {
                  session,
                }
              );

            order = created[0];
          }
        );
      } finally {
        await session.endSession();
      }

      // -----------------------------------------------------------------------
      // PAYSTACK CALLBACK
      // -----------------------------------------------------------------------

      const callbackUrlCandidate =
        typeof req.body
          ?.callbackUrl ===
        "string"
          ? req.body.callbackUrl
          : "";

      let callbackUrl =
        `${env.frontendUrl}/cart?payment=success`;

      try {
        const parsed =
          new URL(
            callbackUrlCandidate
          );

        if (
          env.clientOrigins.includes(
            parsed.origin
          )
        ) {
          callbackUrl =
            parsed.toString();
        }
      } catch {
        /*
         * Use configured frontend
         * callback when the supplied URL
         * is missing or invalid.
         */
      }

      // -----------------------------------------------------------------------
      // INITIALIZE PAYSTACK
      // -----------------------------------------------------------------------

      try {
        const payment =
          await initializeTransaction(
            {
              email,
              amountKobo:
                Math.round(
                  amount * 100
                ),
              reference,
              callbackUrl,
              metadata: {
                orderId:
                  order._id.toString(),
                reference,
              },
            }
          );

        return res
          .status(201)
          .json({
            data: {
              orderId:
                order._id,
              reference,
              authorizationUrl:
                payment.data
                  .authorization_url,
              accessCode:
                payment.data
                  .access_code,
            },
          });
      } catch (error) {
        /*
         * Paystack initialization failed.
         *
         * Release the stock that was reserved
         * for this order.
         */
        const failedOrder =
          await Order.findById(
            order._id
          );

        if (failedOrder) {
          await releaseStock(
            failedOrder
          );
        }

        throw error;
      }
    } catch (error) {
      next(error);
    }
  }
);

// -----------------------------------------------------------------------------
// VERIFY PAYMENT
// -----------------------------------------------------------------------------

router.get(
  "/verify/:reference",
  async (req, res, next) => {
    try {
      const reference = String(
        req.params.reference || ""
      ).trim();

      if (!reference) {
        return res.status(400).json({
          message:
            "Payment reference is required",
        });
      }

      const order =
        await Order.findOne({
          reference,
        });

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      /*
       * Always verify directly with Paystack.
       * Never trust the callback query alone.
       */
      const verification =
        await verifyTransaction(
          reference
        );

      const fulfilled =
        await fulfillOrder(
          order,
          verification.data
        );

      if (
        fulfilled.status !==
          "paid" ||
        fulfilled.paystackStatus ===
          "refund_failed_manual_review"
      ) {
        return res.status(409).json({
          message:
            fulfilled.status ===
            "refunding"
              ? "Payment received after the order expired. A refund has been initiated."
              : `Payment is ${fulfilled.status}`,
          data: {
            reference,
            status:
              fulfilled.status,
          },
        });
      }

      return res.json({
        message:
          "Payment verified successfully",
        data: {
          orderId:
            fulfilled._id,
          reference:
            fulfilled.reference,
          status:
            fulfilled.status,
          amount:
            fulfilled.amount,
          currency:
            fulfilled.currency,
          paymentChannel:
            fulfilled.paymentChannel,
          paidAt:
            fulfilled.paidAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// -----------------------------------------------------------------------------
// ADMIN — GET ORDERS
// -----------------------------------------------------------------------------
//
// Returns orders for the admin dashboard.
//
// NOTE:
// Authentication/authorization is handled by the existing admin access layer.
// Do not expose this route publicly in production.
//

router.get(
  "/admin",
  authMiddleware,
  async (req, res, next) => {
    try {
      const {
        status,
        search,
        page = 1,
        limit = 50,
      } = req.query;

      const safePage = Math.max(
        1,
        Number.parseInt(page, 10) || 1
      );

      const safeLimit = Math.min(
        100,
        Math.max(
          1,
          Number.parseInt(limit, 10) || 50
        )
      );

      const filter = {};

      // -----------------------------------------------------------------------
      // STATUS FILTER
      // -----------------------------------------------------------------------

      if (
        status &&
        [
          "pending",
          "paid",
          "fulfilled",
          "failed",
          "cancelled",
          "refunding",
          "refunded",
        ].includes(status)
      ) {
        filter.status = status;
      }

      // -----------------------------------------------------------------------
      // SEARCH
      // -----------------------------------------------------------------------

      if (
        typeof search === "string" &&
        search.trim()
      ) {
        const query =
          search.trim();

        filter.$or = [
          {
            reference: {
              $regex: query,
              $options: "i",
            },
          },
          {
            "customer.name": {
              $regex: query,
              $options: "i",
            },
          },
          {
            "customer.email": {
              $regex: query,
              $options: "i",
            },
          },
          {
            "customer.phone": {
              $regex: query,
              $options: "i",
            },
          },
          {
            paystackTransactionId: {
              $regex: query,
              $options: "i",
            },
          },
        ];
      }

      const skip =
        (safePage - 1) *
        safeLimit;

      const [
        orders,
        total,
      ] = await Promise.all([
        Order.find(filter)
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(safeLimit)
          .lean(),

        Order.countDocuments(
          filter
        ),
      ]);

      return res.json({
        data: orders,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          pages: Math.ceil(
            total / safeLimit
          ),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// -----------------------------------------------------------------------------
// ADMIN — GET SINGLE ORDER
// -----------------------------------------------------------------------------

router.get(
  "/admin/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.isValidObjectId(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid order ID",
        });
      }

      const order =
        await Order.findById(id)
          .lean();

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      return res.json({
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
);

// -----------------------------------------------------------------------------
// ADMIN — UPDATE ORDER STATUS
// -----------------------------------------------------------------------------

router.patch(
  "/admin/:id/status",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const requestedStatus = String(
        req.body?.status || ""
      )
        .trim()
        .toLowerCase();

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          message: "Invalid order ID",
        });
      }

      const allowedStatuses = [
        "pending",
        "paid",
        "fulfilled",
        "failed",
        "cancelled",
        "refunding",
        "refunded",
      ];

      if (!allowedStatuses.includes(requestedStatus)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      const currentStatus = order.status;

      // -----------------------------------------------------------------------
      // PAYMENT PROTECTION
      // -----------------------------------------------------------------------
      // Admin cannot manually make an unpaid order "paid".
      // Payment status must come from Paystack verification.
      // -----------------------------------------------------------------------

      if (
        requestedStatus === "paid" &&
        currentStatus !== "paid"
      ) {
        return res.status(409).json({
          message:
            "An order can only be marked paid after successful Paystack verification.",
        });
      }

      // -----------------------------------------------------------------------
      // FULFILLED
      // -----------------------------------------------------------------------

      if (requestedStatus === "fulfilled") {
        if (currentStatus !== "paid") {
          return res.status(409).json({
            message:
              "Only paid orders can be marked as fulfilled.",
          });
        }

        order.status = "fulfilled";
        order.fulfilledAt = new Date();
      }

      // -----------------------------------------------------------------------
      // PREVENT REVERSING A FULFILLED ORDER
      // -----------------------------------------------------------------------

      else if (
        currentStatus === "fulfilled" &&
        requestedStatus !== "fulfilled"
      ) {
        return res.status(409).json({
          message:
            "A fulfilled order cannot be moved back to another status.",
        });
      }

      // -----------------------------------------------------------------------
      // OTHER ADMIN STATUS CHANGES
      // -----------------------------------------------------------------------

      else {
        order.status = requestedStatus;
      }

      const updatedOrder = await order.save();

      return res.json({
        message: "Order status updated successfully",
        data: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  }
);

// -----------------------------------------------------------------------------
// PAYSTACK WEBHOOK
// -----------------------------------------------------------------------------

export async function handlePaystackWebhook(
  req,
  res
) {
  const signature =
    req.get(
      "x-paystack-signature"
    );

  const expected =
    crypto
      .createHmac(
        "sha512",
        env.paystackSecretKey
      )
      .update(req.body)
      .digest("hex");

  if (
    !signature ||
    signature.length !==
      expected.length ||
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    )
  ) {
    return res
      .status(401)
      .send("Invalid signature");
  }

  try {
    const event =
      JSON.parse(
        req.body.toString(
          "utf8"
        )
      );

    // -------------------------------------------------------------------------
    // SUCCESSFUL CHARGE
    // -------------------------------------------------------------------------

    if (
      event.event ===
        "charge.success" &&
      event.data?.reference
    ) {
      const order =
        await Order.findOne({
          reference:
            event.data.reference,
        });

      if (order) {
        const verification =
          await verifyTransaction(
            event.data.reference
          );

        await fulfillOrder(
          order,
          verification.data
        );
      }
    }

    // -------------------------------------------------------------------------
    // REFUND PROCESSED
    // -------------------------------------------------------------------------

    else if (
      event.event ===
        "refund.processed" &&
      event.data
        ?.transaction_reference
    ) {
      await Order.findOneAndUpdate(
        {
          reference:
            event.data
              .transaction_reference,
        },
        {
          status: "refunded",
          paystackStatus:
            "refund_processed",
        },
        {
          returnDocument: "after",
        }
      );
    }

    // -------------------------------------------------------------------------
    // REFUND FAILED
    // -------------------------------------------------------------------------

    else if (
      event.event ===
        "refund.failed" &&
      event.data
        ?.transaction_reference
    ) {
      await Order.findOneAndUpdate(
        {
          reference:
            event.data
              .transaction_reference,
        },
        {
          paystackStatus:
            "refund_failed_manual_review",
        },
        {
          returnDocument: "after",
        }
      );
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error(
      "Paystack webhook error:",
      error.message
    );

    /*
     * Return 200 so Paystack does not repeatedly
     * retry an event that has already reached us.
     */
    return res.sendStatus(200);
  }
}

// -----------------------------------------------------------------------------
// RELEASE EXPIRED ORDERS
// -----------------------------------------------------------------------------

export async function releaseExpiredOrders() {
  const expired =
    await Order.find({
      status: "pending",
      expiresAt: {
        $lte: new Date(),
      },
      stockReleasedAt: null,
    }).limit(100);

  for (const order of expired) {
    try {
      await releaseStock(order);
    } catch (error) {
      console.error(
        `Failed to release stock for ${order.reference}:`,
        error.message
      );
    }
  }
}

export default router;