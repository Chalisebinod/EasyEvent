import React, { useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-orange-500">EasyEvents</div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <a
            href="#"
            className="text-lg font-medium text-gray-700 hover:text-orange-500 hover:border-b-2 border-orange-500 transition"
          >
            HOME
          </a>
          <a
            href="#"
            className="text-lg font-medium text-gray-700 hover:text-orange-500 hover:border-b-2 border-orange-500 transition"
          >
            Explore Venues
          </a>
          <a
            href="#"
            className="text-lg font-medium text-gray-700 hover:text-orange-500 hover:border-b-2 border-orange-500 transition"
          >
            Proposal
          </a>
          <a
            href="#"
            className="text-lg font-medium text-gray-700 hover:text-orange-500 hover:border-b-2 border-orange-500 transition"
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
              className="px-4 py-2 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 w-64 transition"
            />
            <FaSearch className="absolute right-3 top-2.5 text-gray-500" />
          </div>

          {/* Profile Icon */}
          <div className="text-gray-600 text-2xl cursor-pointer hover:text-orange-500 transition" onClick={() => navigate('/user-profile')}>
            <FaUserCircle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
