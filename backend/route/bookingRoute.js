const express = require("express");
const { checkAuthentication } = require("../middleware/middleware");
const { createBooking, updateBooking, deleteBooking } = require("../controller/bookingController");
const { getBookingByRequestId, setPaymentDetails } = require("../controller/venueBookingController");
const router = express.Router();


// Create a new booking
router.post("/create", checkAuthentication, createBooking);

// Update/edit an existing booking (by booking ID)
router.patch("/:id",checkAuthentication , updateBooking);

// Soft delete a booking (by booking ID)
router.delete("/:id", checkAuthentication, deleteBooking);

// Get all bookings for a specific venue with optional filtering/sorting
router.get("/venue/:venueId",checkAuthentication, getBookingByRequestId);


module.exports = router;
