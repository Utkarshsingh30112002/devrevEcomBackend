const mongoose = require("mongoose");

const pincodeDeliverySchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v);
        },
        message: "Pincode must be exactly 6 digits",
      },
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    standardDelivery: {
      minDays: { type: Number, required: true, min: 1 },
      maxDays: { type: Number, required: true, min: 1 },
      description: { type: String, required: true },
    },
    fastDelivery: {
      minDays: { type: Number, required: true, min: 0 },
      maxDays: { type: Number, required: true, min: 1 },
      description: { type: String, required: true },
    },
    additionalCost: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deliveryZones: {
      type: String,
      enum: ["local", "metro", "tier1", "tier2", "tier3"],
      default: "tier2",
    },
  },
  { timestamps: true }
);

// Index for efficient pincode lookups
pincodeDeliverySchema.index({ pincode: 1 });
pincodeDeliverySchema.index({ city: 1 });
pincodeDeliverySchema.index({ isActive: 1 });

// Virtual for formatted delivery time
pincodeDeliverySchema.virtual("standardDeliveryTime").get(function () {
  if (this.standardDelivery.minDays === this.standardDelivery.maxDays) {
    return `${this.standardDelivery.minDays} day${
      this.standardDelivery.minDays > 1 ? "s" : ""
    }`;
  }
  return `${this.standardDelivery.minDays}-${this.standardDelivery.maxDays} days`;
});

pincodeDeliverySchema.virtual("fastDeliveryTime").get(function () {
  if (this.fastDelivery.minDays === 0) {
    return this.fastDelivery.maxDays === 1
      ? "Same Day"
      : `Same Day-${this.fastDelivery.maxDays}`;
  }
  if (this.fastDelivery.minDays === this.fastDelivery.maxDays) {
    return `${this.fastDelivery.minDays} day${
      this.fastDelivery.minDays > 1 ? "s" : ""
    }`;
  }
  return `${this.fastDelivery.minDays}-${this.fastDelivery.maxDays} days`;
});

// Method to calculate delivery cost
pincodeDeliverySchema.methods.calculateDeliveryCost = function (
  deliveryType = "standard"
) {
  const baseCost = 100; // Base delivery cost
  if (deliveryType === "fast") {
    return baseCost + this.additionalCost;
  }
  return baseCost;
};

// Method to get delivery timeframe
pincodeDeliverySchema.methods.getDeliveryTimeframe = function (
  deliveryType = "standard"
) {
  if (deliveryType === "fast") {
    return {
      minDays: this.fastDelivery.minDays,
      maxDays: this.fastDelivery.maxDays,
      description: this.fastDelivery.description,
    };
  }
  return {
    minDays: this.standardDelivery.minDays,
    maxDays: this.standardDelivery.maxDays,
    description: this.standardDelivery.description,
  };
};

// Static method to find by pincode
pincodeDeliverySchema.statics.findByPincode = function (pincode) {
  return this.findOne({ pincode: pincode, isActive: true });
};

// Static method to get delivery options for a pincode
pincodeDeliverySchema.statics.getDeliveryOptions = function (pincode) {
  return this.findOne({ pincode: pincode, isActive: true }).then((delivery) => {
    if (!delivery) {
      return null;
    }
    return {
      pincode: delivery.pincode,
      city: delivery.city,
      region: delivery.region,
      standard: {
        timeframe: delivery.getDeliveryTimeframe("standard"),
        cost: delivery.calculateDeliveryCost("standard"),
        description: delivery.standardDelivery.description,
      },
      fast: {
        timeframe: delivery.getDeliveryTimeframe("fast"),
        cost: delivery.calculateDeliveryCost("fast"),
        description: delivery.fastDelivery.description,
      },
    };
  });
};

module.exports = mongoose.model("PincodeDelivery", pincodeDeliverySchema);
