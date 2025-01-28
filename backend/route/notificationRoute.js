const express = require('express');
const router = express.Router();
const { getVenueOwnerNotifications } = require('../controller/notificationController');
const { checkAuthentication } = require('../middleware/middleware');

// Route to get venue owner notifications
router.get('/notifications/venue-owner', checkAuthentication,getVenueOwnerNotifications);

module.exports = router;
