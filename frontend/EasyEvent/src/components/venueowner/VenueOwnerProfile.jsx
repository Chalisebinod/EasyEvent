import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import VenueSidebar from "./VenueSideBar";

const VenueOwnerProfile = () => {
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8000/api/venueOwner/profile",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1">
        {/* Sidebar */}
        <VenueSidebar />

        {/* Profile Content */}
        <div className="flex flex-col w-full md:w-3/4 p-6 bg-white shadow-lg rounded-lg mx-auto">
          {profile ? (
            isEditing ? (
              <form onSubmit={handleSaveChanges} className="space-y-4">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={updatedProfile.name}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={updatedProfile.email}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={updatedProfile.contact_number}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Profile Image</label>
                  <input
                    type="file"
                    name="profile_image"
                    onChange={handleImageChange}
                    className="w-full p-2 rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <div className="flex flex-col md:flex-row items-center">
                  <img
                    src={
                      profile.profile_image || "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-orange-500"
                  />
                  <div className="ml-6 mt-4 md:mt-0">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {profile.name}
                    </h2>
                    <p className="text-gray-500">{profile.email}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-gray-700">
                    <strong>Phone:</strong>{" "}
                    {profile.contact_number || "Not provided"}
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
  );
};

export default VenueOwnerProfile;
