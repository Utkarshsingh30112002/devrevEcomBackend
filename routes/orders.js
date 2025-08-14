const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const Cart = require("../models/cart");
const Product = require("../models/products");
const PincodeDelivery = require("../models/pincodeDelivery");
const User = require("../models/users");

// POST /api/orders/create - Create new order from cart
router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      deliveryAddressIndex,
      deliveryType = "standard",
      paymentMethod = "cod",
      notes = "",
    } = req.body;

    if (!userId || deliveryAddressIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: "User ID and delivery address index are required",
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId: userId, isActive: true });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Get user's address
    const user = await User.findById(userId);
    if (!user || !user.addresses || !user.addresses[deliveryAddressIndex]) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery address",
      });
    }

    const deliveryAddress = user.addresses[deliveryAddressIndex];

    // Get delivery options for the pincode
    const deliveryOptions = await PincodeDelivery.getDeliveryOptions(
      deliveryAddress.pincode
    );
    if (!deliveryOptions) {
      return res.status(400).json({
        success: false,
        message: "Delivery not available for this pincode",
      });
    }

    // Prepare order items from cart
    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      type: item.type,
      totalPrice: item.price * item.quantity,
    }));

    // Calculate delivery details
    const deliveryDetails = {
      address: deliveryAddress,
      deliveryType: deliveryType,
      deliveryCost: deliveryOptions[deliveryType].cost,
      estimatedDelivery: deliveryOptions[deliveryType].timeframe,
    };

    // Create order
    const order = new Order({
      userId: userId,
      items: orderItems,
      deliveryDetails: deliveryDetails,
      paymentDetails: {
        method: paymentMethod,
        amount: cart.totalAmount + deliveryDetails.deliveryCost,
      },
      subtotal: cart.totalAmount,
      deliveryCost: deliveryDetails.deliveryCost,
      discount: 0,
      notes: notes,
    });

    // Calculate totals
    order.calculateTotals();
    await order.save();

    // Clear the cart after successful order creation
    await cart.clearCart();

    // Update product stock
    for (const item of orderItems) {
      await Product.findOneAndUpdate(
        { productId: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }

    res.json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId: order.orderId,
        orderSummary: order.orderSummary,
        totalAmount: order.totalAmount,
        estimatedDelivery: order.deliveryDetails.estimatedDelivery,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
      stack: error.stack,
    });
  }
});

// GET /api/orders/:orderId - Get order details
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByOrderId(orderId).populate(
      "userId",
      "firstName lastName email phone"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order",
    });
  }
});

// GET /api/orders/user/:userId - Get user's orders
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    let query = { userId: userId, isActive: true };
    if (status) {
      query.orderStatus = status;
    }

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders: orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
    });
  }
});

// PUT /api/orders/:orderId/status - Update order status
router.put("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.updateStatus(status);
    if (notes) {
      order.notes = notes;
      await order.save();
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: {
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        deliveryStatus: order.deliveryDetails.deliveryStatus,
      },
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
    });
  }
});

// PUT /api/orders/:orderId/payment - Update payment status
router.put("/:orderId/payment", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, transactionId } = req.body;

    const validStatuses = ["pending", "completed", "failed", "refunded"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const order = await Order.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.updatePaymentStatus(status, transactionId);

    res.json({
      success: true,
      message: "Payment status updated successfully",
      data: {
        orderId: order.orderId,
        paymentStatus: order.paymentDetails.status,
        transactionId: order.paymentDetails.transactionId,
      },
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating payment status",
    });
  }
});

// PUT /api/orders/:orderId/tracking - Add tracking number
router.put("/:orderId/tracking", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({
        success: false,
        message: "Tracking number is required",
      });
    }

    const order = await Order.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.addTrackingNumber(trackingNumber);

    res.json({
      success: true,
      message: "Tracking number added successfully",
      data: {
        orderId: order.orderId,
        trackingNumber: order.deliveryDetails.trackingNumber,
        orderStatus: order.orderStatus,
        deliveryStatus: order.deliveryDetails.deliveryStatus,
      },
    });
  } catch (error) {
    console.error("Add tracking number error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding tracking number",
    });
  }
});

// DELETE /api/orders/:orderId - Cancel order
router.delete("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only allow cancellation of pending or confirmed orders
    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findOneAndUpdate(
        { productId: item.productId },
        { $inc: { stock: item.quantity } }
      );
    }

    // Mark order as cancelled
    order.orderStatus = "cancelled";
    order.isActive = false;
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: {
        orderId: order.orderId,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
    });
  }
});

// GET /api/orders/admin/all - Get all orders (admin)
router.get("/admin/all", async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;

    let query = { isActive: true };
    if (status) query.orderStatus = status;
    if (paymentStatus) query["paymentDetails.status"] = paymentStatus;

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders: orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
});

// GET /api/orders/admin/summary - Get order summary (admin)
router.get("/admin/summary", async (req, res) => {
  try {
    const summary = await Order.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const paymentSummary = await Order.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$paymentDetails.status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments({ isActive: true });
    const totalRevenue = await Order.aggregate([
      { $match: { isActive: true, "paymentDetails.status": "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      success: true,
      data: {
        totalOrders: totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        orderStatusSummary: summary,
        paymentStatusSummary: paymentSummary,
      },
    });
  } catch (error) {
    console.error("Get order summary error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order summary",
    });
  }
});

module.exports = router;
