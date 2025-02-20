const express = require("express");
const router = express.Router();
const foodController = require("../controller/foodController");
const { checkAuthentication } = require("../middleware/middleware");

router.post("/add", checkAuthentication ,foodController.addFood); // Add food to a venue
router.get("/venue/:venueId",checkAuthentication , foodController.getFoodsByVenue); // Get all foods for a venue

module.exports = router;
