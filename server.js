const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const WebSocket = require("ws");
require("dotenv").config();

const connectDB = require("./config/database");
const { verifyConnection } = require("./config/email");
const { initializeWebSocket } = require("./utils/websocket");

// Import routes
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");
const stockRoutes = require("./routes/stock");
const cartRoutes = require("./routes/cart");
const addressRoutes = require("./routes/addresses");
const pincodeDeliveryRoutes = require("./routes/pincodeDelivery");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payments");
const otpRoutes = require("./routes/otp");

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Initialize WebSocket utilities
initializeWebSocket(wss);

// Connect to MongoDB
connectDB();

// Verify email connection
verifyConnection();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/pincode-delivery", pincodeDeliveryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/otp", otpRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Ecommerce API" });
});

// WebSocket connection handling
wss.on("connection", (ws, req) => {
  console.log("New WebSocket connection established");

  // Handle incoming messages
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Received WebSocket message:", data);

      // Handle different message types
      switch (data.type) {
        case "auth":
          // Store user ID with connection
          ws.userId = data.userId;
          console.log(`User ${data.userId} authenticated for WebSocket`);
          ws.send(
            JSON.stringify({
              type: "auth",
              status: "success",
              message: "WebSocket authenticated",
            })
          );
          break;

        case "ping":
          ws.send(
            JSON.stringify({
              type: "pong",
              timestamp: Date.now(),
            })
          );
          break;

        default:
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Unknown message type",
            })
          );
      }
    } catch (error) {
      console.error("WebSocket message error:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid JSON format",
        })
      );
    }
  });

  // Handle client disconnect
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "welcome",
      message: "Connected to Ecommerce WebSocket Server",
      timestamp: Date.now(),
    })
  );
});

// WebSocket status endpoint
app.get("/ws-status", (req, res) => {
  res.json({
    message: "WebSocket server is running",
    connections: wss.clients.size,
    uptime: process.uptime(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server is ready for connections`);
});
