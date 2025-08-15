const express = require("express");
const { transporter } = require("../config/email");
const router = express.Router();

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

    // Email configuration
    const mailOptions = {
      from: "utkarshsingh8871@gmail.com",
      to: email, // Always send to this email
      subject: "OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">OTP Verification</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px; color: #555;">
              Your OTP for verification is:
            </p>
            <h1 style="text-align: center; color: #007bff; font-size: 48px; margin: 20px 0; letter-spacing: 8px;">
              8080
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
      message: "OTP sent successfully to utkarshsingh30112002@gmail.com",
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
    const { otp } = req.body;

    // Validate OTP
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    // Check if OTP matches (always 8080 for now)
    if (otp === "8080") {
      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
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
