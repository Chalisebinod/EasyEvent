const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const socketIo = require("socket.io");
const http = require("http"); // Added for creating an HTTP server

const authRoutes = require("./route/authRoutes");
const userSelfRoute = require("./route/userSelfRoute");
const adminRoute = require("./route/adminRoute");
const venueOwnerRoute = require("./route/venueOwnerRoutes");
const kycRoute = require("./route/kycRoute");
const venueRoutes = require("./route/venueRoutes");
const bookingRoutes = require("./route/userBookingRoute");
const notificationRoutes = require("./route/notificationRoute");
const hallRoutes = require("./route/hallRoute");
const venueBookingRoutes = require("./route/venueBookingRoute");
const foodRoutes = require("./route/foodRoute");
const paymentRoute = require("./route/paymentRoute");
const chatRoutes = require("./route/chatRoute");
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Routes
app.use("/api", authRoutes);
app.use("/api/auth/payment", paymentRoute);
app.use("/api", userSelfRoute);
app.use("/api", adminRoute);
app.use("/api", venueOwnerRoute);
app.use("/api/kyc", kycRoute);
app.use("/api", venueRoutes);
app.use("/api/book", bookingRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/halls", hallRoutes);
app.use("/api/booking", venueBookingRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/chat", chatRoutes); // Added chat routes

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/EasyEvent", {})
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Create HTTP server and integrate Socket.io without removing existing code
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" } // Adjust CORS settings as needed
});

// Socket.io events for real-time messaging
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // Join a conversation room
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // When a message is sent via Socket.io
  socket.on("sendMessage", (data) => {
    // data should include: { conversationId, message, sender, ... }
    io.to(data.conversationId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Start the server using the HTTP server with Socket.io integrated
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
