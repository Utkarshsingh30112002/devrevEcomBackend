require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("../models/orders");
const User = require("../models/users");
const Product = require("../models/products");
const { Transaction } = require("../models/payments");

function daysAgo(num) {
  const d = new Date();
  d.setDate(d.getDate() - num);
  return d;
}

function daysFromNow(num) {
  const d = new Date();
  d.setDate(d.getDate() + num);
  return d;
}

function generateId(prefix) {
  const ts = Date.now().toString().slice(-8);
  const rand = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}${ts}${rand}`;
}

function mapType(category) {
  return category === "mouse" ? "mice" : "laptop";
}

async function setTimestamps(collection, _id, createdAt, updatedAt) {
  await collection.updateOne(
    { _id },
    { $set: { createdAt, updatedAt: updatedAt || createdAt } }
  );
}

async function buildOrderItems(products) {
  const chosen = products.slice(0, Math.max(1, Math.min(2, products.length)));
  return chosen.map((p) => ({
    productId: p.productId,
    name: p.name,
    price: p.price,
    quantity: 1,
    imageUrl: p.imageUrl,
    type: mapType(p.category),
    totalPrice: p.price,
  }));
}

async function createBaseOrder(userId, products, addr, deliveryType = "standard", payMethod = "cod") {
  const items = await buildOrderItems(products);
  const order = new Order({
    userId,
    items,
    deliveryDetails: {
      address: addr,
      deliveryType,
      deliveryCost: 0,
      estimatedDelivery: { minDays: 3, maxDays: 4, description: "3-4 days" },
      deliveryStatus: "pending",
    },
    paymentDetails: { method: payMethod, amount: items.reduce((s, i) => s + i.totalPrice, 0) },
    subtotal: items.reduce((s, i) => s + i.totalPrice, 0),
    deliveryCost: 0,
    discount: 0,
    notes: "dummy seeded",
  });
  order.calculateTotals();
  await order.save();
  return order;
}

async function main() {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("Connected to MongoDB:", uri);

    // Delete previous orders (and related transactions for cleanliness)
    await Order.deleteMany({});
    await Transaction.deleteMany({});
    console.log("Cleared existing orders and transactions.");

    const users = await User.find({});
    if (users.length === 0) {
      console.log("No users found. Seed users first.");
      process.exit(0);
    }

    const products = await Product.find({}).limit(10);
    if (products.length === 0) {
      console.log("No products found. Seed products first.");
      process.exit(0);
    }

    let totalCreated = 0;
    for (const user of users) {
      const addr = (user.addresses && user.addresses[0]) || {
        street: "Seed Street",
        area: "Seed Area",
        city: "Seed City",
        state: "Seed State",
        pincode: "000000",
        country: "India",
      };

      // 2 cancelled orders
      for (const offset of [14, 13]) {
        const o = await createBaseOrder(user._id, products, addr);
        // mark items cancelled
        o.items = o.items.map((it) => ({ ...it.toObject?.() || it, status: "cancelled" }));
        o.orderStatus = "cancelled";
        o.isActive = false;
        await o.save();
        await setTimestamps(Order.collection, o._id, daysAgo(offset), daysAgo(offset));
        totalCreated += 1;
      }

      // 1 delivered with exchange scheduled for next day
      {
        const offset = 7;
        const o = await createBaseOrder(user._id, products, addr);
        o.orderStatus = "delivered";
        o.deliveryDetails.deliveryStatus = "delivered";
        o.deliveredAt = daysAgo(offset);
        o.exchangeRequests = [
          {
            requestId: generateId("EXC"),
            reason: "Size/variant exchange",
            status: "requested",
            pickupDate: daysFromNow(1),
            requestedAt: new Date(),
          },
        ];
        await o.save();
        await setTimestamps(Order.collection, o._id, daysAgo(offset + 1), daysAgo(offset));
        totalCreated += 1;
      }

      // 1 delivered plain (no requests)
      {
        const offset = 6;
        const o = await createBaseOrder(user._id, products, addr);
        o.orderStatus = "delivered";
        o.deliveryDetails.deliveryStatus = "delivered";
        o.deliveredAt = daysAgo(offset);
        await o.save();
        await setTimestamps(Order.collection, o._id, daysAgo(offset + 1), daysAgo(offset));
        totalCreated += 1;
      }

      // 1 delivered plain (no requests)
      {
        const offset = 9;
        const o = await createBaseOrder(user._id, products, addr);
        o.orderStatus = "delivered";
        o.deliveryDetails.deliveryStatus = "delivered";
        o.deliveredAt = daysAgo(offset);
        await o.save();
        await setTimestamps(Order.collection, o._id, daysAgo(offset + 1), daysAgo(offset));
        totalCreated += 1;
      }

      // 1 delivered with return requested (no refund processing)
      {
        const offset = 5;
        const o = await createBaseOrder(user._id, products, addr);
        o.orderStatus = "delivered";
        o.deliveryDetails.deliveryStatus = "delivered";
        o.deliveredAt = daysAgo(offset);
        o.returnRequests = [
          {
            requestId: generateId("RET"),
            reason: "Not satisfied",
            status: "requested",
            pickupDate: daysFromNow(1),
            requestedAt: new Date(),
          },
        ];
        await o.save();
        await setTimestamps(Order.collection, o._id, daysAgo(offset + 1), daysAgo(offset));
        totalCreated += 1;
      }
    }

    console.log(`Created ${totalCreated} dummy orders across ${users.length} users.`);
    await mongoose.connection.close();
    console.log("Seeding completed.");
  } catch (err) {
    console.error("Error seeding dummy orders:", err);
    process.exit(1);
  }
}

main();


