const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "User" // or "VenueOwner" if preferred
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const conversationSchema = new mongoose.Schema(
  {
    // This array will hold both user and venue owner IDs.
    participants: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
    ],
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
