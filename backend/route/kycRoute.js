const express = require("express");
const { updateKYC, upload } = require("../controllers/kycController");

const router = express.Router();

// API Route to update KYC data
router.put(
  "/kyc",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "citizenshipFront", maxCount: 1 },
    { name: "citizenshipBack", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "map", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  updateKYC
);


module.exports = router;
