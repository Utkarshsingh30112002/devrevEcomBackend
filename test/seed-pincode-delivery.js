require("dotenv").config();
const mongoose = require("mongoose");
const PincodeDelivery = require("../models/pincodeDelivery");

// Pincode delivery data from pincodeFees.txt
const pincodeDeliveryData = [
  {
    pincode: "560001",
    city: "Bangalore",
    region: "Central",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "560002",
    city: "Bangalore",
    region: "North",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "560003",
    city: "Bangalore",
    region: "South",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "560010",
    city: "Bangalore",
    region: "East",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "560017",
    city: "Bangalore",
    region: "West",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "500001",
    city: "Hyderabad",
    region: "Central",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "500002",
    city: "Hyderabad",
    region: "Secunderabad",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "500003",
    city: "Hyderabad",
    region: "Jubilee Hills",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "500004",
    city: "Hyderabad",
    region: "Banjara Hills",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "500005",
    city: "Hyderabad",
    region: "Abids",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "600001",
    city: "Chennai",
    region: "Central",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "600002",
    city: "Chennai",
    region: "Mylapore",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "600003",
    city: "Chennai",
    region: "T. Nagar",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "600004",
    city: "Chennai",
    region: "Adyar",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "600005",
    city: "Chennai",
    region: "Velachery",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "400001",
    city: "Mumbai",
    region: "South Mumbai",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "400002",
    city: "Mumbai",
    region: "Andheri",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "400003",
    city: "Mumbai",
    region: "Bandra",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "400004",
    city: "Mumbai",
    region: "Juhu",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "400005",
    city: "Mumbai",
    region: "Powai",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "metro",
  },
  {
    pincode: "411001",
    city: "Pune",
    region: "Shivajinagar",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier1",
  },
  {
    pincode: "411002",
    city: "Pune",
    region: "Kothrud",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier1",
  },
  {
    pincode: "411003",
    city: "Pune",
    region: "Viman Nagar",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier1",
  },
  {
    pincode: "411004",
    city: "Pune",
    region: "Hinjewadi",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier1",
  },
  {
    pincode: "411005",
    city: "Pune",
    region: "Baner",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier1",
  },
  {
    pincode: "682001",
    city: "Kochi",
    region: "Fort Kochi",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "682002",
    city: "Kochi",
    region: "Ernakulam",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "682003",
    city: "Kochi",
    region: "Kakkanad",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "682004",
    city: "Kochi",
    region: "Vyttila",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "682005",
    city: "Kochi",
    region: "Thrikkakara",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "530001",
    city: "Vishakapatnam",
    region: "Gajuwaka",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "530002",
    city: "Vishakapatnam",
    region: "Visakhapatnam Port",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "530003",
    city: "Vishakapatnam",
    region: "Dwaraka Nagar",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "530004",
    city: "Vishakapatnam",
    region: "Maddilapalem",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "530005",
    city: "Vishakapatnam",
    region: "Seethammadhara",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "695001",
    city: "Thiruvananthapuram",
    region: "Statue",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "695002",
    city: "Thiruvananthapuram",
    region: "Kazhakkoottam",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "695003",
    city: "Thiruvananthapuram",
    region: "Neyyattinkara",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "695004",
    city: "Thiruvananthapuram",
    region: "Chalai",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "695005",
    city: "Thiruvananthapuram",
    region: "Palayam",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "636001",
    city: "Salem",
    region: "Ammapet",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier3",
  },
  {
    pincode: "636002",
    city: "Salem",
    region: "Suramangalam",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier3",
  },
  {
    pincode: "636003",
    city: "Salem",
    region: "Jagir Ammapalayam",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier3",
  },
  {
    pincode: "636004",
    city: "Salem",
    region: "Hasthampatti",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier3",
  },
  {
    pincode: "636005",
    city: "Salem",
    region: "Gugai",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier3",
  },
  {
    pincode: "440001",
    city: "Nagpur",
    region: "Sitabuldi",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "440002",
    city: "Nagpur",
    region: "Dharampeth",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "440003",
    city: "Nagpur",
    region: "Sadar",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "440004",
    city: "Nagpur",
    region: "Civil Lines",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
  {
    pincode: "440005",
    city: "Nagpur",
    region: "Gokulpeth",
    standardDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
    fastDelivery: { minDays: 1, maxDays: 2, description: "1-2 days" },
    additionalCost: 200,
    deliveryZones: "tier2",
  },
];

// Function to seed pincode delivery data
const seedPincodeDelivery = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Clear existing pincode delivery data
    await PincodeDelivery.deleteMany({});
    console.log("Cleared existing pincode delivery data");

    // Insert pincode delivery data
    const pincodeDeliveries = await PincodeDelivery.insertMany(
      pincodeDeliveryData
    );
    console.log(
      `Inserted ${pincodeDeliveries.length} pincode delivery records`
    );

    // Display summary by city
    const citySummary = {};
    pincodeDeliveries.forEach((delivery) => {
      if (!citySummary[delivery.city]) {
        citySummary[delivery.city] = {
          count: 0,
          zones: new Set(),
          additionalCosts: new Set(),
        };
      }
      citySummary[delivery.city].count++;
      citySummary[delivery.city].zones.add(delivery.deliveryZones);
      citySummary[delivery.city].additionalCosts.add(delivery.additionalCost);
    });

    console.log("\nPincode Delivery Summary by City:");
    Object.entries(citySummary).forEach(([city, data]) => {
      console.log(
        `- ${city}: ${data.count} pincodes, Zones: ${Array.from(
          data.zones
        ).join(", ")}, Costs: ₹${Array.from(data.additionalCosts).join(", ₹")}`
      );
    });

    mongoose.connection.close();
    console.log("\nPincode delivery seeding completed!");
  } catch (error) {
    console.error("Error seeding pincode delivery data:", error);
    process.exit(1);
  }
};

// Run the seeding function
seedPincodeDelivery();
