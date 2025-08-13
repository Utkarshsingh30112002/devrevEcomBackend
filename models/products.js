// products.js - Mongoose Schema Definition

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // --- Common Fields for ALL Products ---
    productId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ["laptop", "mouse"], // Restricts category to these values
    },

    // --- Flexible Specs Field for UNIQUE Attributes ---
    specs: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Allows any data type inside
    },

    // --- FAQ Section ---
    faq: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
