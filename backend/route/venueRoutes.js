const express = require("express");
const { checkAuthentication } = require("../middleware/middleware");
const { createVenue, editVenue, deleteVenue, getAllVenuesForUser, getAllVenuesForShowcase } = require("../controller/venueController");

const router = express.Router();

// Create a new venue (Only accessible to authenticated venue owners)
router.post("/venue/create", checkAuthentication, createVenue);

// Edit an existing venue (Only the owner can edit)
router.put("/edit/:venueId", checkAuthentication, editVenue);

// Delete a venue (Only the owner can delete)
router.delete("/delete/:venueId", checkAuthentication, deleteVenue);

// Get all venues for the authenticated user (Only accessible to authenticated venue owners)
router.get("/venues/user", checkAuthentication, getAllVenuesForUser);
router.get("/venues",getAllVenuesForShowcase);




module.exports = router;
