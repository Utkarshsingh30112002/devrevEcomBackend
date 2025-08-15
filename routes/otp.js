const express = require("express");
const { transporter } = require("../config/email");
const OTP = require("../models/otp");
const router = express.Router();

// Function to generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/otp/send
router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Generate random 6-digit OTP
    const otp = generateOTP();

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to database
    await OTP.create({
      email,
      otp,
      expiresAt,
    });

    // Email configuration
    const mailOptions = {
      from: "utkarshsingh8871@gmail.com",
      to: email,
      subject: "OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">OTP Verification</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px; color: #555;">
              Your OTP for verification is:
            </p>
            <h1 style="text-align: center; color: #007bff; font-size: 48px; margin: 20px 0; letter-spacing: 8px;">
              ${otp}
            </h1>
            <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">
              This OTP is valid for 10 minutes.
            </p>
          </div>
          <p style="font-size: 14px; color: #888; text-align: center;">
            If you didn't request this OTP, please ignore this email.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${email}`,
      expiresIn: "10 minutes",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});

// POST /api/otp/verify
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate inputs
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Simple OTP verification - just check if OTP exists for this email
    const otpRecord = await OTP.findOne({
      email,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
});

module.exports = router;
