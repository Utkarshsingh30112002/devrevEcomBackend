const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    short_description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    type: { type: String, required: true, enum: ["mice", "laptop"] },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    totalItems: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate totals
cartSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function (productData, quantity = 1) {
  const existingItemIndex = this.items.findIndex(
    (item) => item.productId === productData.productId
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({
      productId: productData.productId,
      name: productData.name,
      price: productData.price,
      short_description: productData.short_description,
      imageUrl: productData.imageUrl,
      quantity: quantity,
      type: productData.type,
    });
  }

  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter((item) => item.productId !== productId);
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateQuantity = function (productId, quantity) {
  const item = this.items.find((item) => item.productId === productId);
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    item.quantity = quantity;
    return this.save();
  }
  throw new Error("Item not found in cart");
};

// Method to clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  return this.save();
};

module.exports = mongoose.model("Cart", cartSchema);
