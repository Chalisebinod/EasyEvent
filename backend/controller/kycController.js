const multer = require("multer");
const fs = require("fs");
const path = require("path");
const KYC = require("../model/KYC");

// Ensure the "uploads" directory exists
const uploadDir = path.join(__dirname, "../uploads/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only JPG, PNG, and PDF allowed."));
    }
    cb(null, true);
  },
});

// Controller method to handle KYC update
const updateKYC = async (req, res) => {
  try {
    const { name, phone, dob, gender } = req.body;

    // Validate required fields
    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Check if KYC record exists
    const existingKYC = await KYC.findOne({ phone });
    if (!existingKYC) {
      return res.status(404).json({ error: "KYC record not found." });
    }

    // File validation
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    for (const fileKey in req.files) {
      const file = req.files[fileKey][0];
      if (file && (!allowedMimeTypes.includes(file.mimetype) || file.size > maxFileSize)) {
        return res
          .status(400)
          .json({ error: `Invalid file: ${fileKey}. Only JPG, PNG, or PDF under 5MB allowed.` });
      }
    }

    // Ensure essential files are included
    const requiredFiles = ["profile", "citizenshipFront"];
    for (const field of requiredFiles) {
      if (!req.files?.[field]) {
        return res
          .status(400)
          .json({ error: `Missing essential file: ${field}` });
      }
    }

    // Update KYC record
    Object.assign(existingKYC, {
      name,
      dob,
      gender,
      profile: req.files?.profile?.[0]?.path || existingKYC.profile,
      citizenshipFront:
        req.files?.citizenshipFront?.[0]?.path || existingKYC.citizenshipFront,
      citizenshipBack:
        req.files?.citizenshipBack?.[0]?.path || existingKYC.citizenshipBack,
      pan: req.files?.pan?.[0]?.path || existingKYC.pan,
      map: req.files?.map?.[0]?.path || existingKYC.map,
      signature: req.files?.signature?.[0]?.path || existingKYC.signature,
    });

    await existingKYC.save();
    res.json({ message: "KYC updated successfully!", data: existingKYC });
  } catch (error) {
    console.error("Error updating KYC:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};


module.exports = { updateKYC, upload };
