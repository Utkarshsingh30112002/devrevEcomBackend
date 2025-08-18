let wss = null;

// Initialize WebSocket server reference
const initializeWebSocket = (websocketServer) => {
  wss = websocketServer;
};

// Broadcast to all connected clients
const broadcast = (message) => {
  if (!wss) {
    console.log("WebSocket server not initialized");
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      // WebSocket.OPEN
      client.send(JSON.stringify(message));
    }
  });
};

// Broadcast to specific user
const broadcastToUser = (userId, message) => {
  if (!wss) {
    console.log("WebSocket server not initialized");
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === 1 && client.userId === userId) {
      client.send(JSON.stringify(message));
    }
  });
};

// Broadcast cart commands
const broadcastCartCommand = (userId, command, data = null) => {
  broadcastToUser(userId, {
    type: "command",
    action: command,
    userId: userId,
    data: data,
    timestamp: Date.now(),
  });
};

// Broadcast order commands
const broadcastOrderCommand = (userId, command, data = null) => {
  broadcastToUser(userId, {
    type: "command",
    action: command,
    userId: userId,
    data: data,
    timestamp: Date.now(),
  });
};

// Broadcast notification
const broadcastNotification = (userId, notification) => {
  broadcastToUser(userId, {
    type: "notification",
    userId: userId,
    notification: notification,
    timestamp: Date.now(),
  });
};

// Specific command functions for chatbot
const sendFetchCartCommand = (userId) => {
  broadcastCartCommand(userId, "fetch-cart");
};

const sendFetchOrderCommand = (userId) => {
  broadcastOrderCommand(userId, "fetch-order");
};

const sendRefreshUICommand = (userId, component) => {
  broadcastToUser(userId, {
    type: "command",
    action: "refresh-ui",
    userId: userId,
    data: { component },
    timestamp: Date.now(),
  });
};

const sendCartUpdateNotification = (userId, action, itemName) => {
  broadcastNotification(userId, {
    title: "Cart Updated",
    message: `${itemName} ${action} to cart`,
    type: "success",
    action: action,
  });
};

const sendOrderUpdateNotification = (userId, action, orderId) => {
  broadcastNotification(userId, {
    title: "Order Updated",
    message: `Order ${orderId} ${action}`,
    type: "info",
    action: action,
  });
};

module.exports = {
  initializeWebSocket,
  broadcast,
  broadcastToUser,
  broadcastCartCommand,
  broadcastOrderCommand,
  broadcastNotification,
  sendFetchCartCommand,
  sendFetchOrderCommand,
  sendRefreshUICommand,
  sendCartUpdateNotification,
  sendOrderUpdateNotification,
};
