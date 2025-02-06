import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBookOpen,
  FaStar,
  FaMoneyCheck,
  FaFileContract,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const Sidebar = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showKycDropdown, setShowKycDropdown] = useState(false);
  const navigate = useNavigate();

  // Handle logout confirmation
  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("access_token"); // Remove token from local storage
    setShowLogoutDialog(false); // Hide dialog
    navigate("/login"); // Redirect to login page
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false); // Hide dialog if cancel is clicked
  };

  const toggleKycDropdown = () => {
    setShowKycDropdown(!showKycDropdown);
  };

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen fixed">
      <div className="py-4 px-6 text-center text-2xl font-bold">EASYEVENTS</div>
      <nav className="mt-6">
        <ul>
          <li>
            <Link
              to="/admin-dashboard"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition-all"
            >
              <FaTachometerAlt className="mr-3" />
              Dashboard
            </Link>
          </li>

          {/* KYC Request with dropdown */}
          <li className="relative">
            <button
              onClick={toggleKycDropdown}
              className="flex items-center w-full px-6 py-3 hover:bg-gray-700 transition-all focus:outline-none"
            >
              <FaTachometerAlt className="mr-3" />
              KYC Request
              <span className="ml-auto">
                {showKycDropdown ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            {showKycDropdown && (
              <ul className="bg-gray-700">
                <li>
                  <Link
                    to="/kyc-request"
                    className="block px-8 py-2 hover:bg-gray-600 transition-all"
                  >
                    All Requests
                  </Link>
                </li>
                <li>
                  <Link
                    to="/kyc-request?status=rejected"
                    className="block px-8 py-2 hover:bg-gray-600 transition-all"
                  >
                    Rejected
                  </Link>
                </li>
                <li>
                  <Link
                    to="/kyc-request?status=pending"
                    className="block px-8 py-2 hover:bg-gray-600 transition-all"
                  >
                    Pending
                  </Link>
                </li>
                <li>
                  <Link
                    to="/kyc-request?status=approved"
                    className="block px-8 py-2 hover:bg-gray-600 transition-all"
                  >
                    Approved
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link
              to="/all-user"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition-all"
            >
              <FaTachometerAlt className="mr-3" />
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/all-venueUser"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition-all"
            >
              <FaTachometerAlt className="mr-3" />
              Venue Owner
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition-all"
            >
              <FaTachometerAlt className="mr-3" />
              Venues
            </Link>
          </li>
          <li>
            <Link
              to="/all-admin"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition-all"
            >
              <FaUsers className="mr-3" />
              Admin
            </Link>
          </li>
          <li>
            <Link
              to="/reviews"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition-all"
            >
              <FaStar className="mr-3" />
              Rating & Reviews
            </Link>
          </li>
          <li>
            <Link
              to="/payments"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition-all"
            >
              <FaMoneyCheck className="mr-3" />
              Payment
            </Link>
          </li>
          <li>
            <Link
              to="/agreement"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition-all"
            >
              <FaFileContract className="mr-3" />
              Agreement
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition-all w-full text-left"
            >
              <FaFileContract className="mr-3" />
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-orange-500 p-6 rounded-lg shadow-md w-1/3">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Confirm Logout
            </h2>
            <p className="text-white">Are you sure you want to log out?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
