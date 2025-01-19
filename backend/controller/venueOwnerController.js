const VenueOwner = require("../model/venueOwner"); 
const bcrypt = require("bcrypt");

async function checkKycStatus (req, res) {
  try {
    // Get the venueOwnerId from the middleware (e.g., req.user.id if using JWT auth)
    const venueOwnerId = req.user.id;

    // Find the venue owner by their ID
    const venueOwner = await VenueOwner.findById(venueOwnerId);

    // If no venue owner found, return error
    if (!venueOwner) {
      return res.status(404).json({ message: "Venue Owner not found" });
    }

    // Check if the venue owner's KYC is verified (both 'citizenship_front' and 'citizenship_back' should exist)
    const isKYCVerified =
      venueOwner.status === "verified" &&
      venueOwner.citizenship_front &&
      venueOwner.citizenship_back;

    // Respond with the KYC verification status
    if (isKYCVerified) {
      return res.status(200).json({
        message: "KYC Verified",
        status: "verified",
      });
    } else {
      return res.status(200).json({
        message: "KYC Pending or Incomplete",
        status: venueOwner.status, // Show current status (pending or rejected)
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, try again later" });
  }
};




// Get Venue Owner Profile
async function getVenueOwnerProfile(req, res) {
  try {
    const venueOwnerId = req.user.id; // Venue Owner ID from the middleware
    const venueOwner = await VenueOwner.findById(venueOwnerId).select("-password"); // Exclude password

    if (!venueOwner) {
      return res.status(404).json({ message: "Venue Owner not found" });
    }

    res.status(200).json(venueOwner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Venue Owner Profile
async function updateVenueOwnerProfile (req, res) {
  try {
    const venueOwnerId = req.user.venueOwnerId;
    const { name, contact_number, location, profile_image } = req.body;

    const updatedVenueOwner = await VenueOwner.findByIdAndUpdate(
      venueOwnerId,
      { name, contact_number, location, profile_image },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedVenueOwner) {
      return res.status(404).json({ message: "Venue Owner not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", venueOwner: updatedVenueOwner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Change Password for Venue Owner
async function changeVenueOwnerPassword (req, res)  {
  try {
    const venueOwnerId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const venueOwner = await VenueOwner.findById(venueOwnerId);
    if (!venueOwner) {
      return res.status(404).json({ message: "Venue Owner not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, venueOwner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    venueOwner.password = await bcrypt.hash(newPassword, salt);

    await venueOwner.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
checkKycStatus,getVenueOwnerProfile,changeVenueOwnerPassword,updateVenueOwnerProfile

  };