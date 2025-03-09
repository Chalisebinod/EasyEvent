import React, { useState } from "react";
import { FaSearch, FaUserCircle, FaBell, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="bg-gradient-to-r from-orange-600 to-orange-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-8 py-6 flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-4xl font-extrabold tracking-wide cursor-pointer hover:text-yellow-300 transition"
          onClick={() => navigate("/user-dashboard")}
        >
          EasyEvents
        </div>

        {/* Desktop Navigation and Search */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center">
            {[
              { path: "/user-dashboard", label: "Home", noLeftPadding: true },
              { path: "/user-bookings", label: "My Bookings" },
              { path: "/user-chat", label: "Chat" },
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`text-xl font-medium hover:text-yellow-300 transition border-b-2 border-transparent ${
                  item.noLeftPadding ? "pl-0 pr-4" : "px-4"
                } py-2`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          {/* Professional Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>
        </div>

        {/* Icons on the right with extra padding */}
        <div className="flex items-center space-x-6 pr-8">
          {/* Profile Icon */}
          <div
            className="text-3xl cursor-pointer hover:text-yellow-300 transition"
            onClick={() => navigate("/user-profile")}
          >
            <FaUserCircle />
          </div>

          {/* Mobile Menu Toggle */}
          <div
            className="md:hidden text-3xl cursor-pointer hover:text-yellow-300 transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
