// kycController.js
const Kyc = require("../model/KYC");
const VenueOwner = require("../model/venueOwner");
const Venue = require("../model/venue");
const upload = require("../controller/fileController");
const Notification = require("../model/notifications");

// Controller for handling KYC updates

const updateKYC = async (req, res) => {
  try {
    upload.fields([
      { name: "profile", maxCount: 1 },
      { name: "citizenshipFront", maxCount: 1 },
      { name: "citizenshipBack", maxCount: 1 },
      { name: "pan", maxCount: 1 },
      { name: "map", maxCount: 1 },
      { name: "signature", maxCount: 1 },
      { name: "venueImages", maxCount: 3 },
    ])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Extract and parse text fields from req.body
      const { venueName, venueAddress } = req.body;
      let parsedVenueAddress = venueAddress;
      if (typeof venueAddress === "string") {
        try {
          parsedVenueAddress = JSON.parse(venueAddress);
        } catch (parseError) {
          return res.status(400).json({
            error:
              "Invalid venueAddress format. Please provide a valid JSON object.",
          });
        }
      }

      if (
        !venueName ||
        !parsedVenueAddress ||
        !parsedVenueAddress.address ||
        !parsedVenueAddress.city ||
        !parsedVenueAddress.state ||
        !parsedVenueAddress.zip_code
      ) {
        return res.status(400).json({
          error:
            "Missing required fields: venueName and all components of venueAddress.",
        });
      }

      // Get the venue owner details from the middleware
      const userId = req.user.id;
      const existingOwner = await VenueOwner.findById(userId);
      if (!existingOwner) {
        return res.status(404).json({ error: "Venue owner not found." });
      }

      // Validate venueImages count (exactly 2 or 3 images)
      const venueImages = req.files.venueImages;
      if (!venueImages || venueImages.length < 2 || venueImages.length > 3) {
        return res.status(400).json({
          error: "Please upload exactly 2 or 3 venue images.",
        });
      }

      // Build the update object with new file paths and details
      const updateData = {
        profile: req.files?.profile?.[0]?.path || "",
        citizenshipFront: req.files?.citizenshipFront?.[0]?.path || "",
        citizenshipBack: req.files?.citizenshipBack?.[0]?.path || "",
        pan: req.files?.pan?.[0]?.path || "",
        map: req.files?.map?.[0]?.path || "",
        signature: req.files?.signature?.[0]?.path || "",
        venueName,
        venueAddress: parsedVenueAddress,
        venueImages: venueImages.map((file) => file.path),
        // You might want to update other fields as necessary
      };

      // Instead of creating a new document, check if one exists for this phone
      const existingKyc = await Kyc.findOne({ phone: existingOwner.contact_number });
      if (existingKyc) {
        // Update the existing record
        Object.assign(existingKyc, updateData);
        await existingKyc.save();
        return res.json({ message: "KYC updated successfully!", data: existingKyc });
      } else {
        // Create a new KYC record
        const newKYC = new Kyc({
          owner: existingOwner._id,
          name: existingOwner.name,
          phone: existingOwner.contact_number,
          email: existingOwner.email,
          ...updateData,
        });
        await newKYC.save();
        return res.json({ message: "KYC updated successfully!", data: newKYC });
      }
    });
  } catch (error) {
    console.error("Error updating KYC:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};





const verifyKYC = async (req, res) => {
  try {
    const { kycId, status, message } = req.body;
    const adminId = req.user.id; // Assuming the admin ID is available from middleware

    // Validate required fields
    if (!kycId || !status) {
      return res
        .status(400)
        .json({ error: "Missing required fields: kycId and status." });
    }

    // Allowed status values
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Allowed values: pending, approved, rejected.",
      });
    }

    // Fetch the KYC record
    const kycRecord = await Kyc.findById(kycId);
    if (!kycRecord) {
      return res.status(404).json({ error: "KYC record not found." });
    }

    // Update KYC status
    kycRecord.verificationStatus = status;

    // If rejected, set rejection message
    if (status === "rejected") {
      kycRecord.rejectMsg = message || "No reason provided.";
    } else {
      kycRecord.rejectMsg = null; // Clear rejection message if approved/pending
    }

    await kycRecord.save();

    // Create a notification for the VenueOwner
    const notificationMessage =
      status === "approved"
        ? "Your KYC verification has been approved."
        : status === "rejected"
        ? `Your KYC verification was rejected. Reason: ${message || "No reason provided."}`
        : "Your KYC verification is pending.";

    const notification = new Notification({
      userId: kycRecord.owner, // Assuming `ownerId` is the VenueOwner's ID
      message: notificationMessage,
      role: "VenueOwner",
    });

    await notification.save();

    res.json({
      message: `KYC status updated successfully to ${status}.`,
      data: kycRecord,
    });
  } catch (error) {
    console.error("Error verifying KYC:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Controller for Admin to get all KYC requests
const getAllKYC = async (req, res) => {
  try {
    const { status } = req.query; // Get the status from query params

    // Define a filter object to apply conditions dynamically
    let filter = {};
    if (status) {
      filter.verificationStatus = status; // Filter based on status if provided
    }

    // Fetch KYC records based on the filter
    const kycRecords = await Kyc.find(filter)
      .populate("owner", "name contact_number email")
      .exec();

    if (!kycRecords || kycRecords.length === 0) {
      return res.status(404).json({ error: "No KYC records found." });
    }

    // Format the response data
    const kycData = kycRecords.map((record) => ({
      _id: record._id,
      venueOwnerName: record.owner?.name || "Unknown", // Get owner's name
      venueName: record.venueName,
      location: `${record.venueAddress.address}, ${record.venueAddress.city}, ${record.venueAddress.state}, ${record.venueAddress.zip_code}`,
      phoneNumber: record.owner?.contact_number || "N/A",
      status: record.verificationStatus,
    }));

    res.json({ message: "KYC records fetched successfully.", data: kycData });
  } catch (error) {
    console.error("Error fetching KYC records:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};


// getAllKYC controller - Fetches all KYC records for the admin
// getProfileKyc controller - Fetch a specific KYC record based on kycId
async function getProfileKyc(req, res) {
  try {
    const { kycId } = req.params; // Get the kycId from the request params

    // Validate if kycId is provided
    if (!kycId) {
      return res.status(400).json({ error: "KYC ID is required." });
    }

    // Fetch the specific KYC record using the kycId
    const kycRecord = await Kyc.findById(kycId)
      .populate("owner", "name contact_number email") // Populate the venue owner details (name, phone, email)
      .exec();

    // If the KYC record is not found, return an error
    if (!kycRecord) {
      return res.status(404).json({ error: "KYC record not found." });
    }

    // Return the detailed KYC data
    const kycData = {
      venueOwnerName: kycRecord.owner?.name || "N/A", // Venue Owner Name (from populated data)
      venueName: kycRecord.venueName, // Venue Name
      venueAddress: {
        address: kycRecord.venueAddress.address,
        city: kycRecord.venueAddress.city,
        state: kycRecord.venueAddress.state,
        zip_code: kycRecord.venueAddress.zip_code,
      }, // Venue Address
      phoneNumber: kycRecord.owner?.contact_number || "N/A", // Venue Owner Phone Number (from populated data)
      email: kycRecord.owner?.email || "N/A", // Venue Owner Email
      status: kycRecord.verificationStatus, // KYC Status (approved, rejected, pending)
      rejectMsg: kycRecord.rejectMsg || null, // Rejection message (if available)
      profileImage: kycRecord.profile || "No profile image", // Profile Image URL
      citizenshipFront: kycRecord.citizenshipFront || "No file uploaded", // Citizenship Front
      citizenshipBack: kycRecord.citizenshipBack || "No file uploaded", // Citizenship Back
      pan: kycRecord.pan || "No file uploaded", // PAN document
      map: kycRecord.map || "No map file uploaded", // Map image
      signature: kycRecord.signature || "No signature uploaded", // Signature image
      venueImages: kycRecord.venueImages || "No venue images uploaded", // Venue Images
    };

    res.json({
      message: "KYC profile fetched successfully.",
      data: kycData,
    });
  } catch (error) {
    console.error("Error fetching KYC profile:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
}
// Controller to fetch Venue Owner's current information
const getVenueOwnerProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available via auth token

    // Fetch the venue owner based on userId
    const venueOwner = await VenueOwner.findById(userId);
    if (!venueOwner) {
      return res.status(404).json({ error: "Venue owner not found." });
    }

    // Return venue owner's current profile data
    res.json({
      message: "Venue owner profile fetched successfully.",
      data: {
        name: venueOwner.name,
        contact_number: venueOwner.contact_number,
        email: venueOwner.email,
        address: venueOwner.address || null, // Show address if available
        city: venueOwner.city || null,
        state: venueOwner.state || null,
        zip_code: venueOwner.zip_code || null,
        venueName: venueOwner.venueName || null,
        // Add more fields as needed
      },
    });
  } catch (error) {
    console.error("Error fetching venue owner profile:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

module.exports = { updateKYC, verifyKYC, getAllKYC, getProfileKyc,getVenueOwnerProfile };
