import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import VenueSidebar from "./VenueSideBar";

const VenueProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    email: "",
    contact_number: "",
    profile_image: null,
    short_description: "",
    history: "",
    capacity: "",
    amenities: "",
    venue_images: [],
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
          ...response.data,
          profile_image: null,
          venue_images: [],
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

  const handleVenueImagesChange = (e) => {
    setUpdatedProfile((prevState) => ({
      ...prevState,
      venue_images: Array.from(e.target.files),
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(updatedProfile).forEach(([key, value]) => {
      if (key === "venue_images") {
        value.forEach((file) => formData.append("venue_images", file));
      } else if (value) {
        formData.append(key, value);
      }
    });

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
    <div className="min-h-screen flex bg-gray-100">
      <VenueSidebar />
      <div className="w-full md:w-3/4 p-6 bg-white shadow-lg rounded-lg mx-auto">
        {profile ? (
          isEditing ? (
            <form onSubmit={handleSaveChanges} className="space-y-4">
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone Number", name: "contact_number", type: "text" },
                {
                  label: "Short Description",
                  name: "short_description",
                  type: "text",
                },
                { label: "History", name: "history", type: "text" },
                { label: "Capacity", name: "capacity", type: "number" },
                { label: "Amenities", name: "amenities", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-gray-700">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={updatedProfile[name]}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-700">Profile Image</label>
                <input
                  type="file"
                  name="profile_image"
                  onChange={handleImageChange}
                  className="w-full p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Venue Images</label>
                <input
                  type="file"
                  multiple
                  name="venue_images"
                  onChange={handleVenueImagesChange}
                  className="w-full p-2 rounded"
                />
              </div>
              <div className="flex space-x-4">
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
              </div>
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
                  <p className="text-gray-700">{profile.short_description}</p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <p>
                  <strong>Phone:</strong>{" "}
                  {profile.contact_number || "Not provided"}
                </p>
                <p>
                  <strong>History:</strong> {profile.history}
                </p>
                <p>
                  <strong>Capacity:</strong> {profile.capacity}
                </p>
                <p>
                  <strong>Amenities:</strong> {profile.amenities}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.venue_images?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Venue ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
              <button
                onClick={handleEditProfile}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition"
              >
                Edit Profile
              </button>
            </div>
          )
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default VenueProfile;
