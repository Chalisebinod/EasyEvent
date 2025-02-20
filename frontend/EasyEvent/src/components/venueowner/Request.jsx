import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VenueSidebar from "./VenueSidebar";
import axios from "axios";

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
      </div>
    </div>
  );
}

export default Request;
