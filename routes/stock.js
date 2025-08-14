const express = require("express");
const router = express.Router();
const Product = require("../models/products");

// GET /api/stock?type=mice or /api/stock?type=laptop
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;

    // Validate the type parameter
    if (!type || !["mice", "laptop"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type parameter. Must be either "mice" or "laptop"',
      });
    }

    // Map type to category
    const category = type === "mice" ? "mouse" : "laptop";

    // Fetch products with only essential fields for stock checking
    const products = await Product.find(
      { category: category },
      {
        productId: 1,
        name: 1,
        price: 1,
        stock: 1,
        specs: 1,
        _id: 0, // Exclude MongoDB _id
      }
    ).sort({ productId: 1 });

    // Transform data to match the lightweight format
    const stockData = products.map((product) => ({
      productId: product.productId,
      name: product.name,
      price: product.price,
      short_description: getShortDescription(product.name, type),
      stock: product.stock,
      specs: product.specs,
    }));

    res.json({
      success: true,
      type: type,
      count: stockData.length,
      data: stockData,
    });
  } catch (error) {
    console.error("Stock check error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stock information",
    });
  }
});

// Helper function to generate short descriptions
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

// GET /api/stock/check/:productId - Check stock for specific product
router.get("/check/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne(
      { productId: productId },
      {
        productId: 1,
        name: 1,
        price: 1,
        stock: 1,
        category: 1,
        specs: 1,
        _id: 0,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const type = product.category === "mouse" ? "mice" : "laptop";

    res.json({
      success: true,
      data: {
        productId: product.productId,
        name: product.name,
        price: product.price,
        short_description: getShortDescription(product.name, type),
        stock: product.stock,
        type: type,
        specs: product.specs,
      },
    });
  } catch (error) {
    console.error("Product stock check error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking product stock",
    });
  }
});

// GET /api/stock/low - Get products with low stock (less than 10)
router.get("/low", async (req, res) => {
  try {
    const { type } = req.query;
    const category =
      type === "mice" ? "mouse" : type === "laptop" ? "laptop" : null;

    const filter = { stock: { $lt: 10 } };
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter, {
      productId: 1,
      name: 1,
      price: 1,
      stock: 1,
      category: 1,
      specs: 1,
      _id: 0,
    }).sort({ stock: 1 });

    const stockData = products.map((product) => {
      const type = product.category === "mouse" ? "mice" : "laptop";
      return {
        productId: product.productId,
        name: product.name,
        price: product.price,
        short_description: getShortDescription(product.name, type),
        stock: product.stock,
        type: type,
        specs: product.specs,
      };
    });

    res.json({
      success: true,
      count: stockData.length,
      data: stockData,
    });
  } catch (error) {
    console.error("Low stock check error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching low stock products",
    });
  }
});

module.exports = router;
