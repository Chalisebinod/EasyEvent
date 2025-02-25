const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookingRequest",
    required: true,
  }, // Associated booking
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User making the payment
  amount: { type: Number, required: true }, // Payment amount
  payment_method: { type: String, enum: ["Khalti"], default: "Khalti" }, // Payment method (can be extended later)
  transaction_id: { type: String, required: true, unique: true }, // Khalti transaction ID
  payment_status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  }, // Status of payment
  paid_at: { type: Date, default: Date.now }, // Timestamp of payment
  created_at: { type: Date, default: Date.now }, // Record creation timestamp
  updated_at: { type: Date, default: Date.now },
});

// Middleware to auto-update `updated_at`
paymentSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
