const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const { authenticateMultiRequired } = require("../middleware/multiAuth");

// POST /api/returns - Create return or exchange request
router.post("/", authenticateMultiRequired, async (req, res) => {
  try {
    const { orderId, itemIds = [], reason_code, return_type, pickupDate, exchange_details } = req.body || {};

    if (!orderId || !return_type) {
      return res.status(400).json({ success: false, message: "orderId and return_type are required" });
    }
    if (!["refund", "exchange"].includes(return_type)) {
      return res.status(400).json({ success: false, message: "return_type must be 'refund' or 'exchange'" });
    }

    const order = await Order.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    const authSub = req.auth?.sub;
    if (!authSub || order.userId?.toString() !== authSub) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    if (!order.deliveredAt || !order.isWithinReturnWindow()) {
      return res.status(400).json({ success: false, message: "Return window is 3 days from delivery" });
    }

    const parsedPickup = pickupDate ? new Date(pickupDate) : undefined;

    if (return_type === "refund") {
      const { requestId } = await order.addReturnRequest(itemIds, reason_code, parsedPickup);
      return res.json({ success: true, message: "Return request created", data: { requestId } });
    }

    // exchange
    const { requestId } = await order.addExchangeRequest(itemIds, reason_code || exchange_details, parsedPickup);
    return res.json({ success: true, message: "Exchange request created", data: { requestId } });
  } catch (error) {
    console.error("Create return/exchange error:", error);
    return res.status(500).json({ success: false, message: "Error creating return/exchange" });
  }
});

// POST /api/returns/:returnId/schedule-pickup - Mock scheduling pickup
router.post("/:returnId/schedule-pickup", async (req, res) => {
  try {
    const { returnId } = req.params;
    const { preferred_date, preferred_time } = req.body || {};
    if (!preferred_date) {
      return res.status(400).json({ success: false, message: "preferred_date is required" });
    }
    // Mock success
    return res.json({
      success: true,
      message: "Pickup scheduled",
      data: { returnId, scheduled_date: preferred_date, scheduled_time: preferred_time || "09:00-18:00" },
    });
  } catch (error) {
    console.error("Schedule pickup error:", error);
    return res.status(500).json({ success: false, message: "Error scheduling pickup" });
  }
});

module.exports = router;


