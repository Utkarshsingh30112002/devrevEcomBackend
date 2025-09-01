const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const Cart = require("../models/cart");
const Product = require("../models/products");
const { Transaction } = require("../models/payments");
const { authenticateMultiOptional, authenticateMultiRequired } = require("../middleware/multiAuth");
const PincodeDelivery = require("../models/pincodeDelivery");
const User = require("../models/users");
const { sendFetchOrderCommand } = require("../utils/websocket");
async function buildDeeplinkMap(productIds) {
  const uniqueIds = Array.from(new Set(productIds.filter(Boolean)));
  if (uniqueIds.length === 0) return new Map();
  const products = await Product.find({ productId: { $in: uniqueIds } }).select("_id productId").lean();
  const map = new Map();
  for (const p of products) {
    map.set(p.productId, p._id?.toString());
  }
  return map;
}

function withDeeplink(items, deeplinkMap) {
  return (items || []).map((it) => {
    const plain = typeof it.toObject === "function" ? it.toObject() : it;
    const mongoId = deeplinkMap.get(plain.productId);
    if (mongoId) {
      plain.deeplink = `http://13.233.107.200/product/${mongoId}`;
    }
    return plain;
  });
}

// auth not used for now per request

// No auth middleware for now; validate using userId from request body

// POST /api/orders/create - Create new order from cart
router.post("/create", authenticateMultiRequired, async (req, res) => {
  try {
    const { deliveryAddressIndex, deliveryType = "standard", paymentMethod = "cod", notes = "" } = req.body;
    const userId = req.auth?.sub;

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
    // NOTE: Pincode validation temporarily disabled per request
    // const deliveryOptions = await PincodeDelivery.getDeliveryOptions(
    //   deliveryAddress.pincode
    // );
    // if (!deliveryOptions) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Delivery not available for this pincode",
    //   });
    // }
    const fallbackDeliveryOptions = {
      standard: {
        cost: 0,
        timeframe: { minDays: 3, maxDays: 4, description: "3-4 days" },
      },
      fast: {
        cost: 200,
        timeframe: { minDays: 1, maxDays: 2, description: "1-2 days" },
      },
    };

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
      deliveryCost: (fallbackDeliveryOptions[deliveryType] || fallbackDeliveryOptions.standard).cost,
      estimatedDelivery: (fallbackDeliveryOptions[deliveryType] || fallbackDeliveryOptions.standard).timeframe,
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

    // Send WebSocket command only if request is from chatbot (not frontend)
    if (req.body.source !== "frontend") {
      sendFetchOrderCommand(userId);
    }

    // Update product stock
    for (const item of orderItems) {
      await Product.findOneAndUpdate(
        { productId: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }

    // add deeplinks in created response (lightweight summary only has summary fields)
    const deeplinkMapCreate = await buildDeeplinkMap(orderItems.map((i) => i.productId));
    const orderItemsWithLinks = withDeeplink(orderItems, deeplinkMapCreate);

    res.json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId: order.orderId,
        orderSummary: {
          ...order.orderSummary,
          // include first two items with links for convenience
          itemsPreview: orderItemsWithLinks.slice(0, 2),
        },
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

// GET /api/orders/user (me) using auth - MUST come before /:orderId route
router.get("/user", authenticateMultiRequired, async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const { page = 1, limit = 10, status, includeCancelled } = req.query;
    let includes = req.query.include;
    const includeSet = new Set(
      Array.isArray(includes)
        ? includes.flatMap((v) => String(v).split(","))
        : includes
        ? String(includes).split(",")
        : []
    );

    const includeCancelledBool =
      String(includeCancelled || "").toLowerCase() === "true";

    let query = { userId: userId };
    if (!includeCancelledBool) {
      query.isActive = true;
    }
    if (status) {
      query.orderStatus = status;
    }

    const skip = (page - 1) * limit;
    const fields = [
      "orderId",
      "userId",
      "orderStatus",
      "paymentDetails.status",
      "deliveryDetails.deliveryStatus",
      "deliveredAt",
      "subtotal",
      "totalAmount",
      "items",
      "createdAt",
      "updatedAt",
    ];
    if (includeSet.has("returns")) {
      fields.push("returnRequests", "exchangeRequests");
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select(fields.join(" "))
      .lean();

    // Summarize
    // Return full order objects instead of summaries for frontend compatibility
    const deeplinkMap = await buildDeeplinkMap(
      orders.flatMap((o) => (o.items || []).map((i) => i.productId))
    );

    const fullOrders = orders.map((o) => ({
      _id: o._id,
      orderId: o.orderId,
      userId: o.userId,
      items: withDeeplink(o.items || [], deeplinkMap),
      deliveryDetails: o.deliveryDetails || {},
      paymentDetails: o.paymentDetails || {},
      orderStatus: o.orderStatus,
      subtotal: o.subtotal,
      deliveryCost: o.deliveryCost,
      discount: o.discount,
      totalAmount: o.totalAmount,
      notes: o.notes,
      isActive: o.isActive,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      deliveredAt: o.deliveredAt,
      returnRequests: o.returnRequests || [],
      exchangeRequests: o.exchangeRequests || [],
    }));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders: fullOrders,
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

// POST /api/orders/user/query (me) - same as GET /user, but reads params from body
router.post("/user/query", authenticateMultiRequired, async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const {
      page = 1,
      limit = 10,
      status,
      includeCancelled,
      include,
    } = req.body || {};

    const includeSet = new Set(
      Array.isArray(include)
        ? include.flatMap((v) => String(v).split(","))
        : include
        ? String(include).split(",")
        : []
    );

    const includeCancelledBool =
      String(includeCancelled || "").toLowerCase() === "true";

    let query = { userId: userId };
    if (!includeCancelledBool) {
      query.isActive = true;
    }
    if (status) {
      query.orderStatus = status;
    }

    const skip = (page - 1) * limit;
    const fields = [
      "orderId",
      "userId",
      "orderStatus",
      "paymentDetails.status",
      "deliveryDetails.deliveryStatus",
      "deliveredAt",
      "subtotal",
      "totalAmount",
      "items",
      "createdAt",
      "updatedAt",
    ];
    if (includeSet.has("returns")) {
      fields.push("returnRequests", "exchangeRequests");
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select(fields.join(" "))
      .lean();

    const deeplinkMap = await buildDeeplinkMap(
      orders.flatMap((o) => (o.items || []).map((i) => i.productId))
    );

    const fullOrders = orders.map((o) => ({
      _id: o._id,
      orderId: o.orderId,
      userId: o.userId,
      items: withDeeplink(o.items || [], deeplinkMap),
      deliveryDetails: o.deliveryDetails || {},
      paymentDetails: o.paymentDetails || {},
      orderStatus: o.orderStatus,
      subtotal: o.subtotal,
      deliveryCost: o.deliveryCost,
      discount: o.discount,
      totalAmount: o.totalAmount,
      notes: o.notes,
      isActive: o.isActive,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      deliveredAt: o.deliveredAt,
      returnRequests: o.returnRequests || [],
      exchangeRequests: o.exchangeRequests || [],
    }));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders: fullOrders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get user orders (body) error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
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

// GET /api/orders/status/:orderId - Lightweight order status query
router.post("/status/:orderId", authenticateMultiOptional, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;
    const order = await Order.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    const authSub = req.auth?.sub;
    const matches = userId || authSub;
    if (!matches || order.userId?.toString() !== matches) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    return res.json({
      success: true,
      data: {
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        deliveryStatus: order.deliveryDetails?.deliveryStatus,
        deliveredAt: order.deliveredAt,
        paymentStatus: order.paymentDetails?.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get order status error:", error);
    return res.status(500).json({ success: false, message: "Error fetching order status" });
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

// PUT /api/orders/:orderId/address - Update delivery address within 24 hours and before shipping
router.put("/:orderId/address", authenticateMultiRequired, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { addressIndex } = req.body;

    const order = await Order.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    const authSub = req.auth?.sub;
    if (!authSub || order.userId?.toString() !== authSub) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const created = new Date(order.createdAt).getTime();
    const now = Date.now();
    const twentyFourHoursMs = 24 * 60 * 60 * 1000;
    const withinWindow = now - created <= twentyFourHoursMs;
    const notShipped = ["pending", "confirmed", "processing"].includes(order.orderStatus);

    if (!withinWindow || !notShipped) {
      return res.status(400).json({
        success: false,
        message: "Address can only be updated within 24 hours and before shipping",
      });
    }

    // Fetch saved address by index from user's saved addresses
    const user = await User.findById(authSub).select("addresses");
    if (!user || !user.addresses || addressIndex === undefined || addressIndex < 0 || addressIndex >= user.addresses.length) {
      return res.status(400).json({ success: false, message: "Invalid address index" });
    }

    const savedAddress = user.addresses[addressIndex];

    // Pincode deliverability check disabled per request

    order.deliveryDetails.address = {
      street: savedAddress.street,
      area: savedAddress.area,
      city: savedAddress.city,
      state: savedAddress.state,
      pincode: savedAddress.pincode,
      country: savedAddress.country || "India",
    };
    await order.save();

    return res.json({
      success: true,
      message: "Delivery address updated",
      data: {
        orderId: order.orderId,
        address: order.deliveryDetails.address,
      },
    });
  } catch (error) {
    console.error("Update address error:", error);
    return res.status(500).json({ success: false, message: "Error updating address" });
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

// POST /api/orders/:orderId/return - Create a return request within 3 days from deliveredAt
router.post("/:orderId/return", authenticateMultiRequired, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemIds = [], reason, pickupDate } = req.body || {};

    const order = await Order.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    const authSub = req.auth?.sub;
    if (!authSub || order.userId?.toString() !== authSub) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    if (!order.deliveredAt || !order.isWithinReturnWindow()) {
      return res.status(400).json({
        success: false,
        message: "Return window is 3 days from delivery",
      });
    }

    const parsedPickup = pickupDate ? new Date(pickupDate) : undefined;
    const { requestId } = await order.addReturnRequest(itemIds, reason, parsedPickup);
    // Reflect requested state at the top-level
    order.orderStatus = "return_requested";
    await order.save();

    return res.json({
      success: true,
      message: "Return request created",
      data: { requestId },
    });
  } catch (error) {
    console.error("Create return request error:", error);
    return res.status(500).json({ success: false, message: "Error creating return request" });
  }
});

// POST /api/orders/:orderId/exchange - Create an exchange request within 3 days from deliveredAt
router.post("/:orderId/exchange", authenticateMultiRequired, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemIds = [], reason, pickupDate } = req.body || {};

    const order = await Order.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    const authSub = req.auth?.sub;
    if (!authSub || order.userId?.toString() !== authSub) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    if (!order.deliveredAt || !order.isWithinReturnWindow()) {
      return res.status(400).json({
        success: false,
        message: "Exchange window is 3 days from delivery",
      });
    }

    const parsedPickup = pickupDate ? new Date(pickupDate) : undefined;
    const { requestId } = await order.addExchangeRequest(itemIds, reason, parsedPickup);
    // Reflect requested state at the top-level
    order.orderStatus = "exchange_requested";
    await order.save();

    return res.json({
      success: true,
      message: "Exchange request created",
      data: { requestId },
    });
  } catch (error) {
    console.error("Create exchange request error:", error);
    return res.status(500).json({ success: false, message: "Error creating exchange request" });
  }
});

// DELETE /api/orders/:orderId - Cancel order
router.delete("/:orderId", authenticateMultiRequired, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemIds } = req.body || {};

    const order = await Order.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only allow cancellation before shipping for now
    if (!["pending", "confirmed", "processing"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    const authSub = req.auth?.sub;
    if (!authSub || order.userId?.toString() !== authSub) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const isPartial = Array.isArray(itemIds) && itemIds.length > 0;

    if (isPartial) {
      // Partial cancel: mark selected items as cancelled and restock
      let cancelledCount = 0;
      for (const item of order.items) {
        if (itemIds.includes(item.productId) && item.status === "active") {
          item.status = "cancelled";
          cancelledCount += 1;
          await Product.findOneAndUpdate(
            { productId: item.productId },
            { $inc: { stock: item.quantity } }
          );
        }
      }
      if (cancelledCount === 0) {
        return res.status(400).json({ success: false, message: "No matching active items to cancel" });
      }
      // Recalculate totals
      order.calculateTotals();
      // If all items cancelled, mark order cancelled/inactive
      const anyActive = order.items.some((i) => i.status === "active");
      if (!anyActive) {
        order.orderStatus = "cancelled";
        order.isActive = false;
      }
      await order.save();
    } else {
      // Full cancel: restock all items
      for (const item of order.items) {
        if (item.status === "active") {
          await Product.findOneAndUpdate(
            { productId: item.productId },
            { $inc: { stock: item.quantity } }
          );
          item.status = "cancelled";
        }
      }
      order.orderStatus = "cancelled";
      order.isActive = false;
      order.calculateTotals();
      await order.save();
    }

    // TODO: trigger refund workflow based on cancelled items' value

    res.json({
      success: true,
      message: isPartial ? "Selected items cancelled" : "Order cancelled successfully",
      data: {
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        subtotal: order.subtotal,
        totalAmount: order.totalAmount,
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
