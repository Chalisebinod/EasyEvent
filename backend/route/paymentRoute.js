const express = require("express");
const { checkAuthentication } = require("../middleware/middleware");
const { initiatePayment, verifyPayment, refundPayment, fetchReceivedAmount } = require("../controller/paymentController");
const router = express.Router();
router.post("/initiate", checkAuthentication, initiatePayment);
router.post("/verify", checkAuthentication, verifyPayment);
router.post("/refund", checkAuthentication, refundPayment);
<<<<<<< HEAD
router.post("/get", checkAuthentication, fetchReceivedAmount);

=======
router.get("/get", checkAuthentication, fetchReceivedAmount);
>>>>>>> c0309419742e0c45b492b2749746c78e125961fb


module.exports = router;
