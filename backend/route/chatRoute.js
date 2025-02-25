const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");
const { checkAuthentication } = require("../middleware/middleware"); // Adjust the path as needed

// All routes below require authentication
router.use(checkAuthentication);

// Create or get a conversation between two participants
router.post("/conversation", chatController.createConversation);

// Send a message in a conversation
router.post("/message", chatController.sendMessage);

// Get all messages for a specific conversation
router.get("/conversation/:conversationId", chatController.getMessages);

// Get all conversations for the authenticated user
router.get("/conversations", chatController.getConversations);

module.exports = router;
