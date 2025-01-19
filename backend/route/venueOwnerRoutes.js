const express = require("express");
// Middleware to protect routes
const {
  checkAuthentication,
  checkIsVenueOwner,
} = require("../middleware/middleware");
const {
  checkKycStatus,
  getVenueOwnerProfile,
  updateVenueOwnerProfile,
  changeVenueOwnerPassword,
} = require("../controller/venueOwnerController");

const router = express.Router();

// // Get all venues owned by the logged-in venue owner
// router.get("/venues", verifyToken, getVenueDetails);

// // Create a new venue
// router.post("/venues", verifyToken, createVenue);

// // Update an existing venue
// router.put("/venues/:venueId", verifyToken, updateVenue);

// // Delete a venue
// router.delete("/venues/:venueId", verifyToken, deleteVenue);

router.get(
  "/check-kyc-status",
  checkAuthentication,
  checkIsVenueOwner,
  checkKycStatus
);
// Route for getting Venue Owner profile
router.get(
  "/venueOwner/profile",
  checkAuthentication,
  checkIsVenueOwner,
  getVenueOwnerProfile
);

// Route for updating Venue Owner profile
router.put(
  "/profile",
  checkAuthentication,
  checkIsVenueOwner,
  updateVenueOwnerProfile
);

// Route for changing Venue Owner password
router.put(
  "/change-password",
  checkAuthentication,
  checkIsVenueOwner,
  changeVenueOwnerPassword
);

module.exports = router;
