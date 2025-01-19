const express = require("express");
const { checkAuthentication } = require("../middleware/middleware");
const { getUserProfile, updateProfile, changePassword } = require("../controller/userSelfController");


const router = express.Router();

router.get("/profile", checkAuthentication, getUserProfile);
router.put("/profile/update", checkAuthentication, updateProfile);
router.post("/change-password", checkAuthentication, changePassword);

module.exports = router;
