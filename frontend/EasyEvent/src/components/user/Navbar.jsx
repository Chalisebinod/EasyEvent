import React, { useState } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-orange-600 to-orange-800 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div
          className="text-3xl lg:text-4xl font-extrabold tracking-wide cursor-pointer hover:text-yellow-300 transition"
          onClick={() => navigate("/user-dashboard")}
        >
          EasyEvents
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          {[
            { path: "/user-dashboard", label: "Home" },
            { path: "/user-bookings", label: "My Bookings" },
            { path: "/user-chat", label: "Chat" },
            { path: "/about-us", label: "About Us" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-lg font-medium hover:text-yellow-300 transition px-4 py-2 border-b-2 border-transparent hover:border-yellow-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Icons & Mobile Menu */}
        <div className="flex items-center space-x-6">
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-orange-700 py-4 shadow-md">
          <nav className="flex flex-col space-y-3 text-center">
            {[
              { path: "/user-dashboard", label: "Home" },
              { path: "user-bookings", label: "My Bookings" },
              { path: "/user-chat", label: "Chat" },
              { path: "/about-us", label: "About Us" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-lg font-medium text-white hover:text-yellow-300 transition py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
