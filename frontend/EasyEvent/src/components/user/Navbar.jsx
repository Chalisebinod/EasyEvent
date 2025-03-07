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
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-3xl font-extrabold tracking-wide cursor-pointer hover:text-yellow-300 transition"
          onClick={() => navigate("/user-dashboard")}
        >
          EasyEvents
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {[
            { path: "/user-dashboard", label: "Home" },
            { path: "/user-bookings", label: "My Bookings" },
            { path: "/user-chat", label: "Chat" },
          ].map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="text-lg font-medium hover:text-yellow-300 transition border-b-2 border-transparent hover:border-yellow-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Search & Icons */}
        <div className="flex items-center space-x-5">
        


          {/* Profile Icon */}
          <div
            className="text-2xl cursor-pointer hover:text-yellow-300 transition"
            onClick={() => navigate("/user-profile")}
          >
            <FaUserCircle />
          </div>

          {/* Mobile Menu Toggle */}
          <div
            className="md:hidden text-2xl cursor-pointer hover:text-yellow-300 transition"
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
