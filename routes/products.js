const express = require("express");
const router = express.Router();
const Product = require("../models/products");

// GET all products
router.get("/", async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, inStock, search, productId } =
      req.query;

    let filter = {};

    // Apply filters
    if (category) filter.category = category;
    if (brand) filter.brand = { $regex: brand, $options: "i" };
    if (productId) filter.productId = { $regex: productId, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (inStock === "true") filter.stock = { $gt: 0 };

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { productId: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Add deeplink URLs to each product
    const productsWithDeeplinks = products.map((product) => ({
      ...product.toObject(),
      deeplink: `http://13.233.107.200/product/${product._id}`,
    }));

    res.json(productsWithDeeplinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add deeplink URL to the product
    const productWithDeeplink = {
      ...product.toObject(),
      deeplink: `http://13.233.107.200/product/${product._id}`,
    };

    res.json(productWithDeeplink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET product by productId
router.get("/productId/:productId", async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add deeplink URL to the product
    const productWithDeeplink = {
      ...product.toObject(),
      deeplink: `http://13.233.107.200/product/${product._id}`,
    };

    res.json(productWithDeeplink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add deeplink URL to the updated product
    const productWithDeeplink = {
      ...product.toObject(),
      deeplink: `http://13.233.107.200/product/${product._id}`,
    };

    res.json(productWithDeeplink);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH update stock
router.patch("/:id/stock", async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add deeplink URL to the product with updated stock
    const productWithDeeplink = {
      ...product.toObject(),
      deeplink: `http://13.233.107.200/product/${product._id}`,
    };

    res.json(productWithDeeplink);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
