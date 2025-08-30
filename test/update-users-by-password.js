require("dotenv").config();
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const User = require("../models/users");

/*
Usage:
  node test/update-users-by-password.js /absolute/path/to/updates.json [--dry-run] [--generate-uuid]

updates.json format:
[
  {
    "password": "hashedPassword123",
    "updates": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.new@example.com",
      "username": "john_doe_new",
      "user_uuid": "<optional-explicit-uuid>"
    }
  }
]

Notes:
- Matches user by exact User.password value (as stored currently).
- Only whitelisted fields will be updated to avoid accidental schema violations.
- Use --dry-run to preview changes without writing to DB.
- Use --generate-uuid to set a new UUID for matched users when updates.user_uuid is not provided.
*/

const DRY_RUN = process.argv.includes("--dry-run");
const GENERATE_UUID = process.argv.includes("--generate-uuid");

async function main() {
  try {
    const fileArg = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : null;
    if (!fileArg) {
      console.error("Usage: node test/update-users-by-password.js /path/to/updates.json [--dry-run] [--generate-uuid]");
      process.exit(1);
    }

    const updatesPath = path.isAbsolute(fileArg)
      ? fileArg
      : path.join(process.cwd(), fileArg);

    if (!fs.existsSync(updatesPath)) {
      console.error(`Updates file not found: ${updatesPath}`);
      process.exit(1);
    }

    const raw = fs.readFileSync(updatesPath, "utf8");
    let records;
    try {
      records = JSON.parse(raw);
    } catch (e) {
      console.error("Invalid JSON in updates file.");
      process.exit(1);
    }

    if (!Array.isArray(records) || records.length === 0) {
      console.error("Updates file must be a non-empty JSON array.");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to MongoDB. Dry-run: ${DRY_RUN ? "YES" : "NO"} | Generate UUID: ${GENERATE_UUID ? "YES" : "NO"}`);

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
      "user_uuid",
    ]);

    let processed = 0;
    let matched = 0;
    let updated = 0;
    let failures = 0;

    for (const rec of records) {
      processed += 1;
      const { password, updates } = rec || {};
      if (!password || !updates || typeof updates !== "object") {
        console.warn(`Skipping record ${processed}: invalid structure (need password + updates object).`);
        continue;
      }

      const user = await User.findOne({ password });
      if (!user) {
        console.warn(`No user found matching provided password (record ${processed}).`);
        continue;
      }
      matched += 1;

      const payload = {};
      for (const [key, value] of Object.entries(updates)) {
        if (whitelist.has(key)) {
          payload[key] = value;
        } else {
          console.warn(`Ignoring non-whitelisted field '${key}' for ${user.username}`);
        }
      }

      if (GENERATE_UUID && !payload.user_uuid) {
        payload.user_uuid = uuidv4();
      }

      if (Object.keys(payload).length === 0) {
        console.log(`Record ${processed}: nothing to update for ${user.username}`);
        continue;
      }

      console.log(`\nUser: ${user.username} (${user._id})`);
      console.log("Before:", {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        user_uuid: user.user_uuid,
      });
      console.log("Update:", payload);

      if (DRY_RUN) {
        continue;
      }

      try {
        await User.updateOne({ _id: user._id }, { $set: payload });
        updated += 1;
      } catch (err) {
        failures += 1;
        if (err && err.code === 11000) {
          console.error(`Duplicate key error while updating ${user.username}:`, err.message);
        } else {
          console.error(`Failed to update ${user.username}:`, err.message);
        }
      }
    }

    console.log("\nSummary:")
    console.log({ processed, matched, updated, failures, dryRun: DRY_RUN, generateUuid: GENERATE_UUID });

    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error running update script:", error);
    try { await mongoose.connection.close(); } catch (_) {}
    process.exit(1);
  }
}

main();


