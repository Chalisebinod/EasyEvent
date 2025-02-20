const mongoose = require("mongoose");

const bookingRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who is making the request
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true }, // Which venue is being booked
  hall: { type: mongoose.Schema.Types.ObjectId, ref: "Hall", required: true }, // Selected Hall

  event_details: {
    event_type: { type: String, required: true }, // e.g., "Marriage", "Birthday"
    date: { type: Date, required: true }, // Event date
    guest_count: { type: Number, required: true }, // Total guests
  },

  selected_foods: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }], // Reference to Food Schema

  additional_services: [
    {
      name: { type: String, required: true },
      description: { type: String, default: "" },
    },
  ],

  pricing: {
    original_per_plate_price: { type: Number, required: true }, // Venue's default price per plate
    user_offered_per_plate_price: { type: Number, required: true }, // User's offer per plate
    final_per_plate_price: { type: Number }, // Accepted price by the venue
    total_cost: { type: Number }, // Final total cost after acceptance
  },

  cancellation_policy: {
    cancel_before_days: { type: Number, required: false }, // How many days before the event a user can cancel
    cancellation_fee: { type: Number, default: 0 }, // Optional: Fee if cancellation occurs
  },

  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Cancelled"],
    default: "Pending",
  }, // Status of booking request
  reason: {
    type: String, default: "no status has been added",
  },
  payment_status: {
    type: String,
    enum: ["Unpaid", "Partially Paid", "Paid"],
    default: "Unpaid",
  }, // Payment tracking

  created_at: { type: Date, default: Date.now }, // When request was made
  updated_at: { type: Date, default: Date.now },
});

// Middleware to auto-update `updated_at`
bookingRequestSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("BookingRequest", bookingRequestSchema);
