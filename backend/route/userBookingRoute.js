const express = require('express');
const { bookEvent, getBookingDetails, deleteBooking } = require('../controller/userBookingController');
const router = express.Router();

// Route to book an event
router.post('/book', bookEvent);

// Route to get booking details
router.get('/booking/:bookingId', getBookingDetails);

// Route to delete a booking
router.delete('/booking/:bookingId', deleteBooking);

module.exports = router;
