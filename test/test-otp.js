const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testOTPAPI() {
  try {
    console.log("Testing OTP API...\n");

    // Test 1: Send OTP
    console.log("1. Sending OTP...");
    const sendResponse = await axios.post(`${BASE_URL}/otp/send`, {
      email: "test@example.com", // This will be ignored, email always goes to utkarshsingh30112002@gmail.com
    });
    console.log("Send OTP Response:", sendResponse.data);
    console.log("");

    // Test 2: Verify correct OTP
    console.log("2. Verifying correct OTP (8080)...");
    const verifyCorrectResponse = await axios.post(`${BASE_URL}/otp/verify`, {
      otp: "8080",
    });
    console.log("Verify Correct OTP Response:", verifyCorrectResponse.data);
    console.log("");

    // Test 3: Verify incorrect OTP
    console.log("3. Verifying incorrect OTP (1234)...");
    try {
      const verifyIncorrectResponse = await axios.post(
        `${BASE_URL}/otp/verify`,
        {
          otp: "1234",
        }
      );
      console.log(
        "Verify Incorrect OTP Response:",
        verifyIncorrectResponse.data
      );
    } catch (error) {
      console.log("Verify Incorrect OTP Response:", error.response.data);
    }
    console.log("");

    // Test 4: Send OTP without email
    console.log("4. Sending OTP without email...");
    try {
      const sendWithoutEmailResponse = await axios.post(
        `${BASE_URL}/otp/send`,
        {}
      );
      console.log(
        "Send Without Email Response:",
        sendWithoutEmailResponse.data
      );
    } catch (error) {
      console.log("Send Without Email Response:", error.response.data);
    }
    console.log("");

    // Test 5: Verify OTP without OTP
    console.log("5. Verifying OTP without OTP...");
    try {
      const verifyWithoutOTPResponse = await axios.post(
        `${BASE_URL}/otp/verify`,
        {}
      );
      console.log(
        "Verify Without OTP Response:",
        verifyWithoutOTPResponse.data
      );
    } catch (error) {
      console.log("Verify Without OTP Response:", error.response.data);
    }
  } catch (error) {
    console.error("Error testing OTP API:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testOTPAPI();
