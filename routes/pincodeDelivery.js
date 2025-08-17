const express = require("express");
const router = express.Router();
const PincodeDelivery = require("../models/pincodeDelivery");

// GET /api/pincode-delivery/:pincode - Get delivery options for a pincode
router.get("/:pincode", async (req, res) => {
  try {
    const { pincode } = req.params;

    // Validate pincode format
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pincode format. Must be 6 digits.",
      });
    }

    const deliveryOptions = await PincodeDelivery.getDeliveryOptions(pincode);

    if (!deliveryOptions) {
      return res.status(404).json({
        success: false,
        message: "Delivery not available for this pincode",
      });
    }

    res.json({
      success: true,
      data: deliveryOptions,
    });
  } catch (error) {
    console.error("Get delivery options error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching delivery options",
    });
  }
});

// GET /api/pincode-delivery/check/:pincode - Quick check if delivery is available
router.get("/check/:pincode", async (req, res) => {
  try {
    const { pincode } = req.params;

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pincode format. Must be 6 digits.",
      });
    }

    const delivery = await PincodeDelivery.findByPincode(pincode);

    res.json({
      success: true,
      data: {
        pincode: pincode,
        isAvailable: !!delivery,
        city: delivery ? delivery.city : null,
        region: delivery ? delivery.region : null,
      },
    });
  } catch (error) {
    console.error("Check delivery availability error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking delivery availability",
    });
  }
});

// GET /api/pincode-delivery/city/:city - Get all pincodes for a city
router.get("/city/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const deliveries = await PincodeDelivery.find(
      { city: { $regex: new RegExp(city, "i") }, isActive: true },
      {
        pincode: 1,
        city: 1,
        region: 1,
        deliveryZones: 1,
        additionalCost: 1,
        standardDelivery: 1,
        fastDelivery: 1,
        _id: 0,
      }
    )
      .sort({ pincode: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PincodeDelivery.countDocuments({
      city: { $regex: new RegExp(city, "i") },
      isActive: true,
    });

    res.json({
      success: true,
      data: {
        city: city,
        deliveries: deliveries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get city deliveries error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching city deliveries",
    });
  }
});

// GET /api/pincode-delivery/zones/:zone - Get deliveries by zone
router.get("/zones/:zone", async (req, res) => {
  try {
    const { zone } = req.params;
    const validZones = ["local", "metro", "tier1", "tier2", "tier3"];

    if (!validZones.includes(zone)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid zone. Must be one of: local, metro, tier1, tier2, tier3",
      });
    }

    const deliveries = await PincodeDelivery.find(
      { deliveryZones: zone, isActive: true },
      {
        pincode: 1,
        city: 1,
        region: 1,
        deliveryZones: 1,
        additionalCost: 1,
        standardDelivery: 1,
        fastDelivery: 1,
        _id: 0,
      }
    ).sort({ city: 1, pincode: 1 });

    res.json({
      success: true,
      data: {
        zone: zone,
        count: deliveries.length,
        deliveries: deliveries,
      },
    });
  } catch (error) {
    console.error("Get zone deliveries error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching zone deliveries",
    });
  }
});

// GET /api/pincode-delivery/summary - Get delivery summary
router.get("/summary", async (req, res) => {
  try {
    const summary = await PincodeDelivery.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$deliveryZones",
          count: { $sum: 1 },
          cities: { $addToSet: "$city" },
          avgAdditionalCost: { $avg: "$additionalCost" },
          minAdditionalCost: { $min: "$additionalCost" },
          maxAdditionalCost: { $max: "$additionalCost" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalPincodes = await PincodeDelivery.countDocuments({
      isActive: true,
    });
    const totalCities = await PincodeDelivery.distinct("city", {
      isActive: true,
    });

    res.json({
      success: true,
      data: {
        totalPincodes: totalPincodes,
        totalCities: totalCities.length,
        zones: summary,
      },
    });
  } catch (error) {
    console.error("Get delivery summary error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching delivery summary",
    });
  }
});

// POST /api/pincode-delivery/add - Add new pincode delivery data (admin)
router.post("/add", async (req, res) => {
  try {
    const {
      pincode,
      city,
      region,
      standardDelivery,
      fastDelivery,
      additionalCost = 0,
      deliveryZones = "tier2",
    } = req.body;

    // Validate required fields
    if (!pincode || !city || !region || !standardDelivery || !fastDelivery) {
      return res.status(400).json({
        success: false,
        message:
          "Pincode, city, region, standardDelivery, and fastDelivery are required",
      });
    }

    // Validate pincode format
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pincode format. Must be 6 digits.",
      });
    }

    // Check if pincode already exists
    const existing = await PincodeDelivery.findOne({ pincode: pincode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Pincode already exists",
      });
    }

    // Create new pincode delivery record
    const newDelivery = new PincodeDelivery({
      pincode,
      city,
      region,
      standardDelivery,
      fastDelivery,
      additionalCost,
      deliveryZones,
    });

    await newDelivery.save();

    res.json({
      success: true,
      message: "Pincode delivery data added successfully",
      data: newDelivery,
    });
  } catch (error) {
    console.error("Add pincode delivery error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding pincode delivery data",
    });
  }
});

// POST /api/pincode-delivery/calculate - Calculate delivery cost and time
router.post("/calculate", async (req, res) => {
  try {
    const { pincode, deliveryType = "standard", orderAmount = 0 } = req.body;

    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: "Pincode is required",
      });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pincode format. Must be 6 digits.",
      });
    }

    const delivery = await PincodeDelivery.findByPincode(pincode);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not available for this pincode",
      });
    }

    const deliveryCost = delivery.calculateDeliveryCost(deliveryType);
    const timeframe = delivery.getDeliveryTimeframe(deliveryType);

    // No free delivery threshold - use actual delivery cost
    const finalDeliveryCost = deliveryCost;

    res.json({
      success: true,
      data: {
        pincode: pincode,
        city: delivery.city,
        region: delivery.region,
        deliveryType: deliveryType,
        timeframe: timeframe,
        baseCost: deliveryCost,
        finalCost: finalDeliveryCost,
        orderAmount: orderAmount,
        additionalInfo: {
          zone: delivery.deliveryZones,
          additionalCost: delivery.additionalCost,
        },
      },
    });
  } catch (error) {
    console.error("Calculate delivery error:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating delivery",
    });
  }
});

module.exports = router;
