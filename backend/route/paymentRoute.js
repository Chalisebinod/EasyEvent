const express = require("express");
const { checkAuthentication } = require("../middleware/middleware");
const { initiatePayment, verifyPayment } = require("../controller/paymentController");
const router = express.Router();
router.post("/initiate", checkAuthentication, initiatePayment);
router.post("/verify", checkAuthentication, verifyPayment);

module.exports = router;