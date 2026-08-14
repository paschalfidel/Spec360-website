import express from "express";
import mongoose from "mongoose";

import upload from "../middleware/upload.js";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

const cache = {
  data: null,
  ts: 0,
};

const CACHE_TTL = 60_000;

const bustCache = () => {
  cache.data = null;
  cache.ts = 0;
};

const optimizeImageUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }

  return url.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_600/"
  );
};

const serialize = (product) => ({
  ...product,
  imageUrl: optimizeImageUrl(
    product.imageUrl
  ),
});

// -----------------------------------------------------------------------------
// GET ALL PRODUCTS
// -----------------------------------------------------------------------------

router.get("/", async (_req, res, next) => {
  try {
    if (
      cache.data &&
      Date.now() - cache.ts <
        CACHE_TTL
    ) {
      return res
        .set(
          "Cache-Control",
          "public, max-age=60, stale-while-revalidate=30"
        )
        .json(cache.data);
    }

    const products =
      await Product.find()
        .sort({ createdAt: -1 })
        .lean();

    cache.data =
      products.map(serialize);

    cache.ts = Date.now();

    return res
      .set(
        "Cache-Control",
        "public, max-age=60, stale-while-revalidate=30"
      )
      .json(cache.data);
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// GET PRODUCTS BY CATEGORY
// -----------------------------------------------------------------------------

router.get(
  "/category/:category",
  async (req, res, next) => {
    try {
      const category = String(
        req.params.category
      ).toLowerCase();

      const products =
        await Product.find({
          category,
        })
          .sort({ createdAt: -1 })
          .lean();

      return res
        .set(
          "Cache-Control",
          "public, max-age=60"
        )
        .json(
          products.map(serialize)
        );
    } catch (error) {
      next(error);
    }
  }
);

// -----------------------------------------------------------------------------
// GET SINGLE PRODUCT
// -----------------------------------------------------------------------------

router.get(
  "/:id",
  async (req, res, next) => {
    try {
      if (
        !mongoose.isValidObjectId(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      const product =
        await Product.findById(
          req.params.id
        ).lean();

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res
        .set(
          "Cache-Control",
          "public, max-age=120"
        )
        .json(serialize(product));
    } catch (error) {
      next(error);
    }
  }
);

// -----------------------------------------------------------------------------
// CREATE PRODUCT
// -----------------------------------------------------------------------------

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const {
        name,
        category,
        price,
        compareAt,
        description,
        stock,
        compatibility,
        brand,
        featured,
      } = req.body;

      const numericPrice =
        Number(price);

      const numericStock =
        Number(stock);

      const numericCompareAt =
        compareAt === undefined ||
        compareAt === ""
          ? undefined
          : Number(compareAt);

      if (
        !name?.trim() ||
        !category
      ) {
        return res.status(400).json({
          message:
            "Product name and category are required.",
        });
      }

      if (
        !Number.isFinite(
          numericPrice
        ) ||
        numericPrice < 0
      ) {
        return res.status(400).json({
          message:
            "Price must be a valid non-negative number.",
        });
      }

      if (
        !Number.isInteger(
          numericStock
        ) ||
        numericStock < 0
      ) {
        return res.status(400).json({
          message:
            "Stock must be a whole number greater than or equal to 0.",
        });
      }

      if (
        numericCompareAt !== undefined &&
        (!Number.isFinite(
          numericCompareAt
        ) ||
          numericCompareAt < 0)
      ) {
        return res.status(400).json({
          message:
            "Compare-at price must be a valid non-negative number.",
        });
      }

      const product =
        await Product.create({
          name: name.trim(),
          category,
          price: numericPrice,
          compareAt:
            numericCompareAt,
          description:
            description?.trim() || "",
          stock: numericStock,
          compatibility:
            compatibility?.trim() || "",
          brand:
            brand?.trim() || "",
          featured:
            featured === true ||
            featured === "true",
          imageUrl:
            req.file?.path || "",
        });

      bustCache();

      return res
        .status(201)
        .json(product);
    } catch (error) {
      next(error);
    }
  }
);

// -----------------------------------------------------------------------------
// UPDATE PRODUCT
// -----------------------------------------------------------------------------

router.patch(
  "/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      if (
        !mongoose.isValidObjectId(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      const allowedFields = [
        "name",
        "category",
        "price",
        "compareAt",
        "description",
        "stock",
        "compatibility",
        "brand",
        "featured",
        "rating",
        "reviews",
        "specifications",
        "images",
        "imageUrl",
      ];

      const updates =
        Object.fromEntries(
          Object.entries(
            req.body || {}
          ).filter(([key]) =>
            allowedFields.includes(
              key
            )
          )
        );

      if (
        Object.keys(updates)
          .length === 0
      ) {
        return res.status(400).json({
          message:
            "No valid product fields were provided.",
        });
      }

      if (
        "name" in updates
      ) {
        updates.name =
          String(
            updates.name
          ).trim();

        if (!updates.name) {
          return res.status(400).json({
            message:
              "Product name cannot be empty.",
          });
        }
      }

      if (
        "price" in updates
      ) {
        updates.price =
          Number(updates.price);

        if (
          !Number.isFinite(
            updates.price
          ) ||
          updates.price < 0
        ) {
          return res.status(400).json({
            message:
              "Price must be a valid non-negative number.",
          });
        }
      }

      if (
        "stock" in updates
      ) {
        updates.stock =
          Number(updates.stock);

        if (
          !Number.isInteger(
            updates.stock
          ) ||
          updates.stock < 0
        ) {
          return res.status(400).json({
            message:
              "Stock must be a whole number greater than or equal to 0.",
          });
        }
      }

      if (
        "compareAt" in updates
      ) {
        if (
          updates.compareAt ===
            null ||
          updates.compareAt === ""
        ) {
          updates.compareAt =
            undefined;
        } else {
          updates.compareAt =
            Number(
              updates.compareAt
            );

          if (
            !Number.isFinite(
              updates.compareAt
            ) ||
            updates.compareAt < 0
          ) {
            return res.status(400).json({
              message:
                "Compare-at price must be a valid non-negative number.",
            });
          }
        }
      }

      if (
        "description" in updates
      ) {
        updates.description =
          String(
            updates.description ||
              ""
          ).trim();
      }

      if (
        "compatibility" in
        updates
      ) {
        updates.compatibility =
          String(
            updates.compatibility ||
              ""
          ).trim();
      }

      if (
        "brand" in updates
      ) {
        updates.brand =
          String(
            updates.brand || ""
          ).trim();
      }

      if (
        "featured" in updates
      ) {
        updates.featured =
          Boolean(
            updates.featured
          );
      }

      /*
       * Mongoose 9:
       * returnDocument: "after" replaces
       * the deprecated new: true option.
       */
      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          updates,
          {
            returnDocument: "after",
            runValidators: true,
          }
        ).lean();

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found.",
        });
      }

      bustCache();

      return res.json(
        serialize(product)
      );
    } catch (error) {
      next(error);
    }
  }
);

// -----------------------------------------------------------------------------
// DELETE PRODUCT
// -----------------------------------------------------------------------------

router.delete(
  "/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      if (
        !mongoose.isValidObjectId(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      const deleted =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!deleted) {
        return res.status(404).json({
          message:
            "Product not found.",
        });
      }

      bustCache();

      return res.json({
        message:
          "Product deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;