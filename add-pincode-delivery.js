require("dotenv").config();
const mongoose = require("mongoose");
const PincodeDelivery = require("./models/pincodeDelivery");

// Pincode delivery data for the specific pincodes needed
const pincodeDeliveryData = [
  {
    pincode: "411005",
    city: "Pune",
    region: "Baner",
    standardDelivery: { minDays: 2, maxDays: 4, description: "2-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 1200,
    deliveryZones: "tier1",
  },
  {
    pincode: "682001",
    city: "Kochi",
    region: "Fort Kochi",
    standardDelivery: { minDays: 3, maxDays: 5, description: "3-5 days" },
    fastDelivery: { minDays: 2, maxDays: 3, description: "2-3 days" },
    additionalCost: 1000,
    deliveryZones: "tier2",
  },
];

// Function to add pincode delivery data
const addPincodeDelivery = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("Connected to MongoDB");

    // Add pincode delivery data
    for (const data of pincodeDeliveryData) {
      const existing = await PincodeDelivery.findOne({ pincode: data.pincode });

      if (existing) {
        console.log(`Pincode ${data.pincode} already exists, updating...`);
        await PincodeDelivery.findOneAndUpdate(
          { pincode: data.pincode },
          data,
          { upsert: true, new: true }
        );
      } else {
        console.log(`Adding pincode ${data.pincode}...`);
        await PincodeDelivery.create(data);
      }
    }

    console.log("Pincode delivery data added successfully!");

    // Verify the data was added
    const pincodes = await PincodeDelivery.find({
      pincode: { $in: ["411005", "682001"] },
    });

    console.log(`Found ${pincodes.length} pincodes in database:`);
    pincodes.forEach((p) => {
      console.log(`- ${p.pincode}: ${p.city}, ${p.region}`);
    });

    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error adding pincode delivery data:", error);
    process.exit(1);
  }
};

// Run the function
addPincodeDelivery();

