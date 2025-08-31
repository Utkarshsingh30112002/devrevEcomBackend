require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/users");

// Dummy users data
const dummyUsers = [
  {
    username: "abhinav.chintala2@gmail.com",
    email: "abhinav.chintala2@gmail.com",
    password: "hashedPassword123", // In real app, this would be properly hashed
    firstName: "Abhinav",
    lastName: "Chintalacheruvu",
    user_uuid: "3f0f1a6e-9f1b-4a0a-93b1-2c0c08d8a111",
    phone: "+91-9876543210",
    addresses: [
      {
        street: "Flat No. B-702, Orchid Towers",
        area: "Baner",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411005",
        country: "India",
        isDefault: true,
        addressType: "home",
      },
      {
        street: "14/5B, Rose Villa, Princess Street",
        area: "Fort Kochi",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
        country: "India",
        isDefault: false,
        addressType: "office",
      },
    ],
    role: "user",
    profileImage: "https://example.com/profiles/john.jpg",
    dateOfBirth: new Date("1990-05-15"),
    emailVerified: true,
  },
  {
    username: "c-jaswanth.meka@devrev.ai",
    email: "c-jaswanth.meka@devrev.ai",
    password: "hashedPassword456",
    firstName: "Jaswanth",
    lastName: "Chowdary",
    user_uuid: "7c2f8b90-4d5e-4f1e-9d2a-1a2b3c4d5e66",
    phone: "+91-9876543211",
    addresses: [
      {
        street: "Flat No. B-702, Orchid Towers",
        area: "Baner",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411005",
        country: "India",
        isDefault: true,
        addressType: "home",
      },
      {
        street: "14/5B, Rose Villa, Princess Street",
        area: "Fort Kochi",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
        country: "India",
        isDefault: false,
        addressType: "office",
      },
    ],
    role: "user",
    profileImage: "https://example.com/profiles/jane.jpg",
    dateOfBirth: new Date("1988-12-20"),
    emailVerified: true,
  },
  {
    username: "utkarshsingh8871@gmail.com",
    email: "utkarshsingh8871@gmail.com",
    password: "hashedPassword789",
    firstName: "Utkarsh",
    lastName: "Singh",
    user_uuid: "d9a0c123-6b7c-4f2e-8a9b-0c1d2e3f4a55",
    phone: "+91-9876543212",
    addresses: [
      {
        street: "Flat No. B-702, Orchid Towers",
        area: "Baner",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411005",
        country: "India",
        isDefault: true,
        addressType: "home",
      },
      {
        street: "14/5B, Rose Villa, Princess Street",
        area: "Fort Kochi",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
        country: "India",
        isDefault: false,
        addressType: "office",
      },
    ],
    role: "user",
    profileImage: "https://example.com/profiles/mike.jpg",
    dateOfBirth: new Date("1992-08-10"),
    emailVerified: true,
  },
  {
    username: "sarah_jones",
    email: "sarah.jones@example.com",
    password: "hashedPassword101",
    firstName: "Sarah",
    lastName: "Jones",
    user_uuid: "2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c77",
    phone: "+91-9876543213",
    addresses: [
      {
        street: "Flat No. B-702, Orchid Towers",
        area: "Baner",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411005",
        country: "India",
        isDefault: true,
        addressType: "home",
      },
      {
        street: "14/5B, Rose Villa, Princess Street",
        area: "Fort Kochi",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
        country: "India",
        isDefault: false,
        addressType: "office",
      },
    ],
    role: "user",
    profileImage: "https://example.com/profiles/sarah.jpg",
    dateOfBirth: new Date("1995-03-25"),
    emailVerified: true,
  },
  {
    username: "admin_user",
    email: "admin@ecommerce.com",
    password: "hashedAdminPassword",
    firstName: "Admin",
    lastName: "User",
    user_uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c99",
    phone: "+91-9876543214",
    addresses: [
      {
        street: "Flat No. B-702, Orchid Towers",
        area: "Baner",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411005",
        country: "India",
        isDefault: true,
        addressType: "home",
      },
      {
        street: "14/5B, Rose Villa, Princess Street",
        area: "Fort Kochi",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
        country: "India",
        isDefault: false,
        addressType: "office",
      },
    ],
    role: "admin",
    profileImage: "https://example.com/profiles/admin.jpg",
    dateOfBirth: new Date("1985-01-01"),
    emailVerified: true,
  },
  {
    username: "tech_guru",
    email: "tech.guru@example.com",
    password: "hashedPassword202",
    firstName: "Alex",
    lastName: "Chen",
    user_uuid: "f0e1d2c3-b4a5-4c6d-8e9f-001122334455",
    phone: "+91-9876543215",
    addresses: [
      {
        street: "Flat No. B-702, Orchid Towers",
        area: "Baner",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411005",
        country: "India",
        isDefault: true,
        addressType: "home",
      },
      {
        street: "14/5B, Rose Villa, Princess Street",
        area: "Fort Kochi",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
        country: "India",
        isDefault: false,
        addressType: "office",
      },
    ],
    role: "user",
    profileImage: "https://example.com/profiles/alex.jpg",
    dateOfBirth: new Date("1991-11-30"),
    emailVerified: true,
  },
  {
    username: "gaming_pro",
    email: "gaming.pro@example.com",
    password: "hashedPassword303",
    firstName: "David",
    lastName: "Kumar",
    user_uuid: "123e4567-e89b-12d3-a456-426614174000",
    phone: "+91-9876543216",
    addresses: [
      {
        street: "Flat No. B-702, Orchid Towers",
        area: "Baner",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411005",
        country: "India",
        isDefault: true,
        addressType: "home",
      },
      {
        street: "14/5B, Rose Villa, Princess Street",
        area: "Fort Kochi",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
        country: "India",
        isDefault: false,
        addressType: "office",
      },
    ],
    role: "user",
    profileImage: "https://example.com/profiles/david.jpg",
    dateOfBirth: new Date("1993-07-14"),
    emailVerified: true,
  },
  {
    username: "office_worker",
    email: "office.worker@example.com",
    password: "hashedPassword404",
    firstName: "Priya",
    lastName: "Sharma",
    user_uuid: "987e6543-e21b-45d3-b456-123456789abc",
    phone: "+91-9876543217",
    addresses: [
      {
        street: "Flat No. B-702, Orchid Towers",
        area: "Baner",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411005",
        country: "India",
        isDefault: true,
        addressType: "home",
      },
      {
        street: "14/5B, Rose Villa, Princess Street",
        area: "Fort Kochi",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
        country: "India",
        isDefault: false,
        addressType: "office",
      },
    ],
    role: "user",
    profileImage: "https://example.com/profiles/priya.jpg",
    dateOfBirth: new Date("1989-09-05"),
    emailVerified: true,
  },
];

// Function to seed users (destructive: clears and inserts)
const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Insert dummy users
    const users = await User.insertMany(dummyUsers);
    console.log(`Inserted ${users.length} dummy users`);

    // Display the created users
    console.log("\nDummy Users Created:");
    users.forEach((user) => {
      console.log(
        `- ${user.firstName} ${user.lastName} (${user.username}) - ${user.role}`
      );
    });

    mongoose.connection.close();
    console.log("\nUser seeding completed!");
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

// Function to update existing users by matching password (non-destructive)
const updateUsersByPassword = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
console.log(process.env.MONGODB_URI)
    const whitelist = new Set([
      "username",
      "email",
      "firstName",
      "lastName",
      "phone",
      "addresses",
      "role",
      "profileImage",
      "dateOfBirth",
      "emailVerified",
      // intentionally excluding password
      // user_uuid handled specially below
    ]);

    let processed = 0;
    let matched = 0;
    let updated = 0;

    for (const du of dummyUsers) {
      processed += 1;
      const user = await User.findOne({ password: du.password });
      if (!user) {
        console.warn(
          `No user found for provided password (record ${processed}, username=${du.username})`
        );
        continue;
      }
      matched += 1;

      const payload = {};
      for (const [k, v] of Object.entries(du)) {
        if (whitelist.has(k)) payload[k] = v;
      }

      // Maintain existing user_uuid; set only if missing on the DB record
      if (!user.user_uuid && du.user_uuid) {
        payload.user_uuid = du.user_uuid;
      }

      try {
        const res = await User.updateOne({ _id: user._id }, { $set: payload });
        if (res.modifiedCount > 0) updated += 1;
        console.log(
          `Updated ${user.username} (${user._id}) fields: ${Object.keys(payload).join(", ")}`
        );
      } catch (err) {
        console.error(`Failed updating ${user.username}:`, err.message);
      }
    }

    console.log("\nUpdate by password summary:", { processed, matched, updated });
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("Error updating users by password:", error);
    process.exit(1);
  }
};


  updateUsersByPassword();

  // Run the seeding function by default
  // seedUsers();

