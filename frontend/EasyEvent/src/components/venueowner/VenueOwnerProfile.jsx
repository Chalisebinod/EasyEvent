import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import VenueSidebar from "./VenueSidebar";

const VenueOwnerProfile = () => {
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
    status: "",
    last_login: "",
    date_created: "",
  });

  // Sample reviews data for demonstration
  const dummyReviews = [
    { id: 1, name: "Ps", rating: 4, comment: "Babbal xa, long lasting, yo price ma, more worthy, fragrance pani dammi nam panyo...", date: "4 weeks ago" },
    { id: 2, name: "Nita L", rating: 4, comment: "Awesome", date: "4 weeks ago" },
    { id: 3, name: "Rahul M", rating: 5, comment: "Excellent venue for our corporate event. The staff was extremely professional and accommodating. Will definitely book again.", date: "2 weeks ago" },
    { id: 4, name: "Sarah J", rating: 5, comment: "Perfect location for our wedding reception. Everyone loved the ambiance and setup. Highly recommended!", date: "3 weeks ago" },
    { id: 5, name: "Michael T", rating: 4, comment: "Great place with amazing service. The only downside was limited parking, but everything else was perfect.", date: "1 month ago" },
    { id: 6, name: "Anita K", rating: 5, comment: "The venue exceeded our expectations. Beautiful decor, spacious, and the staff was incredibly helpful throughout the event.", date: "5 weeks ago" },
    { id: 7, name: "David W", rating: 3, comment: "Good venue but the sound system needs improvement. Everything else was satisfactory.", date: "1 month ago" },
    { id: 8, name: "Lisa R", rating: 5, comment: "We hosted our daughter's sweet sixteen here and it was simply perfect. Thank you for making her day special!", date: "6 weeks ago" },
    { id: 9, name: "Rohan P", rating: 4, comment: "Very professional team and beautiful venue. The only issue was with catering timing, but the management handled it well.", date: "2 months ago" },
    { id: 10, name: "Emma S", rating: 5, comment: "Absolutely stunning venue with top-notch amenities. Our guests couldn't stop talking about how beautiful everything was.", date: "7 weeks ago" },
    { id: 11, name: "John D", rating: 4, comment: "Great experience overall. The venue manager was very responsive and helped us plan everything perfectly.", date: "2 months ago" },
    { id: 12, name: "Priya M", rating: 5, comment: "Best venue in the city! Spacious, well-maintained, and the staff goes above and beyond to ensure everything runs smoothly.", date: "5 weeks ago" },
  ];

  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:8000/";

  // Helper function to convert a stored image path to a full URL
  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    if (typeof imagePath !== "string") return "https://via.placeholder.com/150";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}${imagePath.replace(/\\/g, "/")}`;
  };

  // Function to fetch profile data
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

  useEffect(() => {
    fetchProfile();
  }, [navigate, accessToken]);

  // Edit / Cancel
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Logout with confirmation
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  };

  // Handle Changes in Edit Mode
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

  // Save Changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(updatedProfile).forEach(([key, value]) => {
      if (key === "venue_images") {
        value.forEach((file) => formData.append("venue_images", file));
      } else if (value !== null && value !== undefined) {
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
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  // Star rating component for reusability
  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            } fill-current mr-1`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.561-.955L10 .5l2.95 5.455 6.561.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        <VenueSidebar />
        <div className="w-full flex items-center justify-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <VenueSidebar />
      {/* Content Area */}
      <div className="flex-1 p-4 md:p-8">
        {!isEditing ? (
          /* ---------- VIEW MODE ---------- */
          <div className="bg-white rounded-md shadow p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              {/* Profile Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={getProfileImageUrl(profile.profile_image)}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-orange-500"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile.name || "USER"}
                  </h2>
                  <p className="text-gray-600">{profile.email}</p>
                  <p className="text-gray-600">
                    Contact: {profile.contact_number || "N/A"}
                  </p>
                </div>
              </div>
              {/* Buttons */}
              <div className="mt-4 md:mt-0 flex space-x-2">
                <button
                  onClick={handleEditProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Info Boxes */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Info */}
              <div className="bg-gray-50 rounded shadow p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Status Info
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong>{" "}
                  {profile.status ? profile.status : "Active"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Last Login:</strong>{" "}
                  {profile.last_login ? profile.last_login : "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date Created:</strong>{" "}
                  {profile.date_created ? profile.date_created : "N/A"}
                </p>
              </div>

              {/* Bookings */}
              <div className="bg-gray-50 rounded shadow p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Bookings
                </h3>
                <p className="text-sm text-gray-600">No bookings found.</p>
              </div>
            </div>

            {/* ---------- CUSTOMER REVIEWS SECTION ---------- */}
            <div className="mt-6 bg-gray-50 rounded shadow p-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Customer Reviews
              </h3>

              {/* Overall Rating */}
              <div className="flex items-center mb-4">
                <span className="text-3xl font-semibold mr-2">4.8</span>
                {/* Star Icons - Example of 4.8/5 */}
                <div className="flex">
                  <svg
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.561-.955L10 .5l2.95 5.455 6.561.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <svg
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.561-.955L10 .5l2.95 5.455 6.561.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <svg
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.561-.955L10 .5l2.95 5.455 6.561.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <svg
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.561-.955L10 .5l2.95 5.455 6.561.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <svg
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.561-.955L10 .5l2.95 5.455 6.561.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </div>
                <span className="text-gray-600 ml-2">({dummyReviews.length} Ratings)</span>
              </div>

              {/* Enhanced Scrollable Review List */}
              <div className="border rounded-lg overflow-hidden shadow-inner bg-white">
                <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {dummyReviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="border-b last:border-b-0 p-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">{review.name}</span>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review navigation/pagination */}
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing all {dummyReviews.length} reviews
                </div>
            
              </div>
            </div>
            {/* Add custom scrollbar styles */}
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #c5c5c5;
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #a0a0a0;
              }
            `}</style>
          </div>
        ) : (
        
          <div className="bg-white rounded-md shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSaveChanges} className="space-y-4">
              {/* Basic Info */}
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

              {/* Additional Info */}
              <div>
                <label className="block text-gray-700">Short Bio</label>
                <textarea
                  name="short_description"
                  value={updatedProfile.short_description}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Profile Image */}
              <div>
                <label className="block text-gray-700">Profile Image</label>
                <input
                  type="file"
                  name="profile_image"
                  onChange={handleImageChange}
                  className="w-full p-2 rounded"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueOwnerProfile;