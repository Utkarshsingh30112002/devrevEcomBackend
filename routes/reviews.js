const express = require("express");
const router = express.Router();
const Review = require("../models/reviews");

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const { product, user, rating, isVerified } = req.query;

    let filter = {};

    // Apply filters
    if (product) filter.product = product;
    if (user) filter.user = user;
    if (rating) filter.rating = Number(rating);
    if (isVerified !== undefined) filter.isVerified = isVerified === "true";

    const reviews = await Review.find(filter)
      .populate("user", "firstName lastName username")
      .populate("product", "name productId")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single review by ID
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "firstName lastName username")
      .populate("product", "name productId");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new review
router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);
    const newReview = await review.save();

    // Populate user and product info
    const populatedReview = await Review.findById(newReview._id)
      .populate("user", "firstName lastName username")
      .populate("product", "name productId");

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update review
router.put("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("user", "firstName lastName username")
      .populate("product", "name productId");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE review
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET reviews by product ID
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "firstName lastName username")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET reviews by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate("product", "name productId")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH update review helpful/not helpful counts
router.patch("/:id/helpful", async (req, res) => {
  try {
    const { isHelpful } = req.body;
    const updateField = isHelpful ? "isHelpful" : "isNotHelpful";

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { [updateField]: 1 } },
      { new: true }
    )
      .populate("user", "firstName lastName username")
      .populate("product", "name productId");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET average rating for a product
router.get("/product/:productId/average", async (req, res) => {
  try {
    const result = await Review.aggregate([
      {
        $match: {
          product: new require("mongoose").Types.ObjectId(req.params.productId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    }

    const ratingDistribution = result[0].ratingDistribution.reduce(
      (acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      },
      {}
    );

    res.json({
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews,
      ratingDistribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
