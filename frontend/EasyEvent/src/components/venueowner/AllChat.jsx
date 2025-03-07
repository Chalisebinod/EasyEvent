import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserCard from "./helper/UserCard";
import VenueSidebar from "./VenueSidebar";
import { FiImage, FiPaperclip } from "react-icons/fi";
import io from "socket.io-client";

// Adjust as needed if your images are served from a different URL
const BASE_IMAGE_URL = "http://localhost:8000/";

const AllChat = () => {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const token = localStorage.getItem("access_token");
  const currentUserId = localStorage.getItem("user_id"); // current venue owner ID
  const socketRef = useRef();

  // Helper: get full image URL or fallback
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/40";
    return imagePath.startsWith("http")
      ? imagePath
      : BASE_IMAGE_URL + imagePath;
  };

  // Fetch conversation list
  const fetchConversations = async (query = "") => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/chat/conversation/?q=${encodeURIComponent(
          query
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  // Initial fetch of conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchConversations(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle conversation click
  const handleUserClick = async (conversation) => {
    try {
      const response = await fetch("http://localhost:8000/api/chat/recieve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ partnerId: conversation.partnerId }),
      });
      const data = await response.json();
      if (data.success) {
        // Prepare conversation details
        const conv = {
          ...data.data,
          name: data.data.participants.partner.name,
          profile_image: data.data.participants.partner.profile_image,
        };
        setSelectedConversation(conv);

        // Join the conversation-specific room
        const selfId = conv.participants.self._id;
        const partnerId = conv.participants.partner._id;
        const roomId =
          selfId < partnerId
            ? `${selfId}_${partnerId}`
            : `${partnerId}_${selfId}`;
        if (socketRef.current) {
          socketRef.current.emit("join_room", roomId);
        }
      }
    } catch (err) {
      console.error("Error fetching conversation details:", err);
    }
  };

  // Setup socket connection
  useEffect(() => {
    socketRef.current = io("http://localhost:8000");
    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");
      // Join personal room so that we receive messages addressed to this user
      if (currentUserId) {
        socketRef.current.emit("join_room", currentUserId);
      }
    });

    // Listen for new messages
    socketRef.current.on("receive_message", (data) => {
      console.log("Received message:", data);

      // If the message is between the current user and the open partner, append it
      setSelectedConversation((prev) => {
        if (prev && prev.participants) {
          const selfId = prev.participants.self._id;
          const partnerId = prev.participants.partner._id;
          if (
            (data.sender === selfId && data.receiver === partnerId) ||
            (data.sender === partnerId && data.receiver === selfId)
          ) {
            return { ...prev, messages: [...(prev.messages || []), data] };
          }
        }
        return prev;
      });

      // Update conversation list with the latest message
      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (
            conv.partnerId === data.sender ||
            conv.partnerId === data.receiver
          ) {
            return {
              ...conv,
              lastMessage: data.message,
              lastMessageTime: data.createdAt,
            };
          }
          return conv;
        })
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentUserId]);

  // Continuously fetch messages for the selected conversation every 5 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      try {
        const response = await fetch("http://localhost:8000/api/chat/recieve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            partnerId: selectedConversation.participants.partner._id,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setSelectedConversation((prev) => ({
            ...prev,
            messages: data.data.messages,
          }));
        }
      } catch (err) {
        console.error("Error fetching conversation messages:", err);
      }
    };

    // Fetch messages initially and every 5 seconds
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, [selectedConversation, token]);

  // Send message
  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedConversation) return;
    const selfId = selectedConversation.participants.self._id;
    const partnerId = selectedConversation.participants.partner._id;
    const roomId =
      selfId < partnerId ? `${selfId}_${partnerId}` : `${partnerId}_${selfId}`;

    const payload = {
      receiver: partnerId,
      message: chatInput,
      sender: selfId,
      room: roomId,
    };

    // Show it immediately in the UI
    const newMsg = {
      _id: Date.now(),
      message: chatInput,
      createdAt: new Date().toISOString(),
      sender: selfId,
      senderLabel: "You",
      room: roomId,
    };

    setSelectedConversation((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), newMsg],
    }));

    // Send to server
    try {
      const response = await fetch("http://localhost:8000/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!data.success) {
        console.error("Failed to send message:", data.message);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }

    // Emit to socket
    if (socketRef.current) {
      socketRef.current.emit("send_message", payload);
    }

    setChatInput("");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
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
              <h3 className="ml-4 text-xl font-semibold">
                {selectedConversation.name}
              </h3>
            </div>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {selectedConversation.messages &&
              selectedConversation.messages.length > 0 ? (
                selectedConversation.messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex flex-col text-xs ${
                      msg.senderLabel === "You" ? "items-end" : "items-start"
                    }`}
                  >
                    <span className="text-xs text-gray-500">
                      {msg.senderLabel}
                    </span>
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
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No messages yet...</p>
              )}
            </div>
           <div className="flex items-center border-t pt-3 mt-4">
             <input
               type="text"
               value={chatInput}
               onChange={(e) => setChatInput(e.target.value)}
               onKeyDown={(e) => {
                 if (e.key === "Enter") {
                   handleSendMessage();
                 }
               }}
               placeholder="Type a message..."
               className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
             />
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
