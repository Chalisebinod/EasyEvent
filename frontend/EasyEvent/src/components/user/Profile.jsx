import React, { useState, useEffect, useRef } from "react";
import { FaUserEdit, FaSignOutAlt, FaCamera } from "react-icons/fa";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8000/";

// Helper function to convert a stored image path to a full URL
const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/150";
  // If already a URL, return as is
  if (imagePath.startsWith("http")) return imagePath;
  // Replace backslashes with forward slashes and prepend the base URL
  return `${BASE_URL}${imagePath.replace(/\\/g, "/")}`;
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    email: "",
    contact_number: "",
    profile_image: null,
  });
  const fileInputRef = useRef(null);

  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setProfile(response.data);

        // Prepare form data for editing
        setUpdatedProfile({
          name: response.data.name || "",
          email: response.data.email || "",
          contact_number: response.data.contact_number || "",
          profile_image: null,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response && error.response.status === 401) {
          toast.error("Session expired, please login again.");
          navigate("/login");
        } else {
          toast.error("Failed to fetch profile data. Please try again.");
        }
      }
    };

    fetchProfile();
  }, [accessToken, navigate]);

  // Switch to edit mode
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setUpdatedProfile((prev) => ({
      ...prev,
      profile_image: e.target.files[0],
    }));
  };

  // Save changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", updatedProfile.name);
    formData.append("email", updatedProfile.email);
    formData.append("contact_number", updatedProfile.contact_number);

    if (updatedProfile.profile_image) {
      formData.append("profile_image", updatedProfile.profile_image);
    }

    try {
      // 1) Update profile on server
      await axios.put("http://localhost:8000/api/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // "Content-Type": "multipart/form-data" is set automatically by axios
        },
      });

      toast.success("Profile updated successfully!");

      
      const updatedResponse = await axios.get("http://localhost:8000/api/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setProfile(updatedResponse.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-5xl w-full mx-auto p-4 flex-1">
        {profile ? (
          <div className="bg-white rounded-lg shadow p-6 relative">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
              {/* Profile Image */}
              <div className="flex-shrink-0 mb-4 md:mb-0 relative">
                <img
                  src={getProfileImageUrl(profile.profile_image)}
                  alt="Profile"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-200 object-cover shadow-sm"
                />
              </div>
              {/* Name & Basic Info */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {profile.name || "User"}
                </h1>
                <p className="text-gray-500 text-sm md:text-base">
                  {profile.email || "user@gmail.com"}
                </p>
                {profile.contact_number && (
                  <p className="mt-2 text-sm text-gray-600">
                    Contact: {profile.contact_number}
                  </p>
                )}
                {profile.location && (
                  <p className="text-sm text-gray-600">
                    Location: {profile.location}
                  </p>
                )}

                {/* Edit & Logout Buttons */}
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={handleEditProfile}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded shadow hover:bg-blue-700 transition"
                  >
                    <FaUserEdit className="mr-2" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm rounded shadow hover:bg-red-700 transition"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* 2x2 Grid Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Box 1: Status Info */}
              <div className="bg-gray-50 rounded-md shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Status Info
                </h2>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Status:</strong>{" "}
                    {profile.status || "Not Provided"}
                  </p>
                  <p>
                    <strong>Last Login:</strong>{" "}
                    {profile.last_login
                      ? new Date(profile.last_login).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Date Created:</strong>{" "}
                    {profile.date_created
                      ? new Date(profile.date_created).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Box 2: Bookings */}
              <div className="bg-gray-50 rounded-md shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Bookings
                </h2>
                {profile.bookings && profile.bookings.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {profile.bookings.map((b, idx) => (
                      <li key={idx}>{JSON.stringify(b)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No bookings found.</p>
                )}
              </div>

              {/* Box 3: Favorites */}
              <div className="bg-gray-50 rounded-md shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Favorites
                </h2>
                {profile.favorites && profile.favorites.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {profile.favorites.map((fav, idx) => (
                      <li key={idx}>{JSON.stringify(fav)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No favorites added.</p>
                )}
              </div>

              {/* Box 4: Reviews */}
              <div className="bg-gray-50 rounded-md shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Reviews
                </h2>
                {profile.reviews && profile.reviews.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {profile.reviews.map((rev, idx) => (
                      <li key={idx}>{JSON.stringify(rev)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No reviews found.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Loading profile...</p>
        )}

        {/* EDIT PROFILE MODAL */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                Edit Profile
              </h2>
              <form onSubmit={handleSaveChanges} className="space-y-4">
                {/* Profile Image Preview with upload icon */}
                <div
                  className="relative w-32 h-32 mx-auto cursor-pointer"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                >
                  <img
                    src={
                      updatedProfile.profile_image &&
                      updatedProfile.profile_image instanceof File
                        ? URL.createObjectURL(updatedProfile.profile_image)
                        : profile && profile.profile_image
                        ? getProfileImageUrl(profile.profile_image)
                        : "https://via.placeholder.com/150"
                    }
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full border-4 border-gray-200 object-cover shadow-sm"
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2">
                    <FaCamera className="text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="profile_image"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={updatedProfile.name}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={updatedProfile.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="contact_number"
                    value={updatedProfile.contact_number}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
};

export default Profile;
