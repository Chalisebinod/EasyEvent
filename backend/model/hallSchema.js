const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true }, 
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    pricePerPlate: { type: Number, required: true },
    features: [{ type: String }], // List of hall-specific features
    availability: { type: Boolean, default: true }, 
    blocked_dates: [{ type: Date }], // Unavailable dates
    seating_arrangements: [{ type: String }] // E.g., "Round Table", "Theater"
  });
  
  module.exports = mongoose.model('Hall', hallSchema);
  