import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBookOpen,
  FaStar,
  FaMoneyCheck,
  FaFileContract,
  FaChevronDown,
  FaChevronUp,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showKycDropdown, setShowKycDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => setShowLogoutDialog(true);

  const confirmLogout = () => {
    localStorage.removeItem("access_token");
    setShowLogoutDialog(false);
    navigate("/login");
  };

  const cancelLogout = () => setShowLogoutDialog(false);

  const toggleKycDropdown = () => setShowKycDropdown((prev) => !prev);

  // Base styling for navigation items
  const baseLinkClasses =
    "flex items-center px-6 py-3 transition-colors duration-300 rounded-md focus:outline-none";
  // Inactive link style with subtle hover effect (same color family)
  const inactiveLinkClasses =
    "text-gray-300 hover:bg-gray-800 hover:text-white";
  // Active link style
  const activeLinkClasses = "bg-gray-800 text-white";

  // Helper function for rendering navigation links with proper styles
  const renderNavLink = (to, icon, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
      }
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </NavLink>
  );

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 h-screen fixed shadow-xl">
      {/* Sidebar Title */}
      <div className="py-6 px-6 text-center text-3xl font-bold border-b border-gray-800">
        EasyEvent
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        <ul>
          {/* Dashboard */}
          <li>
            {renderNavLink(
              "/admin-dashboard",
              <FaTachometerAlt className="text-lg" />,
              "Dashboard"
            )}
          </li>

          {/* KYC Request with Dropdown */}
          <li className="relative">
            <button
              onClick={toggleKycDropdown}
              className={`${baseLinkClasses} w-full justify-between ${
                showKycDropdown ? activeLinkClasses : inactiveLinkClasses
              }`}
            >
              <div className="flex items-center">
                <FaBookOpen className="text-lg" />
                <span className="ml-4 font-medium">KYC Request</span>
              </div>
              <span>
                {showKycDropdown ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            {showKycDropdown && (
              <ul className="bg-gray-900">
                <li>
                  <NavLink
                    to="/kyc-request"
                    className={({ isActive }) =>
                      `block pl-12 pr-6 py-2 transition-colors duration-300 rounded-md ${
                        isActive ? activeLinkClasses : inactiveLinkClasses
                      }`
                    }
                  >
                    All Requests
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/kyc-request?status=rejected"
                    className={({ isActive }) =>
                      `block pl-12 pr-6 py-2 transition-colors duration-300 rounded-md ${
                        isActive ? activeLinkClasses : inactiveLinkClasses
                      }`
                    }
                  >
                    Rejected
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/kyc-request?status=pending"
                    className={({ isActive }) =>
                      `block pl-12 pr-6 py-2 transition-colors duration-300 rounded-md ${
                        isActive ? activeLinkClasses : inactiveLinkClasses
                      }`
                    }
                  >
                    Pending
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/kyc-request?status=approved"
                    className={({ isActive }) =>
                      `block pl-12 pr-6 py-2 transition-colors duration-300 rounded-md ${
                        isActive ? activeLinkClasses : inactiveLinkClasses
                      }`
                    }
                  >
                    Approved
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Users */}
          <li>
            {renderNavLink(
              "/all-user",
              <FaUsers className="text-lg" />,
              "Users"
            )}
          </li>

          {/* Venue Owner */}
          <li>
            {renderNavLink(
              "/all-venueUser",
              <FaUsers className="text-lg" />,
              "Venue Owner"
            )}
          </li>

          {/* Venues */}
          <li>
            {renderNavLink(
              "/dashboard",
              <FaTachometerAlt className="text-lg" />,
              "Venues"
            )}
          </li>

          {/* Admin */}
          <li>
            {renderNavLink(
              "/all-admin",
              <FaUsers className="text-lg" />,
              "Admin"
            )}
          </li>

          {/* Rating & Reviews */}
          <li>
            {renderNavLink(
              "/reviews",
              <FaStar className="text-lg" />,
              "Rating & Reviews"
            )}
          </li>

          {/* Payment */}
          <li>
            {renderNavLink(
              "/payments",
              <FaMoneyCheck className="text-lg" />,
              "Payment"
            )}
          </li>

          {/* Agreement */}
          <li>
            {renderNavLink(
              "/agreement",
              <FaFileContract className="text-lg" />,
              "Agreement"
            )}
          </li>

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className={`${baseLinkClasses} text-left ${inactiveLinkClasses} hover:bg-red-600 hover:text-white`}
            >
              <FaSignOutAlt className="text-lg text-red-400" />
              <span className="ml-4 font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Confirm Logout
            </h2>
            <p className="text-gray-300">Are you sure you want to log out?</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-300 mr-3"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors duration-300"
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
