const express = require("express");
const { checkAuthentication } = require("../middleware/middleware");
const {
  getUserProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyOtp,
} = require("../controller/userSelfController");

const router = express.Router();

router.get("/profile", checkAuthentication, getUserProfile);
router.put("/profile/update", checkAuthentication, updateProfile);
router.put("/change-password", checkAuthentication, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtp);
module.exports = router;
