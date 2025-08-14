const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ["mice", "laptop"] },
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

const deliveryDetailsSchema = new mongoose.Schema(
  {
    address: {
      street: { type: String, required: true, trim: true },
      area: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true, default: "India" },
    },
    deliveryType: { type: String, required: true, enum: ["standard", "fast"] },
    deliveryCost: { type: Number, required: true, min: 0 },
    estimatedDelivery: {
      minDays: { type: Number, required: true },
      maxDays: { type: Number, required: true },
      description: { type: String, required: true },
    },
    trackingNumber: { type: String, trim: true },
    deliveryStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "failed",
      ],
      default: "pending",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    deliveryDetails: deliveryDetailsSchema,
    paymentDetails: {
      method: {
        type: String,
        enum: ["cod", "online", "upi", "card"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      transactionId: { type: String, trim: true },
      amount: { type: Number, required: true },
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    subtotal: { type: Number, required: true },
    deliveryCost: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    notes: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for efficient queries
orderSchema.index({ orderId: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ "paymentDetails.status": 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order ID
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.orderId = `ORD${timestamp}${random}`;
  }
  next();
});

// Virtual for order summary
orderSchema.virtual("orderSummary").get(function () {
  return {
    orderId: this.orderId,
    totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
    itemCount: this.items.length,
    totalAmount: this.totalAmount,
    orderStatus: this.orderStatus,
    paymentStatus: this.paymentDetails.status,
  };
});

// Virtual for delivery status
orderSchema.virtual("isDelivered").get(function () {
  return this.orderStatus === "delivered";
});

// Virtual for payment status
orderSchema.virtual("isPaid").get(function () {
  return this.paymentDetails.status === "completed";
});

// Method to calculate totals
orderSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.tax = Math.round(this.subtotal * 0.18); // 18% GST
  this.totalAmount =
    this.subtotal + this.deliveryCost + this.tax - this.discount;
  return this;
};

// Method to update order status
orderSchema.methods.updateStatus = function (newStatus) {
  this.orderStatus = newStatus;

  // Auto-update delivery status based on order status
  if (newStatus === "shipped") {
    this.deliveryDetails.deliveryStatus = "shipped";
  } else if (newStatus === "delivered") {
    this.deliveryDetails.deliveryStatus = "delivered";
  }

  return this.save();
};

// Method to update payment status
orderSchema.methods.updatePaymentStatus = function (
  status,
  transactionId = null
) {
  this.paymentDetails.status = status;
  if (transactionId) {
    this.paymentDetails.transactionId = transactionId;
  }
  return this.save();
};

// Method to add tracking number
orderSchema.methods.addTrackingNumber = function (trackingNumber) {
  this.deliveryDetails.trackingNumber = trackingNumber;
  this.deliveryDetails.deliveryStatus = "shipped";
  this.orderStatus = "shipped";
  return this.save();
};

// Static method to find by order ID
orderSchema.statics.findByOrderId = function (orderId) {
  return this.findOne({ orderId: orderId, isActive: true });
};

// Static method to get user orders
orderSchema.statics.getUserOrders = function (userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ userId: userId, isActive: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function (
  status,
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit;
  return this.find({ orderStatus: status, isActive: true })
    .populate("userId", "firstName lastName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model("Order", orderSchema);
