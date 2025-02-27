import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaCommentAlt, FaTimes } from "react-icons/fa";
import io from "socket.io-client";

const ChatWidget = ({ partnerId, onClose }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const token = localStorage.getItem("access_token");
  // Assuming your app stores the current user's id in localStorage
  const selfId = localStorage.getItem("user_id");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Compute a unique room ID based on the two user IDs.
  const roomId =
    selfId && partnerId
      ? selfId < partnerId
        ? `${selfId}_${partnerId}`
        : `${partnerId}_${selfId}`
      : null;

  const socketRef = useRef(null);

  // Setup socket connection and join the room.
  useEffect(() => {
    socketRef.current = io("http://localhost:8000");
    socketRef.current.on("connect", () => {
      console.log("Connected to realtime chat via socket");
      if (roomId) {
        socketRef.current.emit("join_room", roomId);
      }
    });
    socketRef.current.on("receive_message", (message) => {
      // Optionally, add a sender label if it's not present.
      if (!message.senderLabel) {
        message.senderLabel = message.sender === selfId ? "You" : "";
      }
      setChatMessages((prev) => [...prev, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [partnerId, roomId, selfId]);

  // Function to send a chat message using Axios and socket.
  const handleSendMessage = async () => {
    if (chatInput.trim() === "") return;
    const payload = {
      receiver: partnerId,
      message: chatInput,
      sender: selfId,
      room: roomId,
    };
    try {
      const { data } = await axiosInstance.post("/api/chat/send", payload);
      if (data.success) {
        // Append the new message returned from the API to the state.
        setChatMessages((prev) => [...prev, data.data]);
        // Emit the message through socket for realtime update.
        if (socketRef.current) {
          socketRef.current.emit("send_message", payload);
        }
        setChatInput("");
      } else {
        console.error("Error sending message:", data.error);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // (Optional) Poll for messages as a fallback.
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
                className={`flex flex-col text-xs ${
                  isMyMessage ? "items-end" : "items-start"
                }`}
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
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleSendMessage();
      }
    }}
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
