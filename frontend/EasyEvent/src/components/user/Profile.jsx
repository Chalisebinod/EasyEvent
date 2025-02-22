import React, { useState, useEffect } from "react";
import { FaUserEdit, FaKey, FaCreditCard, FaSignOutAlt, FaTrash } from "react-icons/fa";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    email: "",
    contact_number: "",
    profile_image: null,
  });
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

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
        setUpdatedProfile({
          name: response.data.name,
          email: response.data.email,
          contact_number: response.data.contact_number,
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
  }, [navigate]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setUpdatedProfile((prevState) => ({
      ...prevState,
      profile_image: e.target.files[0],
    }));
  };

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
      await axios.put("http://localhost:8000/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setProfile((prevState) => ({
        ...prevState,
        ...updatedProfile,
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <Navbar />

      
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-stone-900 pt-8">My Profile</h1>
          <p className="text-stone-900 mt-2 pt-6 pb-16">Manage your account & settings</p>
        </div>
     

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Options (Sidebar) */}
          <div className="bg-white shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Profile Options
            </h2>
            <div className="flex flex-col space-y-4">
              <button
                className="flex items-center justify-center space-x-2 text-lg text-white bg-gray-600 hover:bg-teal-700 py-2 px-4 rounded-lg shadow-md transition duration-300"
                onClick={handleEditProfile}
              >
                <FaUserEdit />
                <span>Edit Profile</span>
              </button>
              <button
                className="flex items-center justify-center space-x-2 text-lg text-white bg-gray-600 hover:bg-teal-700 py-2 px-4 rounded-lg shadow-md transition duration-300"
                onClick={() => navigate("/change-password")}
              >
                <FaKey />
                <span>Change Password</span>
              </button>
              <button
                className="flex items-center justify-center space-x-2 text-lg text-white bg-gray-600 hover:bg-teal-700 py-2 px-4 rounded-lg shadow-md transition duration-300"
                onClick={() => navigate("/payment-details")}
              >
                <FaCreditCard />
                <span>Payment Details</span>
              </button>
              <button
                className="flex items-center justify-center space-x-2 text-lg text-white bg-gray-600 hover:bg-teal-700 py-2 px-4 rounded-lg shadow-md transition duration-300"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
              <button
                className="flex items-center justify-center space-x-2 text-lg text-white bg-gray-600 hover:bg-teal-700 py-2 px-4 rounded-lg shadow-md transition duration-300"
                onClick={() => navigate("/delete-account")}
              >
                <FaTrash />
                <span>Delete Account</span>
              </button>
            </div>
          </div>

          {/* Profile Details / Edit Form */}
          <div className="col-span-2 bg-white shadow-xl rounded-lg p-8">
            {profile ? (
              isEditing ? (
                <form onSubmit={handleSaveChanges} className="space-y-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={updatedProfile.name}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-teal-600 transition duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={updatedProfile.email}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-teal-600 transition duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="contact_number"
                      value={updatedProfile.contact_number}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-teal-600 transition duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      name="profile_image"
                      onChange={handleImageChange}
                      className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-teal-600 transition duration-300"
                    />
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-teal-600 text-white rounded-md shadow-md hover:bg-teal-700 transition duration-300"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md shadow-md hover:bg-gray-400 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <img
                      src={
                        profile.profile_image ||
                        "https://via.placeholder.com/150"
                      }
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-teal-600 object-cover"
                    />
                    <div>
                      <h2 className="text-3xl font-semibold text-gray-800">
                        {profile.name}
                      </h2>
                      <p className="text-lg text-gray-600">{profile.email}</p>
                    </div>
                  </div>
                  <div className="text-lg text-gray-600 space-y-2">
                    <p>
                      <strong>Phone:</strong>{" "}
                      {profile.contact_number || "Not provided"}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {profile.location || "Not provided"}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
};

export default Profile;
