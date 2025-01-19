const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./route/authRoutes"); // Ensure the correct path to authRoutes
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 8000;
const userSelfRoute = require("./route/userSelfRoute");
const adminRoute = require("./route/adminRoute");
const venueOwnerRoute = require("./route/venueOwnerRoutes");
// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use("/api", authRoutes);
app.use("/api", userSelfRoute);
app.use("/api", adminRoute);
app.use("/api", venueOwnerRoute);

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/EasyEvent") // Make sure MongoDB is running on localhost:27017
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
