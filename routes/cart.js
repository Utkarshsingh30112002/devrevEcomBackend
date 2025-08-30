const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Product = require("../models/products");
const { sendFetchCartCommand } = require("../utils/websocket");
const { authenticateMultiRequired } = require("../middleware/multiAuth");

// Helper function to get short description
function getShortDescription(productName, type) {
  const descriptions = {
    mice: {
      "Logitech MX200":
        "High-performance wireless mouse with ergonomic design.",
      "HP Z3700": "Compact wireless mouse perfect for office and travel use.",
      "Razer Basilisk X": "Gaming mouse with HyperSpeed wireless technology.",
      "Dell WM126": "Affordable wireless mouse for everyday computing.",
      "Microsoft BT5600":
        "Bluetooth mouse with compact design and long battery life.",
    },
    laptop: {
      "MSI Model 100": "Powerful laptop with Ryzen 7 processor and 1TB SSD.",
      "Acer Model 101": "High-performance laptop with 32GB RAM and Ryzen 7.",
      "Lenovo Model 102":
        "16GB RAM laptop with 256GB SSD and Ryzen 7 processor.",
      "Dell Model 103": "Premium laptop with 8GB RAM and 256GB SSD storage.",
      "Asus Model 104": "High-end laptop with 32GB RAM and Intel i3 processor.",
    },
  };

  return (
    descriptions[type][productName] ||
    `${
      type === "mice" ? "Wireless mouse" : "Laptop"
    } with excellent performance.`
  );
}

// GET /api/cart/me - Get my cart
router.get("/me", authenticateMultiRequired, async (req, res) => {
  try {
    const userId = req.auth?.sub;

    let cart = await Cart.findOne({ userId: userId, isActive: true });

    if (!cart) {
      // Create new cart if doesn't exist
      cart = new Cart({ userId: userId, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      data: {
        user_uuid: req.auth.user_uuid,
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
    });
  }
});

// POST /api/cart/me/add - Add item to cart
router.post("/me/add", authenticateMultiRequired, async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Find the product to get its details
    const product = await Product.findOne(
      { productId: productId },
      {
        productId: 1,
        name: 1,
        price: 1,
        imageUrl: 1,
        category: 1,
        stock: 1,
        _id: 0,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }
    userId;
    // Get or create cart
    let cart = await Cart.findOne({ userId: userId, isActive: true });

    if (!cart) {
      cart = new Cart({ userId: userId, items: [] });
    }

    // Prepare product data for cart
    const type = product.category === "mouse" ? "mice" : "laptop";
    const productData = {
      productId: product.productId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      type: type,
      short_description: getShortDescription(product.name, type),
    };

    // Add item to cart
    await cart.addItem(productData, quantity);

    // Send WebSocket command only if request is from chatbot (not frontend)
    if (req.body.source !== "frontend") {
      sendFetchCartCommand(userId);
    }

    res.json({
      success: true,
      message: "Item added to cart successfully",
      data: {
        user_uuid: req.auth.user_uuid,
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding item to cart",
    });
  }
});

// PUT /api/cart/me/update - Update item quantity
router.put("/me/update", authenticateMultiRequired, async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    const cart = await Cart.findOne({ userId: userId, isActive: true });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Check stock availability if quantity is being increased
    if (quantity > 0) {
      const product = await Product.findOne({ productId: productId });
      if (product && product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`,
        });
      }
    }

    await cart.updateQuantity(productId, quantity);

    // Send WebSocket command only if request is from chatbot (not frontend)
    if (req.body.source !== "frontend") {
      sendFetchCartCommand(userId);
    }

    res.json({
      success: true,
      message: "Cart updated successfully",
      data: {
        user_uuid: req.auth.user_uuid,
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating cart",
    });
  }
});

// DELETE /api/cart/me/remove/:productId - Remove item from cart
router.delete("/me/remove/:productId", authenticateMultiRequired, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.auth?.sub;

    const cart = await Cart.findOne({ userId: userId, isActive: true });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await cart.removeItem(productId);

    // Send WebSocket command only if request is from chatbot (not frontend)
    if (req.body.source !== "frontend") {
      sendFetchCartCommand(userId);
    }

    res.json({
      success: true,
      message: "Item removed from cart successfully",
      data: {
        user_uuid: req.auth.user_uuid,
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing item from cart",
    });
  }
});

// DELETE /api/cart/me/clear - Clear entire cart
router.delete("/me/clear", authenticateMultiRequired, async (req, res) => {
  try {
    const userId = req.auth?.sub;

    const cart = await Cart.findOne({ userId: userId, isActive: true });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await cart.clearCart();

    // Send WebSocket command only if request is from chatbot (not frontend)
    if (req.body.source !== "frontend") {
      sendFetchCartCommand(userId);
    }

    res.json({
      success: true,
      message: "Cart cleared successfully",
      data: {
        user_uuid: req.auth.user_uuid,
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
    });
  }
});

// GET /api/cart/me/count - Get cart item count
router.get("/me/count", authenticateMultiRequired, async (req, res) => {
  try {
    const userId = req.auth?.sub;

    const cart = await Cart.findOne({ userId: userId, isActive: true });

    if (!cart) {
      return res.json({
        success: true,
        data: {
          totalItems: 0,
          itemCount: 0,
        },
      });
    }

    res.json({
      success: true,
      data: {
        totalItems: cart.totalItems,
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error("Get cart count error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart count",
    });
  }
});

module.exports = router;
