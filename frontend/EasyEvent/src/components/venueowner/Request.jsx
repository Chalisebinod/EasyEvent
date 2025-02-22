import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VenueSidebar from "./VenueSidebar";
import axios from "axios";
import { FaTimes, FaCommentAlt } from "react-icons/fa"; // Added FaCommentAlt

function Request() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");
  const [requests, setRequests] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust as needed

  const venueId = localStorage.getItem("venueID");
  const accessToken = localStorage.getItem("access_token");

  // New state variables for the messaging feature
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // New function to handle sending messages
  const handleSendMessage = () => {
    if (chatInput.trim() === "") return;
    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: chatInput,
      time: new Date().toLocaleTimeString(),
    };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    setChatInput("");
  };

  // Fetch venue requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/booking/requests/venue/${venueId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setRequests(response.data.requests);
        setStatuses(response.data.requests.map((req) => req.status));
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [venueId, accessToken]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  const handleSortChange = (e) => setSort(e.target.value);

  const handleStatusChange = (index, value) => {
    const newStatuses = [...statuses];
    newStatuses[index] = value;
    setStatuses(newStatuses);
  };

  const handleProfileClick = (id) => {
    navigate(`/event-details/${id}`);
  };

  // Filter requests by user name or event type
  const filteredRequests = requests.filter(
    (req) =>
      (req.user?.name &&
        req.user.name.toLowerCase().includes(search.toLowerCase())) ||
      req.event_details.event_type.toLowerCase().includes(search.toLowerCase())
  );

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sort === "date") {
      return new Date(a.event_details.date) - new Date(b.event_details.date);
    } else {
      return a.event_details.event_type.localeCompare(
        b.event_details.event_type
      );
    }
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen flex">
      <VenueSidebar />
      <div className="p-6 w-full bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Requests</h1>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or event type"
            className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={sort}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="event">Sort by Event</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Event Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRequests.map((req, index) => (
                <tr key={req._id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="cursor-pointer"
                      onClick={() => handleProfileClick(req._id)}
                    >
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://via.placeholder.com/40"
                        alt={req.user?.name || "Unknown User"}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {req.event_details.event_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(req.event_details.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={statuses[index]}
                      onChange={(e) =>
                        handleStatusChange(index, e.target.value)
                      }
                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Approve">Approve</option>
                      <option value="Reject">Reject</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex items-center justify-center space-x-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* MESSAGING FEATURE */}
        <div className="fixed bottom-6 right-6 z-50">
          {showChat ? (
            <div className="bg-white w-80 h-96 shadow-xl rounded-lg p-4 flex flex-col">
              {/* Chat Header */}
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-xl font-bold text-gray-800">Messenger</h2>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col text-xs ${
                      msg.sender === "user"
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-xs ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-300 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="mt-1 text-gray-500">{msg.time}</span>
                  </div>
                ))}
                {chatMessages.length === 0 && (
                  <p className="text-center text-gray-500">No messages yet...</p>
                )}
              </div>
              {/* Chat Input Area */}
              <div className="flex items-center border-t pt-2">
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
          ) : (
            <button
              onClick={() => setShowChat(true)}
              className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <FaCommentAlt size={24} />
            </button>
          )}
        </div>
        {/* END OF MESSAGING FEATURE */}
      </div>
    </div>
  );
}

export default Request;
