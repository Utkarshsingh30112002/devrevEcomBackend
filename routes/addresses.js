const express = require("express");
const router = express.Router();
const User = require("../models/users");

// GET /api/addresses/:userId - Get all addresses for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        userId: userId,
        addresses: user.addresses || [],
        count: user.addresses ? user.addresses.length : 0,
      },
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
    });
  }
});

// POST /api/addresses/:userId - Add new address
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      street,
      area,
      city,
      state,
      pincode,
      country = "India",
      isDefault = false,
      addressType = "home",
    } = req.body;

    // Validate required fields
    if (!street || !area || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Street, area, city, state, and pincode are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = [];
    }

    // If this is the first address or isDefault is true, set it as default
    if (user.addresses.length === 0 || isDefault) {
      // Remove default from all other addresses
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      street,
      area,
      city,
      state,
      pincode,
      country,
      isDefault: user.addresses.length === 0 || isDefault,
      addressType,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.json({
      success: true,
      message: "Address added successfully",
      data: {
        userId: userId,
        address: newAddress,
        totalAddresses: user.addresses.length,
      },
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding address",
    });
  }
});

// PUT /api/addresses/:userId/:addressIndex - Update address
router.put("/:userId/:addressIndex", async (req, res) => {
  try {
    const { userId, addressIndex } = req.params;
    const {
      street,
      area,
      city,
      state,
      pincode,
      country,
      isDefault,
      addressType,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.addresses || addressIndex >= user.addresses.length) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Update address fields
    if (street) user.addresses[addressIndex].street = street;
    if (area) user.addresses[addressIndex].area = area;
    if (city) user.addresses[addressIndex].city = city;
    if (state) user.addresses[addressIndex].state = state;
    if (pincode) user.addresses[addressIndex].pincode = pincode;
    if (country) user.addresses[addressIndex].country = country;
    if (addressType) user.addresses[addressIndex].addressType = addressType;

    // Handle default address setting
    if (isDefault !== undefined) {
      if (isDefault) {
        // Remove default from all other addresses
        user.addresses.forEach((addr, index) => {
          addr.isDefault = index === parseInt(addressIndex);
        });
      } else {
        user.addresses[addressIndex].isDefault = false;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      data: {
        userId: userId,
        address: user.addresses[addressIndex],
        totalAddresses: user.addresses.length,
      },
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating address",
    });
  }
});

// DELETE /api/addresses/:userId/:addressIndex - Delete address
router.delete("/:userId/:addressIndex", async (req, res) => {
  try {
    const { userId, addressIndex } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.addresses || addressIndex >= user.addresses.length) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const deletedAddress = user.addresses[addressIndex];
    const wasDefault = deletedAddress.isDefault;

    // Remove the address
    user.addresses.splice(addressIndex, 1);

    // If deleted address was default and there are other addresses, set first one as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: "Address deleted successfully",
      data: {
        userId: userId,
        deletedAddress: deletedAddress,
        totalAddresses: user.addresses.length,
      },
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting address",
    });
  }
});

// PUT /api/addresses/:userId/:addressIndex/default - Set address as default
router.put("/:userId/:addressIndex/default", async (req, res) => {
  try {
    const { userId, addressIndex } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.addresses || addressIndex >= user.addresses.length) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Remove default from all addresses
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });

    // Set the specified address as default
    user.addresses[addressIndex].isDefault = true;

    await user.save();

    res.json({
      success: true,
      message: "Default address updated successfully",
      data: {
        userId: userId,
        defaultAddress: user.addresses[addressIndex],
        totalAddresses: user.addresses.length,
      },
    });
  } catch (error) {
    console.error("Set default address error:", error);
    res.status(500).json({
      success: false,
      message: "Error setting default address",
    });
  }
});

// GET /api/addresses/:userId/default - Get default address
router.get("/:userId/default", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.addresses || user.addresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No addresses found",
      });
    }

    const defaultAddress =
      user.addresses.find((addr) => addr.isDefault) || user.addresses[0];

    res.json({
      success: true,
      data: {
        userId: userId,
        defaultAddress: defaultAddress,
      },
    });
  } catch (error) {
    console.error("Get default address error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching default address",
    });
  }
});

module.exports = router;
