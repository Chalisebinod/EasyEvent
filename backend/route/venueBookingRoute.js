const express = require("express");
const router = express.Router();
const bookingController = require("../controller/venueBookingController");
const { checkAuthentication, checkIsVenueOwner } = require("../middleware/middleware");

// Booking Routes
router.post("/create", checkAuthentication, bookingController.createBooking); // Create a booking
router.put(
  "/edit/:bookingId",
  checkAuthentication,
  bookingController.updateBooking
); // Edit booking details
router.put(
  "/cancel/:bookingId",
  checkAuthentication,
  bookingController.cancelBooking
); // Cancel a booking
router.delete(
  "/delete/:bookingId",
  checkAuthentication,
  bookingController.deleteBooking
); // Delete a booking

// venue owner
// Venue owner routes
router.get("/requests/venue/:venueId",checkAuthentication,checkIsVenueOwner, bookingController.getRequestsByVenue); 
router.get("/requests/profile/:requestId",checkAuthentication,checkIsVenueOwner, bookingController.getBookingByRequestId); // Fetch all requests for a venue
// Fetch all requests for a venue
router.patch("/requests/:requestId",checkAuthentication,checkIsVenueOwner, bookingController.updateRequestStatus); // Update request status
module.exports = router;
