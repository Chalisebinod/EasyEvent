import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import VenueSidebar from "./VenueSideBar";
import { toast, ToastContainer } from "react-toastify";



const VenueProfile = () => {

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // For image preview modal
  const [previewImage, setPreviewImage] = useState(null);

  // Edit mode states
  const [editDescription, setEditDescription] = useState("");
  const [editPaymentPolicy, setEditPaymentPolicy] = useState({
    advance_percentage: "",
    security_deposit: "",
    refund_policy: "",
    cancellation_penalty: "",
  });
  // For new file uploads (if any)
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newProfileImagePreview, setNewProfileImagePreview] = useState(null);
  const [newImages, setNewImages] = useState([]); // Array of File objects
  const [newImagesPreviews, setNewImagesPreviews] = useState([]); // Array of preview URLs

  // Refs for file inputs in edit mode
  const profileImageInputRef = useRef(null);
  const galleryImagesInputRef = useRef(null);

  // Helper function to get the full URL for images
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `http://localhost:8000/${path}`;
  };

  useEffect(() => {
    const fetchVenueProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        // Using the venue-profile API to fetch details
        const response = await axios.get(
          "http://localhost:8000/api/venue-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // If a venue exists, update state; otherwise, set the error message.
        if (response.data && response.data.venue) {
          localStorage.setItem("venueID", response.data.venue._id)
          setVenue(response.data.venue);
        } else if (response.data && response.data.message) {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueProfile();
  }, []);

  // When entering edit mode, pre-fill the edit fields
  useEffect(() => {
    if (venue && isEditing) {
      setEditDescription(venue.description || "");
      setEditPaymentPolicy({
        advance_percentage: venue.payment_policy?.advance_percentage || "",
        security_deposit: venue.payment_policy?.security_deposit || "",
        refund_policy: venue.payment_policy?.refund_policy || "",
        cancellation_penalty: venue.payment_policy?.cancellation_penalty || "",
      });
      // Clear any previous file selections
      setNewProfileImage(null);
      setNewProfileImagePreview(null);
      setNewImages([]);
      setNewImagesPreviews([]);
    }
  }, [venue, isEditing]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(file);
      setNewProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newImages.length > 5) {
      alert("You can upload a maximum of 5 images for the gallery.");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewImagesPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Function to remove a new image from the list (both File and preview)
  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // Prepare form data for PATCH request
    const formData = new FormData();
    if (newProfileImage) {
      formData.append("profile_image", newProfileImage);
    }
    if (newImages.length > 0) {
      newImages.forEach((file) => formData.append("images", file));
    }
    // Append payment_policy as a JSON string
    formData.append("payment_policy", JSON.stringify(editPaymentPolicy));
    formData.append("description", editDescription);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.patch(
        `http://localhost:8000/api/venue/${venue._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Let the browser set the correct Content-Type with boundary.
          },
        }
      );
      if (response.status === 200) {
        toast.success("Venue details updated successfully");
        setVenue(response.data.venue);
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally clear file previews
    setNewProfileImage(null);
    setNewProfileImagePreview(null);
    setNewImages([]);
    setNewImagesPreviews([]);
  };

  return (
    <div className="min-h-screen flex">
      <ToastContainer />
      <VenueSidebar />
      <div className="flex-grow p-6 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center">
            <p className="text-xl text-gray-600">Loading Venue Profile...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center">
            <p className="text-xl text-red-600">Error: {error}</p>
          </div>
        ) : (
          <>
            {/* Edit mode toggle button */}
            <div className="flex justify-end mb-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="mr-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Banner Section */}
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg mb-8">
              {isEditing ? (
                <div className="relative h-full">
                  {newProfileImagePreview || venue.profile_image ? (
                    <img
                      src={
                        newProfileImagePreview ||
                        getImageUrl(venue.profile_image)
                      }
                      alt={venue.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() =>
                        setPreviewImage(
                          newProfileImagePreview ||
                            getImageUrl(venue.profile_image)
                        )
                      }
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-700">No Profile Image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={profileImageInputRef}
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                  <button
                    onClick={() => profileImageInputRef.current.click()}
                    className="absolute top-4 right-4 bg-white px-3 py-1 rounded shadow z-20"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  {venue.profile_image ? (
                    <img
                      src={getImageUrl(venue.profile_image)}
                      alt={venue.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() =>
                        setPreviewImage(getImageUrl(venue.profile_image))
                      }
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-700">No Profile Image</span>
                    </div>
                  )}
                </>
              )}
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-bold">{venue.name}</h1>
                <p className="text-lg">
                  {venue.location.address}, {venue.location.city}
                </p>
              </div>
            </div>

            {/* About Section / Description */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold mb-4">About Venue</h2>
              {isEditing ? (
                <textarea
                  className="w-full p-2 border rounded"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="4"
                />
              ) : (
                <p className="text-gray-700">{venue.description}</p>
              )}
            </div>

            {/* Location & Contact and Payment Policy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Location & Contact */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Location & Contact
                </h2>
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p>
                    {venue.location.address}, {venue.location.city},{" "}
                    {venue.location.state} - {venue.location.zip_code}
                  </p>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium">Contact Details</h3>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {venue.contact_details.phone}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {venue.contact_details.email}
                  </p>
                  {venue.contact_details.whatsapp && (
                    <p>
                      <span className="font-semibold">WhatsApp:</span>{" "}
                      {venue.contact_details.whatsapp}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Policy */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Payment Policy</h2>
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <label className="font-medium block">
                        Advance Percentage:
                      </label>
                      <input
                        type="number"
                        value={editPaymentPolicy.advance_percentage}
                        onChange={(e) =>
                          setEditPaymentPolicy((prev) => ({
                            ...prev,
                            advance_percentage: e.target.value,
                          }))
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="font-medium block">
                        Security Deposit:
                      </label>
                      <input
                        type="number"
                        value={editPaymentPolicy.security_deposit}
                        onChange={(e) =>
                          setEditPaymentPolicy((prev) => ({
                            ...prev,
                            security_deposit: e.target.value,
                          }))
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="font-medium block">
                        Refund Policy:
                      </label>
                      <input
                        type="text"
                        value={editPaymentPolicy.refund_policy}
                        onChange={(e) =>
                          setEditPaymentPolicy((prev) => ({
                            ...prev,
                            refund_policy: e.target.value,
                          }))
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="font-medium block">
                        Cancellation Penalty:
                      </label>
                      <input
                        type="text"
                        value={editPaymentPolicy.cancellation_penalty}
                        onChange={(e) =>
                          setEditPaymentPolicy((prev) => ({
                            ...prev,
                            cancellation_penalty: e.target.value,
                          }))
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p>
                      <span className="font-semibold">Advance Percentage:</span>{" "}
                      {venue.payment_policy.advance_percentage}%
                    </p>
                    <p>
                      <span className="font-semibold">Security Deposit:</span>{" "}
                      {venue.payment_policy.security_deposit}
                    </p>
                    <p>
                      <span className="font-semibold">Refund Policy:</span>{" "}
                      {venue.payment_policy.refund_policy}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Cancellation Penalty:
                      </span>{" "}
                      {venue.payment_policy.cancellation_penalty}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Gallery Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">Gallery</h2>
              {isEditing && (
                <div className="mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={galleryImagesInputRef}
                    className="hidden"
                    onChange={handleGalleryImagesChange}
                  />
                  <button
                    onClick={() => galleryImagesInputRef.current.click()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Add Images
                  </button>
                </div>
              )}
              {venue.images && venue.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {venue.images.map((img, index) => (
                    <img
                      key={index}
                      src={getImageUrl(img)}
                      alt={`Venue Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md cursor-pointer"
                      onClick={() => setPreviewImage(getImageUrl(img))}
                    />
                  ))}
                </div>
              )}
              {/* Also show any new images selected in edit mode with a cancel button */}
              {isEditing && newImagesPreviews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {newImagesPreviews.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`New Venue Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-md cursor-pointer"
                        onClick={() => setPreviewImage(img)}
                      />
                      <button
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {!venue.images?.length && !isEditing && (
                <p className="text-gray-700">No additional images available.</p>
              )}
            </div>

            {/* (Other sections such as Event Pricing, Additional Services, Reviews remain unchanged) */}
          </>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-screen"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueProfile;
