const Conversation = require("../model/conversation");

// Create or get an existing conversation between two participants
exports.createConversation = async (req, res) => {
  const { participants } = req.body; // Expecting an array of two user IDs

  // Optionally, ensure that the authenticated user is one of the participants:
  if (!participants.includes(req.user.id)) {
    return res.status(403).json({ message: "Access denied." });
  }

  try {
    // Find an existing conversation containing both participants
    let conversation = await Conversation.findOne({
      participants: { $all: participants }
    });
    if (!conversation) {
      conversation = new Conversation({ participants });
      await conversation.save();
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send a message in a conversation
exports.sendMessage = async (req, res) => {
  const { conversationId, message } = req.body;
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    // Use the authenticated user's ID as the sender
    const newMessage = { sender: req.user.id, message };
    conversation.messages.push(newMessage);
    await conversation.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all messages for a conversation
exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const conversation = await Conversation.findById(conversationId).populate("participants", "name");
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    // Verify the authenticated user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p._id.toString() === req.user.id
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(200).json(conversation.messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all conversations for the authenticated user
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    }).populate("participants", "name");
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
