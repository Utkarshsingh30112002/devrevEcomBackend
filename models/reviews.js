const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // --- Review Content ---
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be a whole number between 1 and 5",
      },
    },

    // --- References ---
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // --- Review Status ---
    isVerified: { type: Boolean, default: false },
    isHelpful: { type: Number, default: 0 },
    isNotHelpful: { type: Number, default: 0 },

    // --- Additional Information ---
    images: [{ type: String, trim: true }], // URLs to review images
    tags: [{ type: String, trim: true }], // Tags like "verified purchase", "top reviewer", etc.
  },
  { timestamps: true }
);

// Compound index to ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Virtual for average rating (can be used for product aggregation)
reviewSchema.virtual("ratingText").get(function () {
  const ratings = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };
  return ratings[this.rating] || "Unknown";
});

module.exports = mongoose.model("Review", reviewSchema);
