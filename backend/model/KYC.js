const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  profile: { type: String, default: "" },
  citizenshipFront: { type: String, default: "" },
  citizenshipBack: { type: String, default: "" },
  pan: { type: String, default: "" },
  map: { type: String, default: "" },
  signature: { type: String, default: "" },
});

const Kyc = mongoose.model("Kyc", kycSchema);

module.exports = Kyc;
