const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'VenueOwner', 
    required: true 
  }, // Links to VenueOwner schema
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, required: true },
  },
  images: [{ type: String }], // Array of image URLs
  capacity: { type: Number, required: true }, // Number of people it can accommodate
  price: { type: Number, required: true }, // Price per booking
  amenities: [{ type: String }], // List of amenities (e.g., WiFi, Parking, Catering)
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String, required: true },
      rating: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  bookings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, required: true },
      status: { type: String, default: 'Pending' }, // Pending, Confirmed, Cancelled
    },
  ],
  verification_status: { type: String, default: 'Unverified' }, // Verified, Unverified
  reported_count: { type: Number, default: 0 }, // Tracks reports against the venue
  status: { type: String, default: 'Active' }, // Active, Suspended
  date_created: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Venue', venueSchema);
