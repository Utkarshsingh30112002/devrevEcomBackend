const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testOptimizedReviewsAPI() {
  try {
    console.log("Testing Optimized Reviews API...\n");

    // Test 1: Get reviews by productId using GET endpoint (minimal data)
    console.log(
      "1. Getting minimal reviews by productId (GET /reviews/product/P100)..."
    );
    try {
      const minimalReviewsResponse = await axios.get(
        `${BASE_URL}/reviews/product/P100`
      );
      console.log("Minimal Reviews Response:");
      console.log(`- Total reviews: ${minimalReviewsResponse.data.length}`);
      if (minimalReviewsResponse.data.length > 0) {
        console.log(
          `- Sample review keys: ${Object.keys(
            minimalReviewsResponse.data[0]
          ).join(", ")}`
        );
        console.log(
          `- User keys: ${Object.keys(minimalReviewsResponse.data[0].user).join(
            ", "
          )}`
        );
        console.log(`- No product info included (as expected)`);
      }
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
    }
    console.log("");

    // Test 2: Get reviews by productId using POST endpoint (concise data)
    console.log(
      "2. Getting concise reviews by productId (POST /reviews/product)..."
    );
    try {
      const conciseReviewsResponse = await axios.post(
        `${BASE_URL}/reviews/product`,
        {
          productId: "P100",
        }
      );
      console.log("Concise Reviews Response:");
      console.log(`- Total reviews: ${conciseReviewsResponse.data.length}`);
      if (conciseReviewsResponse.data.length > 0) {
        console.log(
          `- Sample review keys: ${Object.keys(
            conciseReviewsResponse.data[0]
          ).join(", ")}`
        );
        console.log(
          `- User keys: ${Object.keys(conciseReviewsResponse.data[0].user).join(
            ", "
          )}`
        );
        console.log(
          `- Product keys: ${Object.keys(
            conciseReviewsResponse.data[0].product
          ).join(", ")}`
        );
      }
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
    }
    console.log("");

    // Test 3: Get all reviews with filters (concise data)
    console.log("3. Getting all reviews with concise data (GET /reviews)...");
    try {
      const allReviewsResponse = await axios.get(`${BASE_URL}/reviews`);
      console.log("All Reviews Response:");
      console.log(`- Total reviews: ${allReviewsResponse.data.length}`);
      if (allReviewsResponse.data.length > 0) {
        console.log(
          `- Sample review keys: ${Object.keys(allReviewsResponse.data[0]).join(
            ", "
          )}`
        );
        console.log(
          `- User keys: ${Object.keys(allReviewsResponse.data[0].user).join(
            ", "
          )}`
        );
        console.log(
          `- Product keys: ${Object.keys(
            allReviewsResponse.data[0].product
          ).join(", ")}`
        );
      }
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
    }
    console.log("");

    // Test 4: Get reviews by user (concise data)
    console.log("4. Getting reviews by user (POST /reviews/user)...");
    try {
      // First get a user ID from the reviews
      const userReviewsResponse = await axios.get(`${BASE_URL}/reviews`);
      if (userReviewsResponse.data.length > 0) {
        const userId = userReviewsResponse.data[0].user._id;
        const userReviews = await axios.post(`${BASE_URL}/reviews/user`, {
          userId: userId,
        });
        console.log("User Reviews Response:");
        console.log(`- Total reviews: ${userReviews.data.length}`);
        if (userReviews.data.length > 0) {
          console.log(
            `- Sample review keys: ${Object.keys(userReviews.data[0]).join(
              ", "
            )}`
          );
          console.log(
            `- Product keys: ${Object.keys(userReviews.data[0].product).join(
              ", "
            )}`
          );
          console.log(`- No user info included (as expected)`);
        }
      }
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
    }
    console.log("");

    // Test 5: Compare response sizes
    console.log("5. Comparing response sizes...");
    try {
      const minimalResponse = await axios.get(
        `${BASE_URL}/reviews/product/P100`
      );
      const conciseResponse = await axios.post(`${BASE_URL}/reviews/product`, {
        productId: "P100",
      });

      const minimalSize = JSON.stringify(minimalResponse.data).length;
      const conciseSize = JSON.stringify(conciseResponse.data).length;

      console.log(`- Minimal response size: ${minimalSize} characters`);
      console.log(`- Concise response size: ${conciseSize} characters`);
      console.log(`- Size difference: ${conciseSize - minimalSize} characters`);
      console.log(
        `- Size reduction: ${(
          ((conciseSize - minimalSize) / conciseSize) *
          100
        ).toFixed(1)}%`
      );
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
    }
  } catch (error) {
    console.error("Error testing optimized reviews API:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testOptimizedReviewsAPI();
