import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
      },
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "fulfilled",
        "failed",
        "cancelled",
        "refunding",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    paystackStatus: {
      type: String,
      default: "",
    },

    paystackTransactionId: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    fulfilledAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    stockReleasedAt: {
      type: Date,
      default: null,
    },

    paymentChannel: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Customer order lookup
orderSchema.index({
  "customer.email": 1,
  createdAt: -1,
});

// Admin order listing
orderSchema.index({
  status: 1,
  createdAt: -1,
});

export default mongoose.model(
  "Order",
  orderSchema
);