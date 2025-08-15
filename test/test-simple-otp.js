const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";
const TEST_EMAIL = "utkarshsingh30112002@gmail.com";

// Test the simplified OTP system
async function testSimpleOTP() {
  console.log("🧪 Testing Simplified OTP System\n");

  try {
    // Step 1: Send OTP
    console.log("1️⃣ Sending OTP...");
    const sendResponse = await axios.post(`${BASE_URL}/otp/send`, {
      email: TEST_EMAIL,
    });

    console.log("✅ OTP sent successfully!");
    console.log("Response:", sendResponse.data);
    console.log("");

    // Step 2: Try to verify with wrong OTP
    console.log("2️⃣ Testing with wrong OTP...");
    try {
      await axios.post(`${BASE_URL}/otp/verify`, {
        email: TEST_EMAIL,
        otp: "000000",
      });
    } catch (error) {
      console.log("✅ Correctly rejected wrong OTP!");
      console.log("Error:", error.response.data);
      console.log("");
    }

    console.log("🎉 Simple OTP system test completed!");
    console.log("\n📝 Note: To test verification with the actual OTP:");
    console.log("1. Check your email for the OTP");
    console.log("2. Use the verify endpoint with the correct OTP");
    console.log(
      "3. Example: POST /api/otp/verify with { email: 'your-email', otp: '123456' }"
    );
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Test payment OTP
async function testPaymentOTP() {
  console.log("\n💳 Testing Payment OTP\n");

  try {
    // Step 1: Send payment OTP
    console.log("1️⃣ Sending payment OTP...");
    const sendResponse = await axios.post(`${BASE_URL}/payments/send-otp`, {
      email: TEST_EMAIL,
    });

    console.log("✅ Payment OTP sent successfully!");
    console.log("Response:", sendResponse.data);
    console.log("");

    // Step 2: Try to process payment with wrong OTP
    console.log("2️⃣ Testing payment with wrong OTP...");
    try {
      await axios.post(`${BASE_URL}/payments/process`, {
        orderId: "ORD123456",
        userId: "user123",
        amount: 1000,
        paymentMethod: "card",
        cardNumber: "1234-5678-9012-3456",
        cardType: "visa",
        cardholderName: "Test User",
        userEmail: TEST_EMAIL,
        otp: "000000", // Wrong OTP
      });
    } catch (error) {
      console.log("✅ Correctly rejected payment with wrong OTP!");
      console.log("Error:", error.response?.data || error.message);
      console.log("");
    }

    console.log("🎉 Payment OTP test completed!");
    console.log("\n📝 Note: To test successful payment with OTP:");
    console.log("1. Check your email for the payment OTP");
    console.log("2. Use the process payment endpoint with the correct OTP");
  } catch (error) {
    console.error(
      "❌ Payment OTP test failed:",
      error.response?.data || error.message
    );
  }
}

// Run tests
async function runTests() {
  console.log("🚀 Starting Simplified OTP System Tests\n");

  await testSimpleOTP();
  await testPaymentOTP();

  console.log("\n✨ All tests completed!");
}

// Run the tests
runTests().catch(console.error);

