const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./route/authRoutes");
const userSelfRoute = require("./route/userSelfRoute");
const adminRoute = require("./route/adminRoute");
const venueOwnerRoute = require("./route/venueOwnerRoutes");
const kycRoute = require("./route/kycRoute");
const venueRoutes = require("./route/venueRoutes");
const bookingRoutes = require("./route/userBookingRoute");
const notificationRoutes = require("./route/notificationRoute");

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Routes
app.use("/api", authRoutes);
app.use("/api", userSelfRoute);
app.use("/api", adminRoute);
app.use("/api", venueOwnerRoute);
app.use("/api/kyc", kycRoute);
app.use("/api", venueRoutes);
app.use("/api/book", bookingRoutes);
app.use("/api/notification", notificationRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/EasyEvent", {})
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
