const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact_number: { type: String, default: null },
  profile_image: { type: String, default: null },
  location: { type: String, default: null },
  role: { type: String, default: "user" },
  is_blocked: { type: Boolean, default: false },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue", // Allows users to save favorite venues
    },
  ],
  reviews: [
    {
      venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" }, // Venue being reviewed
      comment: { type: String, required: true },
      rating: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  bookings: [
    {
      venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
      date: { type: Date, required: true },
      status: { type: String, default: "Pending" }, // Pending, Confirmed, Cancelled
    },
  ],
  status: { type: String, default: "Active" },
  date_created: { type: Date, default: Date.now },
  last_login: { type: Date, default: null },
});

module.exports = mongoose.model("User", userSchema);
