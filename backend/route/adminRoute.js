// Routes for userController
const express = require("express");
const {
  getAllUsers,
  getAllVenueOwners,
  blockUser,
  blockVenueOwner,
  getAllAdmins,
  getVenueOwner,
} = require("../controller/adminController");
const {
  checkAuthentication,
  checkIsAdmin,
} = require("../middleware/middleware");
const router = express.Router();

router.get("/admins", checkAuthentication, checkIsAdmin, getAllAdmins);

router.get("/users", checkAuthentication, checkIsAdmin, getAllUsers);

router.get("/venueOwnerProfile/:userId", checkAuthentication, checkIsAdmin, getVenueOwner);
router.get(
  "/venue-owners",
  checkAuthentication,
  checkIsAdmin,
  getAllVenueOwners
);
router.put(
  "/users/block/:userId",
  checkAuthentication,
  checkIsAdmin,
  blockUser
);
router.put(
  "/venueOwner/block/:userId",
  checkAuthentication,
  checkIsAdmin,
  blockVenueOwner
);


module.exports = router;
