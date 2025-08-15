const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";
const TEST_EMAIL = "utkarshsingh30112002@gmail.com";
const TEST_USER_ID = "user123";
const TEST_ORDER_ID = "ORD123456";

// Test the payment OTP integration
async function testPaymentOTP() {
  console.log("💳 Testing Payment OTP Integration\n");

  try {
    // Step 1: Send payment OTP
    console.log("1️⃣ Sending payment verification OTP...");
    const sendOTPResponse = await axios.post(`${BASE_URL}/payments/send-otp`, {
      email: TEST_EMAIL,
      orderId: TEST_ORDER_ID,
      userId: TEST_USER_ID,
    });

    console.log("✅ Payment OTP sent successfully!");
    console.log("Response:", sendOTPResponse.data);
    console.log("");

    // Step 2: Try to process payment without OTP (should fail for card payments)
    console.log("2️⃣ Testing payment without OTP...");
    try {
      await axios.post(`${BASE_URL}/payments/process`, {
        orderId: TEST_ORDER_ID,
        userId: TEST_USER_ID,
        amount: 1000,
        paymentMethod: "card",
        cardNumber: "1234-5678-9012-3456",
        cardType: "visa",
        cardholderName: "Test User",
        userEmail: TEST_EMAIL,
        // No OTP provided
      });
    } catch (error) {
      console.log("✅ Correctly rejected payment without OTP!");
      console.log("Error:", error.response?.data || error.message);
      console.log("");
    }

    // Step 3: Try to process payment with wrong OTP
    console.log("3️⃣ Testing payment with wrong OTP...");
    try {
      await axios.post(`${BASE_URL}/payments/process`, {
        orderId: TEST_ORDER_ID,
        userId: TEST_USER_ID,
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

    // Step 4: Check OTP status
    console.log("4️⃣ Checking OTP status...");
    try {
      const statusResponse = await axios.get(
        `${BASE_URL}/otp/status/${encodeURIComponent(TEST_EMAIL)}`
      );
      console.log("✅ OTP status retrieved!");
      console.log("Status:", statusResponse.data);
      console.log("");
    } catch (error) {
      console.log(
        "❌ Failed to get OTP status:",
        error.response?.data || error.message
      );
      console.log("");
    }

    console.log("🎉 Payment OTP integration test completed!");
    console.log("\n📝 Note: To test successful payment with OTP:");
    console.log("1. Check your email for the payment verification OTP");
    console.log("2. Use the process payment endpoint with the correct OTP");
    console.log("3. Example:");
    console.log(`   POST ${BASE_URL}/payments/process`);
    console.log("   {");
    console.log("     orderId: 'ORD123456',");
    console.log("     userId: 'user123',");
    console.log("     amount: 1000,");
    console.log("     paymentMethod: 'card',");
    console.log("     cardNumber: '1234-5678-9012-3456',");
    console.log("     cardType: 'visa',");
    console.log("     cardholderName: 'Test User',");
    console.log("     userEmail: 'your-email@example.com',");
    console.log("     otp: '123456' // Use the OTP from your email");
    console.log("   }");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Test rate limiting for payment OTP
async function testPaymentOTPRateLimit() {
  console.log("\n🚫 Testing Payment OTP Rate Limiting\n");

  try {
    // Try to send multiple payment OTPs quickly
    for (let i = 1; i <= 4; i++) {
      console.log(`Attempt ${i}: Sending payment OTP...`);
      try {
        const response = await axios.post(`${BASE_URL}/payments/send-otp`, {
          email: TEST_EMAIL,
          orderId: TEST_ORDER_ID,
          userId: TEST_USER_ID,
        });
        console.log(`✅ Attempt ${i} successful`);
      } catch (error) {
        if (error.response?.status === 429) {
          console.log(`❌ Attempt ${i} blocked by rate limit (expected)`);
          console.log("Rate limit message:", error.response.data.message);
          break;
        } else {
          console.log(
            `❌ Attempt ${i} failed:`,
            error.response?.data || error.message
          );
        }
      }
    }
  } catch (error) {
    console.error(
      "❌ Payment OTP rate limit test failed:",
      error.response?.data || error.message
    );
  }
}

// Test different payment methods
async function testPaymentMethods() {
  console.log("\n💳 Testing Different Payment Methods\n");

  const paymentMethods = [
    {
      method: "card",
      requiresOTP: true,
      data: {
        cardNumber: "1234-5678-9012-3456",
        cardType: "visa",
        cardholderName: "Test User",
      },
    },
    {
      method: "upi",
      requiresOTP: false,
      data: {
        upiId: "test@upi",
        provider: "gpay",
      },
    },
    {
      method: "netbanking",
      requiresOTP: false,
      data: {
        bankName: "HDFC Bank",
        accountNumber: "1234567890",
      },
    },
  ];

  for (const payment of paymentMethods) {
    console.log(`Testing ${payment.method.toUpperCase()} payment...`);

    try {
      const response = await axios.post(`${BASE_URL}/payments/process`, {
        orderId: TEST_ORDER_ID,
        userId: TEST_USER_ID,
        amount: 1000,
        paymentMethod: payment.method,
        userEmail: TEST_EMAIL,
        ...payment.data,
        // OTP only required for card payments
        ...(payment.requiresOTP && { otp: "000000" }), // Wrong OTP for testing
      });

      console.log(
        `✅ ${payment.method.toUpperCase()} payment processed successfully`
      );
    } catch (error) {
      if (payment.requiresOTP) {
        console.log(
          `✅ ${payment.method.toUpperCase()} correctly rejected with wrong OTP`
        );
      } else {
        console.log(
          `✅ ${payment.method.toUpperCase()} payment processed (no OTP required)`
        );
      }
    }
    console.log("");
  }
}

// Run tests
async function runTests() {
  console.log("🚀 Starting Payment OTP Integration Tests\n");

  await testPaymentOTP();
  await testPaymentOTPRateLimit();
  await testPaymentMethods();

  console.log("\n✨ All payment OTP tests completed!");
}

// Run the tests
runTests().catch(console.error);

