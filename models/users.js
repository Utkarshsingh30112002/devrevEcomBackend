const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    // --- User Information ---
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    user_uuid: { type: String, required: true, unique: true, default: uuidv4, immutable: true },

    // --- Contact Information ---
    phone: { type: String, trim: true },
    addresses: [
      {
        street: { type: String, required: true, trim: true },
        area: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        pincode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true, default: "India" },
        isDefault: { type: Boolean, default: false },
        addressType: {
          type: String,
          enum: ["home", "office", "other"],
          default: "home",
        },
      },
    ],

    // --- User Status ---
    isActive: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // --- Profile Information ---
    profileImage: { type: String, trim: true },
    dateOfBirth: { type: Date },

    // --- Account Information ---
    lastLogin: { type: Date },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
