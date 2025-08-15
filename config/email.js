const nodemailer = require("nodemailer");

// Email configuration
const emailConfig = {
  service: "gmail",
  auth: {
    user: "utkarshsingh8871@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your_app_password_here",
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify transporter connection
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log("Email transporter is ready");
    return true;
  } catch (error) {
    console.error("Email transporter verification failed:", error.message);
    console.log("\nTo fix this issue:");
    console.log("1. Create a .env file in the root directory");
    console.log("2. Add EMAIL_PASSWORD=your_app_password_here");
    console.log("3. For Gmail, you need to use an App Password:");
    console.log("   - Go to your Google Account settings");
    console.log("   - Enable 2-Step Verification if not already enabled");
    console.log("   - Go to Security > App passwords");
    console.log('   - Generate a new app password for "Mail"');
    console.log("   - Use that password in your .env file");
    return false;
  }
};

module.exports = {
  transporter,
  verifyConnection,
  emailConfig,
};
