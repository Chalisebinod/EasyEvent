import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCard from './helper/UserCard';
import VenueSidebar from './VenueSidebar';
import { FiImage, FiPaperclip } from 'react-icons/fi';

// Base URL for images if the provided image is a path instead of an absolute URL.
const BASE_IMAGE_URL = "http://localhost:8000/";

const AllChat = () => {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  // Helper function to get the full image URL.
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/40';
    return imagePath.startsWith('http') ? imagePath : BASE_IMAGE_URL + imagePath;
  };

  // Fetch the list of conversations (list view)
  const fetchConversations = async (query = '') => {
    try {
      const response = await fetch(`http://localhost:8000/api/chat/conversation/?q=${encodeURIComponent(query)}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  // Initial fetch on mount.
  useEffect(() => {
    fetchConversations();
  }, []);

  // Debounce search: refetch conversations 500ms after user stops typing.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchConversations(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // When a user clicks on a conversation, fetch the full chat details using partnerId.
  const handleUserClick = async (conversation) => {
    try {
      const response = await fetch('http://localhost:8000/api/chat/recieve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ partnerId: conversation.partnerId }),
      });
      const data = await response.json();
      if (data.success) {
        // Set the selected conversation.
        // For convenience, we add name and profile_image fields to use in the chat header.
        setSelectedConversation({
          ...data.data,
          name: data.data.participants.partner.name,
          profile_image: data.data.participants.partner.profile_image,
        });
      }
    } catch (err) {
      console.error("Error fetching conversation details:", err);
    }
  };

  // Dummy function to simulate sending a message.
  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedConversation) return;
    // Create a new message with senderLabel "You"
    const newMsg = {
      _id: Date.now(), // Temporary unique id
      message: chatInput,
      createdAt: new Date().toISOString(),
      sender: selectedConversation.participants.self._id, // use self id from participants
      senderLabel: "You",
    };

    // Update the conversation with the new message.
    setSelectedConversation((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), newMsg],
    }));
    setChatInput('');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Component */}
      <VenueSidebar />

      {/* Conversation List */}
      <div className="w-80 border-r p-4 overflow-y-auto">
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Search user..." 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <UserCard 
                key={conv.partnerId}
                profileImage={getImageUrl(conv.profile_image)}
                name={conv.name}
                lastMessage={conv.lastMessage}
                lastMessageTime={conv.lastMessageTime}
                onClick={() => handleUserClick(conv)}
              />
            ))
          ) : (
            <p className="text-gray-500">No conversations found.</p>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center border-b pb-3 mb-4">
              <img 
                src={getImageUrl(selectedConversation.profile_image)}
                alt={selectedConversation.name}
                className="w-12 h-12 rounded-full object-cover shadow-md"
              />
              <h3 className="ml-4 text-xl font-semibold">{selectedConversation.name}</h3>
            </div>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                selectedConversation.messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex flex-col text-xs ${msg.senderLabel === "You" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-xs text-gray-500">{msg.senderLabel}</span>
                    <div
                      className={`px-4 py-2 rounded-lg max-w-xs break-words shadow ${
                        msg.senderLabel === "You"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-300 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.message}
                    </div>
                    <span className="mt-1 text-gray-500">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No messages yet...</p>
              )}
            </div>
            {/* Chat Input Area */}
            <div className="flex items-center border-t pt-3 mt-4">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {/* Icons for image and file upload */}
              <button className="ml-2 text-gray-600 hover:text-gray-800">
                <FiImage size={20} />
              </button>
              <button className="ml-2 text-gray-600 hover:text-gray-800">
                <FiPaperclip size={20} />
              </button>
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white ml-2 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <h2 className="text-xl text-gray-500">
              Select a conversation to start chatting.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllChat;
