const Booking = require("../model/bookingSchema");
const User = require("../model/user");
const VenueOwner = require("../model/venueOwner");

// Create a new booking
exports.createBooking = async (req, res) => {
  const userId = req.user.id;
  try {
    const {
      venue,
      hall,
      event_details,
      selected_foods,
      requested_foods,
      additional_services,
      pricing,
    } = req.body;

    // Check if the user exists in either User or VenueOwner collections
    const userExists = await User.findById(userId);
    const venueOwnerExists = await VenueOwner.findById(userId);
    if (!userExists && !venueOwnerExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally, prevent duplicate booking per venue
    const existingBooking = await Booking.findOne({ user: userId, venue, isDeleted: false });
    if (existingBooking) {
      return res.status(400).json({
        message: "You have already booked this venue. Only one booking per venue is allowed.",
      });
    }

    const booking = new Booking({
      user: userId,
      venue,
      hall,
      event_details,
      selected_foods: Array.isArray(selected_foods) ? selected_foods : [],
      requested_foods: Array.isArray(requested_foods) ? requested_foods : [],
      additional_services,
      pricing,
    });
    const savedBooking = await booking.save();
    res.status(201).json({ booking: savedBooking });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
};

// Update/edit an existing booking
exports.updateBooking = async (req, res) => {
  const bookingId = req.params.id;
  try {
    const updateData = req.body;
    // Prevent modifying soft delete flag via update.
    delete updateData.isDeleted;
    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true });
    res.status(200).json({ booking: updatedBooking });
  } catch (error) {
    console.error("Update Booking Error:", error);
    res.status(500).json({ message: "Failed to update booking", error: error.message });
  }
};

// Soft delete a booking (set isDeleted to true)
exports.deleteBooking = async (req, res) => {
  const bookingId = req.params.id;
  try {
    // Optionally, you can check if payment_status is "Paid" before allowing deletion.
    const deletedBooking = await Booking.findByIdAndUpdate(bookingId, { isDeleted: true }, { new: true });
    res.status(200).json({ booking: deletedBooking, message: "Booking soft-deleted successfully" });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    res.status(500).json({ message: "Failed to delete booking", error: error.message });
  }
};

// Get all bookings for a given venue with filtering/sorting
exports.getBookings = async (req, res) => {
  const venueId = req.params.venueId;
  // Optionally, a query parameter "period" may be provided (Past, Current, Future)
  const { period } = req.query;
  try {
    const filter = { venue: venueId, isDeleted: false };
    if (period) {
      filter.booking_period = period;
    }
    // Optionally sort by event date ascending (earliest first)
    const bookings = await Booking.find(filter)
      .populate("user", "name email")
      .populate("hall", "name capacity")
      .populate("selected_foods", "name price")
      .sort({ "event_details.date": 1 });
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};
