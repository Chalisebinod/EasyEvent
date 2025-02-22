import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEnvelope,
  FaUtensils,
  FaCalendarAlt,
  FaUserTie,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";
import VenueSidebar from "./VenueSidebar";

function EventDetails() {
  // Extract the booking request ID from the URL
  const { id: requestId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "approve" or "reject"
  const [reason, setReason] = useState(""); // approval message or rejection reason
  const [actionLoading, setActionLoading] = useState(false);

  // Toast states
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/booking/requests/profile/${requestId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (response.data.booking) {
          setBooking(response.data.booking);
        } else {
          console.error("No booking details found");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [requestId, accessToken]);

  // Show toast when booking status changes from "Pending"
  useEffect(() => {
    if (booking && booking.status !== "Pending") {
      setShowAlert(true);
      setAlertMessage(`Booking status updated to "${booking.status}"!`);

      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [booking]);

  // Update booking status (Accept or Reject)
  const handleStatusUpdate = async (status, reasonText = "") => {
    try {
      const payload = { status, reason: reasonText };
      const response = await axios.patch(
        `http://localhost:8000/api/booking/requests/${requestId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.data.booking) {
        setBooking(response.data.booking);
      } else {
        alert("Failed to update booking status.");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Error updating booking status.");
    }
  };

  // Handle approve/reject button click
  const handleActionClick = (type) => {
    setModalType(type);
    // Provide a default approval message
    if (type === "approve") {
      setReason("Your request has been approved. Looking forward to hosting you!");
    } else {
      setReason("");
    }
    setShowModal(true);
  };

  // Confirm the action in modal
  const handleConfirmAction = async () => {
    if (modalType === "reject" && reason.trim() === "") {
      alert("Please provide a reason for rejection.");
      return;
    }
    setActionLoading(true);

    // "approve" => "Accepted", "reject" => "Rejected"
    const newStatus = modalType === "approve" ? "Accepted" : "Rejected";
    await handleStatusUpdate(newStatus, reason);

    setActionLoading(false);
    setShowModal(false);
    setReason("");
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading event details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center mt-10 text-gray-600">
        No booking details found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <VenueSidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 relative">
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 bg-white shadow border-b border-gray-200 px-8 py-5">
          <h1 className="text-3xl font-extrabold text-gray-800">Booking Details</h1>
        </header>

        {/* Background gradient & page container */}
        <main className="py-10 px-8 bg-gradient-to-b from-white to-gray-100 min-h-screen">
          {/* Toast (top-right corner) */}
          {showAlert && (
            <div className="fixed top-4 right-4 z-50">
              <div className="flex items-center p-4 border-l-4 border-green-500 bg-green-50 rounded-md shadow-lg">
                <div className="mr-3">
                  <svg
                    className="h-6 w-6 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-green-800 font-semibold">{alertMessage}</p>
                  <p className="text-green-700 text-sm">
                    An email has been sent to{" "}
                    <span className="font-semibold">
                      {booking.user?.email || "the user"}
                    </span>
                    . Thank you for using EasyEvent!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 transform transition duration-200 hover:scale-[1.01]">
            {/* User Info */}
            <div className="flex items-center gap-5 mb-8 border-b pb-4">
              <img
                src="https://via.placeholder.com/80"
                alt="User Profile"
                className="w-20 h-20 rounded-full border-2 border-gray-300 shadow-sm"
              />
              <div>
                {booking.user ? (
                  <>
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {booking.user.name}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <FaEnvelope className="text-blue-500" />
                      {booking.user.email}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">User information not available.</p>
                )}
              </div>
            </div>

            {/* Grid for Event, Venue, Pricing, Services, etc. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Information */}
              <div className="p-5 border rounded-lg shadow-md bg-gray-50">
                <h4 className="font-semibold text-lg text-gray-700 mb-2">
                  Event Information
                </h4>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaUserTie className="text-green-500" />
                  {booking.event_details.event_type}
                </p>
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <FaCalendarAlt className="text-indigo-500" />
                  {new Date(booking.event_details.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <FaUtensils className="text-red-500" />
                  Guests: {booking.event_details.guest_count}
                </p>
              </div>

              {/* Venue & Hall */}
              <div className="p-5 border rounded-lg shadow-md bg-gray-50">
                <h4 className="font-semibold text-lg text-gray-700 mb-2">
                  Venue & Hall
                </h4>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-pink-500" />
                  {booking.venue.name} - {booking.venue.location.address},{" "}
                  {booking.venue.location.city}
                </p>
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <FaBuilding className="text-purple-500" />
                  {booking.hall.name} (Capacity: {booking.hall.capacity})
                </p>
              </div>

              {/* Pricing Details */}
              <div className="p-5 border rounded-lg shadow-md bg-gray-50">
                <h4 className="font-semibold text-lg text-gray-700 mb-2">
                  Pricing Details
                </h4>
                <p className="text-gray-600">
                  <span className="font-medium">Original per plate:</span> ₹
                  {booking.pricing.original_per_plate_price}
                </p>
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">User offered per plate:</span> ₹
                  {booking.pricing.user_offered_per_plate_price}
                </p>
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">Final per plate:</span> ₹
                  {booking.pricing.final_per_plate_price}
                </p>
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">Total cost:</span> ₹
                  {booking.pricing.total_cost}
                </p>
              </div>

              {/* Additional Services */}
              <div className="p-5 border rounded-lg shadow-md bg-gray-50">
                <h4 className="font-semibold text-lg text-gray-700 mb-2">
                  Additional Services
                </h4>
                {booking.additional_services.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {booking.additional_services.map((service) => (
                      <li key={service._id} className="text-gray-600">
                        <span className="font-medium">{service.name}:</span>{" "}
                        {service.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No additional services selected.</p>
                )}
              </div>

              {/* Cancellation Policy */}
              <div className="p-5 border rounded-lg shadow-md bg-gray-50">
                <h4 className="font-semibold text-lg text-gray-700 mb-2">
                  Cancellation Policy
                </h4>
                <p className="text-gray-600">
                  Cancellation Fee: ₹
                  {booking.cancellation_policy.cancellation_fee}
                </p>
              </div>
            </div>

            {/* Payment and Current Status */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center border-t pt-4">
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">Payment Status:</span>{" "}
                  {booking.payment_status}
                </p>
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">Booking Status:</span>{" "}
                  {booking.status}
                </p>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                {booking.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleActionClick("approve")}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleActionClick("reject")}
                      className="border border-red-500 text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition shadow-md"
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
              <h3 className="text-xl font-bold mb-4">
                {modalType === "approve" ? "Confirm Approval" : "Confirm Decline"}
              </h3>
              {modalType === "reject" ? (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Reason for Rejection:
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows="3"
                    placeholder="Enter reason here..."
                  ></textarea>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Approval Message:
                  </label>
                  <p>{reason}</p>
                </div>
              )}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={actionLoading}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {actionLoading ? "Loading..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;
