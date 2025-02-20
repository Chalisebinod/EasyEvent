const express = require("express");
const {
  checkAuthentication,
  checkCanSubmitReview,
} = require("../middleware/middleware");
const { submitReview } = require("../controllers/reviewController");

const router = express.Router();

// Route to submit a review
router.post("/submit", checkAuthentication, checkCanSubmitReview, submitReview);

module.exports = router;
