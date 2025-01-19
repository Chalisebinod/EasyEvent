import React, { useState } from "react";
import { FaBell } from "react-icons/fa"; // Notification icon
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";


const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const venues = Array(12)
    .fill(0)
    .map((_, i) => ({
      id: i + 1,
      name: `Venue ${i + 1}`,
      location: `Location ${i + 1}`,
      image: "https://allthevenues.com/images/main/1486309967_emirates-palace-abu-dhabi-ballroom-weddings.jpg",
      rating: Math.floor(Math.random() * 5) + 1,
      description: "A beautifully designed space for your special events.",
    }));

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Sorting Filters */}
        <div className="text-orange-500  font-medium flex justify-between mb-8">
          <div className="flex space-x-6">
            <select className="px-6 py-3 border rounded-lg">
              <option>Trending Venues</option>
              <option>Most Booked</option>
            </select>
            <select className="px-6 py-3 border rounded-lg">
              <option>Sort by Rating</option>
              <option>High to Low</option>
              <option>Low to High</option>
            </select>
            <select className="px-6 py-3 border rounded-lg">
              <option>Sort by Location</option>
              <option>Kathmandu</option>
              <option>Pokhara</option>
              <option>Jhapa</option>
            </select>
          </div>
        </div>

        {/* Venues */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105"
            >
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {venue.name}
                </h3>
                <p className="text-gray-600 mb-4">{venue.location}</p>
                <p className="text-gray-500 text-sm mb-4">
                  {venue.description}
                </p>
                <div className="flex items-center">
                  {[...Array(venue.rating)].map((_, index) => (
                    <span key={index} className="text-orange-500 text-xl">
                      ★
                    </span>
                  ))}
                  {venue.rating % 1 !== 0 && (
                    <span className="text-orange-500 text-xl">☆</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}

      <BottomNavbar/>
    </div>
  );
};

export default UserDashboard;
