const express = require("express");
const {
  bookEvent,
  getBookingDetails,
  deleteBooking,
} = require("../controller/userBookingController");




const router = express.Router();

// User routes
router.post("/book", bookEvent);
router.get("/booking/:bookingId", getBookingDetails);
router.delete("/booking/:bookingId", deleteBooking);



module.exports = router;
