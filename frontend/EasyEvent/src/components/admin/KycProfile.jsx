import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

const KycProfile = () => {
  const { kycId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For updating verification status
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  // For image modal viewing
  const [selectedImage, setSelectedImage] = useState(null);

  // console.log("profile",profile)
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    axios
      .get(`http://localhost:8000/api/kyc/profile/${kycId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.data) {
          setProfile(data.data);
        } else {
          setError(data.error || "Error fetching profile");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching profile");
        setLoading(false);
      });
  }, [kycId]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("access_token");
    setUpdateError(null);
    setUpdateSuccess(null);

    axios
      .put(
        "http://localhost:8000/api/kyc/verify",
        {
          kycId,
          status: updateStatus,
          message: updateStatus === "rejected" ? updateMessage : null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;
        if (data.error) {
          setUpdateError(data.error);
        } else {
          setUpdateSuccess(data.message);
          // Update profile locally for immediate feedback
          setProfile((prev) => ({
            ...prev,
            verificationStatus: updateStatus,
            rejectMsg: updateStatus === "rejected" ? updateMessage : null,
          }));
        }
      })
      .catch((err) => {
        setUpdateError("Error updating status");
      });
  };

  // Handler to open modal with the selected image URL
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Handler to close the modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Helper to prepend base URL if needed (adjust if your backend serves static files)
  const getImageUrl = (path) => {
    if (path && path.startsWith("http")) {
      return path;
    }
    return `http://localhost:8000/${path}`; // Adjust base URL as needed
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow ml-64 p-8 bg-gray-100 min-h-screen">
        {loading ? (
          <p className="text-gray-700">Loading profile...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-8">KYC Profile Details</h2>
            {/* Top Profile Section */}
            <div className="bg-white shadow-lg rounded-lg p-8 mb-8 flex flex-col md:flex-row items-center">
              <div className="w-40 h-40 flex-shrink-0 mb-4 md:mb-0 md:mr-8">
                {profile.profile && profile.profile.trim() !== "" ? (
                  <img
                    src={getImageUrl(profile.profile)}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full border cursor-pointer"
                    onClick={() => openImageModal(getImageUrl(profile.profile))}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full border">
                    <span className="text-gray-600">No Image</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">
                  {profile.venueOwnerName}
                </h3>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {profile.phoneNumber}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {profile.email}
                </p>
                <p className="mt-2">
                  <span
                    className={`px-3 py-1 inline-block text-sm font-semibold rounded-full ${
                      profile.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : profile.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {profile.status}
                  </span>
                  {profile.status === "rejected" && (
                    <span className="ml-4 text-red-600">
                      (Reason: {profile.rejectMsg})
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Venue Details and Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Venue Details</h3>
                <p>
                  <strong>Venue Name:</strong> {profile.venueName}
                </p>
                <p className="mt-2">
                  <strong>Address:</strong>{" "}
                  {`${profile.venueAddress.address}, ${profile.venueAddress.city}, ${profile.venueAddress.state}, ${profile.venueAddress.zip_code}`}
                </p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-sm">Citizenship Front:</p>
                    {profile.citizenshipFront !== "No file uploaded" ? (
                      <img
                        src={getImageUrl(profile.citizenshipFront)}
                        alt="Citizenship Front"
                        className="w-full h-32 object-cover rounded cursor-pointer"
                        onClick={() =>
                          openImageModal(getImageUrl(profile.citizenshipFront))
                        }
                      />
                    ) : (
                      <p className="text-xs text-gray-500">No file uploaded</p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Citizenship Back:</p>
                    {profile.citizenshipBack !== "No file uploaded" ? (
                      <img
                        src={getImageUrl(profile.citizenshipBack)}
                        alt="Citizenship Back"
                        className="w-full h-32 object-cover rounded cursor-pointer"
                        onClick={() =>
                          openImageModal(getImageUrl(profile.citizenshipBack))
                        }
                      />
                    ) : (
                      <p className="text-xs text-gray-500">No file uploaded</p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">PAN Document:</p>
                    {profile.pan !== "No file uploaded" ? (
                      <img
                        src={getImageUrl(profile.pan)}
                        alt="PAN Document"
                        className="w-full h-32 object-cover rounded cursor-pointer"
                        onClick={() => openImageModal(getImageUrl(profile.pan))}
                      />
                    ) : (
                      <p className="text-xs text-gray-500">No file uploaded</p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Map:</p>
                    {profile.map !== "No map file uploaded" ? (
                      <img
                        src={getImageUrl(profile.map)}
                        alt="Map"
                        className="w-full h-32 object-cover rounded cursor-pointer"
                        onClick={() => openImageModal(getImageUrl(profile.map))}
                      />
                    ) : (
                      <p className="text-xs text-gray-500">
                        No map file uploaded
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Signature:</p>
                    {profile.signature !== "No signature uploaded" ? (
                      <img
                        src={getImageUrl(profile.signature)}
                        alt="Signature"
                        className="w-full h-32 object-cover rounded cursor-pointer"
                        onClick={() =>
                          openImageModal(getImageUrl(profile.signature))
                        }
                      />
                    ) : (
                      <p className="text-xs text-gray-500">
                        No signature uploaded
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Venue Images:</p>
                    {profile.venueImages &&
                    Array.isArray(profile.venueImages) &&
                    profile.venueImages.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {profile.venueImages.map((imgUrl, index) => (
                          <img
                            key={index}
                            src={getImageUrl(imgUrl)}
                            alt={`Venue Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded cursor-pointer"
                            onClick={() => openImageModal(getImageUrl(imgUrl))}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">
                        No venue images uploaded
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Update Verification Section */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Update Verification Status
              </h3>
              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                {updateStatus === "rejected" && (
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Rejection Message
                    </label>
                    <textarea
                      value={updateMessage}
                      onChange={(e) => setUpdateMessage(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter rejection message"
                      required
                    />
                  </div>
                )}
                {updateError && (
                  <p className="text-red-600 mb-4">{updateError}</p>
                )}
                {updateSuccess && (
                  <p className="text-green-600 mb-4">{updateSuccess}</p>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Update Verification
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-screen rounded-lg shadow-xl"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-800 hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycProfile;
