const mongoose = require("mongoose");

const savedCardSchema = new mongoose.Schema(
  {
    cardNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(v);
        },
        message: "Card number must be in format XXXX-XXXX-XXXX-XXXX",
      },
    },
    cardType: {
      type: String,
      required: true,
      enum: ["visa", "mastercard", "amex", "rupay"],
    },
    cardholderName: {
      type: String,
      required: true,
      trim: true,
    },
    expiryMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    expiryYear: {
      type: Number,
      required: true,
      min: new Date().getFullYear(),
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    orderId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "upi", "netbanking", "cod"],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    cardDetails: {
      cardNumber: { type: String, trim: true },
      cardType: { type: String, enum: ["visa", "mastercard", "amex", "rupay"] },
      cardholderName: { type: String, trim: true },
    },
    upiDetails: {
      upiId: { type: String, trim: true },
      provider: { type: String, trim: true },
    },
    bankDetails: {
      bankName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
    },
    gatewayResponse: {
      success: { type: Boolean, default: false },
      message: { type: String, trim: true },
      gatewayTransactionId: { type: String, trim: true },
      responseCode: { type: String, trim: true },
    },
    refundDetails: {
      refundAmount: { type: Number, default: 0 },
      refundReason: { type: String, trim: true },
      refundDate: { type: Date },
    },
  },
  { timestamps: true }
);

const userPaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    savedCards: [savedCardSchema],
    upiIds: [
      {
        upiId: { type: String, required: true, trim: true },
        provider: { type: String, required: true, trim: true },
        isDefault: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
      },
    ],
    bankAccounts: [
      {
        bankName: { type: String, required: true, trim: true },
        accountNumber: { type: String, required: true, trim: true },
        ifscCode: { type: String, required: true, trim: true },
        accountHolderName: { type: String, required: true, trim: true },
        isDefault: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
userPaymentSchema.index({ userId: 1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ orderId: 1 });
transactionSchema.index({ userId: 1 });
transactionSchema.index({ paymentStatus: 1 });
transactionSchema.index({ createdAt: -1 });

// Pre-save middleware to generate transaction ID
transactionSchema.pre("save", function (next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.transactionId = `TXN${timestamp}${random}`;
  }
  next();
});

// Method to add saved card
userPaymentSchema.methods.addCard = function (cardData) {
  // Remove default from all other cards if this is set as default
  if (cardData.isDefault) {
    this.savedCards.forEach((card) => {
      card.isDefault = false;
    });
  }

  // Check if card already exists
  const existingCardIndex = this.savedCards.findIndex(
    (card) => card.cardNumber === cardData.cardNumber
  );

  if (existingCardIndex > -1) {
    // Update existing card
    this.savedCards[existingCardIndex] = {
      ...this.savedCards[existingCardIndex],
      ...cardData,
    };
  } else {
    // Add new card
    this.savedCards.push(cardData);
  }

  return this.save();
};

// Method to remove saved card
userPaymentSchema.methods.removeCard = function (cardNumber) {
  this.savedCards = this.savedCards.filter(
    (card) => card.cardNumber !== cardNumber
  );
  return this.save();
};

// Method to set default card
userPaymentSchema.methods.setDefaultCard = function (cardNumber) {
  this.savedCards.forEach((card) => {
    card.isDefault = card.cardNumber === cardNumber;
  });
  return this.save();
};

// Method to get default card
userPaymentSchema.methods.getDefaultCard = function () {
  return (
    this.savedCards.find((card) => card.isDefault && card.isActive) ||
    this.savedCards[0]
  );
};

// Static method to find by user ID
userPaymentSchema.statics.findByUserId = function (userId) {
  return this.findOne({ userId: userId, isActive: true });
};

// Static method to process payment (dummy implementation)
transactionSchema.statics.processPayment = async function (paymentData) {
  const {
    orderId,
    userId,
    amount,
    paymentMethod,
    cardNumber,
    cardType,
    cardholderName,
    upiId,
    provider,
    bankName,
    accountNumber,
  } = paymentData;

  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Dummy payment logic - 90% success rate
  const isSuccess = Math.random() > 0.1;
  const gatewayTransactionId = isSuccess
    ? `GTW${Date.now()}${Math.floor(Math.random() * 1000)}`
    : null;

  const transaction = new this({
    orderId,
    userId,
    amount,
    paymentMethod,
    paymentStatus: isSuccess ? "completed" : "failed",
    cardDetails: cardNumber
      ? { cardNumber, cardType, cardholderName }
      : undefined,
    upiDetails: upiId ? { upiId, provider } : undefined,
    bankDetails: bankName ? { bankName, accountNumber } : undefined,
    gatewayResponse: {
      success: isSuccess,
      message: isSuccess
        ? "Payment successful"
        : "Payment failed - insufficient funds",
      gatewayTransactionId,
      responseCode: isSuccess ? "SUCCESS" : "FAILED",
    },
  });

  await transaction.save();
  return transaction;
};

// Method to process refund
transactionSchema.methods.processRefund = async function (
  refundAmount,
  reason
) {
  // Simulate refund processing
  await new Promise((resolve) => setTimeout(resolve, 500));

  this.paymentStatus = "refunded";
  this.refundDetails = {
    refundAmount: refundAmount || this.amount,
    refundReason: reason || "Customer request",
    refundDate: new Date(),
  };

  return this.save();
};

// Virtual for masked card number
savedCardSchema.virtual("maskedCardNumber").get(function () {
  const parts = this.cardNumber.split("-");
  return `${parts[0]}-****-****-${parts[3]}`;
});

// Virtual for formatted expiry
savedCardSchema.virtual("formattedExpiry").get(function () {
  return `${this.expiryMonth.toString().padStart(2, "0")}/${this.expiryYear}`;
});

module.exports = {
  UserPayment: mongoose.model("UserPayment", userPaymentSchema),
  Transaction: mongoose.model("Transaction", transactionSchema),
};
