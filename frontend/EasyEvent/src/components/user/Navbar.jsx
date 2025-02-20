import React, { useState } from "react";
import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa"; // Added FaBell for notification
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    
    <header className="bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-3xl font-bold tracking-wider text-white cursor-pointer hover:text-blue-900 transition">
          EasyEvents
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <a
            href="#"
            className="text-lg font-medium text-white hover:text-blue-900 hover:border-b-2 border-blue-900 transition"
          >
            HOME
          </a>
          <a
            href="#"
            className="text-lg font-medium text-white hover:text-blue-900 hover:border-b-2 border-blue-900 transition"
          >
            Explore Venues
          </a>
          <a
            href="#"
            className="text-lg font-medium text-white hover:text-blue-900 hover:border-b-2 border-blue-900 transition"
          >
            Proposal
          </a>
          <a
            href="/user-bookings"
            className="text-lg font-medium text-white hover:text-blue-900 hover:border-b-2 border-blue-900 transition"
          >
            My Bookings
          </a>
        </nav>

        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 border-2 border-white rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 w-64 transition"
            />
            <FaSearch className="absolute right-3 top-2.5 text-gray-500" />
          </div>

          {/* Notification Icon */}
          <div className="relative text-2xl cursor-pointer text-white hover:text-blue-900 transition">
            <FaBell />
            {/* Add a notification dot */}
            <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full w-3 h-3 flex items-center justify-center text-white">
              3
            </span>
          </div>

          {/* Profile Icon */}
          <div
            className="text-2xl cursor-pointer hover:blue-orange-900 transition"
            onClick={() => navigate("/user-profile")}
          >
            <FaUserCircle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
