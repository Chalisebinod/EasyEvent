import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCommentAlt, FaTimes } from "react-icons/fa";

const ChatWidget = ({ partnerId, onClose }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const token = localStorage.getItem("access_token");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Function to send a chat message using Axios
  const handleSendMessage = async () => {
    if (chatInput.trim() === "") return;
    try {
      const { data } = await axiosInstance.post("/api/chat/send", {
        receiver: partnerId,
        message: chatInput,
      });
      if (data.success) {
        // Append the new message returned from the API to the state.
        setChatMessages((prev) => [...prev, data.data]);
        setChatInput("");
      } else {
        console.error("Error sending message:", data.error);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Function to fetch messages by sending the partnerId in the request body.
  const fetchMessages = async () => {
    try {
      const { data } = await axiosInstance.post("/api/chat/recieve", {
        partnerId: partnerId,
      });
      if (data.success) {
        setChatMessages(data.data.messages);
      } else {
        console.error("Error fetching messages:", data.error);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Poll for new messages every 5 seconds while the widget is open.
  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [partnerId]);

  return (
    <div className="bg-white/95 backdrop-blur-md w-80 h-96 shadow-2xl rounded-2xl p-6 flex flex-col fixed bottom-20 right-6 z-50">
      {/* Chat Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Messenger</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes size={22} />
        </button>
      </div>
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {chatMessages.length > 0 ? (
          chatMessages.map((msg) => {
            const isMyMessage = msg.senderLabel === "You";
            return (
              <div
                key={msg._id || msg.id}
                className={`flex flex-col text-xs ${isMyMessage ? "items-end" : "items-start"}`}
              >
                <span className="text-xs text-gray-500">{msg.senderLabel}</span>
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    isMyMessage
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
            );
          })
        ) : (
          <p className="text-center text-gray-500">No messages yet...</p>
        )}
      </div>
      {/* Chat Input Area */}
      <div className="flex items-center border-t pt-3">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white ml-2 px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
