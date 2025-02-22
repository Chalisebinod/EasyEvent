import React, { useState } from "react";
import { FaSearch, FaUserCircle, FaBell, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-3xl font-bold tracking-wider cursor-pointer hover:text-yellow-200 transition"
          onClick={() => navigate("/user-dashboard")}
        >
          EasyEvents
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a
            href="/user-dashboard"
            className="text-lg font-medium hover:text-yellow-200 transition border-b-2 border-transparent hover:border-yellow-200"
          >
            Home
          </a>
          <a
            href="/send-proposal"
            className="text-lg font-medium hover:text-yellow-200 transition border-b-2 border-transparent hover:border-yellow-200"
          >
            Send Proposal
          </a>
          <a
            href="/user-bookings"
            className="text-lg font-medium hover:text-yellow-200 transition border-b-2 border-transparent hover:border-yellow-200"
          >
            My Bookings
          </a>
        </nav>

        {/* Search & Icons */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-64 px-4 py-2 rounded-full text-gray-700 transition border border-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <FaSearch className="absolute right-3 top-2.5 text-gray-500" />
          </div>

          {/* Notification Icon */}
          <div
            className="relative text-2xl cursor-pointer hover:text-yellow-200 transition"
            onClick={() => navigate("/notifications")}
          >
            <FaBell />
            <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full w-3 h-3 flex items-center justify-center text-white">
              3
            </span>
          </div>

          {/* Profile Icon */}
          <div
            className="text-2xl cursor-pointer hover:text-yellow-200 transition"
            onClick={() => navigate("/user-profile")}
          >
            <FaUserCircle />
          </div>

          {/* Mobile Menu Toggle */}
          <div
            className="md:hidden text-2xl cursor-pointer hover:text-yellow-200 transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-orange-600">
          <div className="container mx-auto px-6 py-2 flex flex-col space-y-2">
            <a
              href="/user-dashboard"
              className="text-lg font-medium hover:text-yellow-200 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/user-book/:id"
              className="text-lg font-medium hover:text-yellow-200 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Send Proposal
            </a>
            <a
              href="/user-bookings"
              className="text-lg font-medium hover:text-yellow-200 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Bookings
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
