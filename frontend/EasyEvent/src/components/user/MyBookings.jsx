import React, { useState } from "react";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";

const MyBookings = () => {
  const bookings = [
    {
      id: 1,
      eventType: "Birthday Party",
      eventName: "John's 30th Birthday Bash",
      finalPrice: 500,
      location: "New York City",
      eventDate: "2025-04-15",
      guests: 20,
      status: "Confirmed",
    },
    {
      id: 2,
      eventType: "Wedding",
      eventName: "Alice & Bob's Wedding",
      finalPrice: 2000,
      location: "Beachside Resort",
      eventDate: "2025-06-10",
      guests: 100,
      status: "Pending",
    },
    {
      id: 3,
      eventType: "Conference",
      eventName: "Tech Leaders Summit",
      finalPrice: 800,
      location: "San Francisco",
      eventDate: "2025-08-20",
      guests: 150,
      status: "Confirmed",
    },
    {
      id: 4,
      eventType: "Concert",
      eventName: "Live Music Fest",
      finalPrice: 1200,
      location: "Los Angeles",
      eventDate: "2025-09-05",
      guests: 500,
      status: "Confirmed",
    },
    {
      id: 5,
      eventType: "Seminar",
      eventName: "Business Growth 101",
      finalPrice: 300,
      location: "Chicago",
      eventDate: "2025-10-10",
      guests: 80,
      status: "Pending",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;
  const totalPages = Math.ceil(bookings.length / rowsPerPage);
  const displayedBookings = bookings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-4 text-left">Event Type</th>
                  <th className="py-3 px-4 text-left">Event Name</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Guests</th>
                  <th className="py-3 px-4 text-left">Final Price</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {displayedBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-4">{booking.eventType}</td>
                    <td className="py-3 px-4">{booking.eventName}</td>
                    <td className="py-3 px-4">{booking.location}</td>
                    <td className="py-3 px-4">{booking.eventDate}</td>
                    <td className="py-3 px-4">{booking.guests}</td>
                    <td className="py-3 px-4">${booking.finalPrice}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          booking.status === "Confirmed"
                            ? "bg-green-500"
                            : booking.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </main>
      <BottomNavbar />
    </div>
  );
};

export default MyBookings;
