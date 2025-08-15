const axios = require("axios");

const BASE_URL = "http://localhost:3000/api/otp";
const TEST_EMAIL = "utkarshsingh30112002@gmail.com";

// Test the random OTP system
async function testRandomOTP() {
  console.log("🧪 Testing Random OTP System\n");

  try {
    // Step 1: Send OTP
    console.log("1️⃣ Sending OTP...");
    const sendResponse = await axios.post(`${BASE_URL}/send`, {
      email: TEST_EMAIL,
    });

    console.log("✅ OTP sent successfully!");
    console.log("Response:", sendResponse.data);
    console.log("");

    // Step 2: Check OTP status
    console.log("2️⃣ Checking OTP status...");
    const statusResponse = await axios.get(
      `${BASE_URL}/status/${encodeURIComponent(TEST_EMAIL)}`
    );

    console.log("✅ OTP status retrieved!");
    console.log("Status:", statusResponse.data);
    console.log("");

    // Step 3: Try to verify with wrong OTP
    console.log("3️⃣ Testing with wrong OTP...");
    try {
      await axios.post(`${BASE_URL}/verify`, {
        email: TEST_EMAIL,
        otp: "000000",
      });
    } catch (error) {
      console.log("✅ Correctly rejected wrong OTP!");
      console.log("Error:", error.response.data);
      console.log("");
    }

    // Step 4: Check status after failed attempt
    console.log("4️⃣ Checking status after failed attempt...");
    const statusAfterFail = await axios.get(
      `${BASE_URL}/status/${encodeURIComponent(TEST_EMAIL)}`
    );
    console.log("Status after failed attempt:", statusAfterFail.data);
    console.log("");

    // Step 5: Reset attempts
    console.log("5️⃣ Resetting OTP attempts...");
    const resetResponse = await axios.delete(
      `${BASE_URL}/reset/${encodeURIComponent(TEST_EMAIL)}`
    );
    console.log("✅ Attempts reset successfully!");
    console.log("Reset response:", resetResponse.data);
    console.log("");

    // Step 6: Check final status
    console.log("6️⃣ Final status check...");
    const finalStatus = await axios.get(
      `${BASE_URL}/status/${encodeURIComponent(TEST_EMAIL)}`
    );
    console.log("Final status:", finalStatus.data);
    console.log("");

    console.log("🎉 Random OTP system test completed successfully!");
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

// Test rate limiting
async function testRateLimit() {
  console.log("\n🚫 Testing Rate Limiting\n");

  try {
    // Try to send multiple OTPs quickly
    for (let i = 1; i <= 4; i++) {
      console.log(`Attempt ${i}: Sending OTP...`);
      try {
        const response = await axios.post(`${BASE_URL}/send`, {
          email: TEST_EMAIL,
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
      "❌ Rate limit test failed:",
      error.response?.data || error.message
    );
  }
}

// Run tests
async function runTests() {
  console.log("🚀 Starting Random OTP System Tests\n");

  await testRandomOTP();
  await testRateLimit();

  console.log("\n✨ All tests completed!");
}

// Run the tests
runTests().catch(console.error);

