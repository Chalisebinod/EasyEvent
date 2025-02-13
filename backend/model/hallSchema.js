
const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema({
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerPlate: { type: Number, required: true },
  features: [{ type: String }],
  images: [{ type: String }], // New field: an array of image paths/URLs
  availability: { type: Boolean, default: true },
  blocked_dates: [{ type: Date }],
  seating_arrangements: [{ type: String }],
});

module.exports = mongoose.model("Hall", hallSchema);
