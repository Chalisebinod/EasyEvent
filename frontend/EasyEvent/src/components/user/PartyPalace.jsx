// PartyPalace.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle, FaComments, FaCheckCircle } from "react-icons/fa";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";
import ChatWidget from "./chat/ChatWidget";
import { MdVerified } from "react-icons/md";
const ProfileIcon = ({ ownerId }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/owner-profile/${ownerId}`);
  };
  return (
    <div
      onClick={handleClick}
      className="absolute top-4 right-4 cursor-pointer text-white"
      title="View Owner Profile"
    >
      <FaUserCircle size={32} />
    </div>
  );
};

const PartyPalace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedHall, setSelectedHall] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [pricePerPlate, setPricePerPlate] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [userOfferedFee, setUserOfferedFee] = useState(0);
  const [totalFare, setTotalFare] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);


  // Helper function to build full URL for an image path
  const getImageUrl = (imgPath) =>
    `http://localhost:8000/${imgPath.replace(/\\/g, "/")}`;

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/venues/${id}`);
        const data = await response.json();
        setVenue(data.venue);
        if (data.venue.price_per_plate) {
          setPricePerPlate(data.venue.price_per_plate);
        }
      } catch (err) {
        setError("Failed to fetch venue details");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  useEffect(() => {
    if (guestCount && pricePerPlate) {
      setTotalFare(guestCount * pricePerPlate);
    }
  }, [guestCount, pricePerPlate]);

  const handleGuestCountChange = (e) => {
    const value = e.target.value;
    if (value >= 1) {
      setGuestCount(value);
    }
  };

  const openChat = () => {
    setChatOpen(true);
    setIsMinimized(false);
  };

  const closeChat = () => {
    setChatOpen(false);
  };

  // Pass owner _id as partnerId for the booking flow
  const handleBookNow = () => {
    navigate(`/user-book/${id}`, { state: { partnerId: venue.owner?._id } });
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!venue)
    return <div className="text-center p-10">No venue details available.</div>;

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[75vh] w-full">
        <img
          src={
            venue.profile_image
              ? getImageUrl(venue.profile_image)
              : "https://via.placeholder.com/1200x400"
          }
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg flex items-center gap-2">
            {venue.name}
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mt-4">
            A premier venue for unforgettable events
          </p>
        </div>
        
      </section>

      {/* Tabs Section with Book Now Button */}
      <section className="max-w-7xl mx-auto my-8 px-4">
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
              activeTab === "overview"
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("completed-events")}
            className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
              activeTab === "completed-events"
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Completed Events
          </button>
          <button
            onClick={handleBookNow}
            className="animated-stroke relative px-6 py-2 rounded-full font-medium transition duration-300 bg-gray-200 text-white hover:bg-gray-300"
          >
            Book Now
          </button>
        </div>

        {/* Content Section */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
            {/* Top Row: Venue Name and Owner Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {venue.name}
                </h2>
                <p className="text-gray-600 mt-2">
                  A premier venue for unforgettable events
                </p>
              </div>
              <div className="mt-4 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <img
                    src={
                      venue.owner?.profile_image
                        ? getImageUrl(venue.owner.profile_image)
                        : "https://via.placeholder.com/80"
                    }
                    alt="Owner Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <p className="mt-2 text-lg font-semibold text-gray-800 flex items-center gap-1">
                  {venue.owner?.name || "N/A"}
                  {venue.verification_status === "Verified" && (
                    <MdVerified
                      className="text-blue-500"
                      title="Verified User"
                      size={20}
                    />
                  )}
                </p>
                {venue.owner?.email && (
                  <p className="mt-1 text-gray-600">{venue.owner.email}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Description
              </h3>
              <p className="text-gray-700">{venue.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Features
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {venue.features &&
                  venue.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
              </ul>
            </div>

            {/* Three-Column Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl shadow">
                <h4 className="text-xl font-bold mb-2">Halls Info</h4>
                <p>No. of halls: {venue.halls?.number || "N/A"}</p>
                <p>
                  Capacities:{" "}
                  {venue.halls?.capacities
                    ? venue.halls.capacities.join(" & ")
                    : "N/A"}
                </p>
                <p className="mt-2">Food: {venue.halls?.food_type || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow">
                <h4 className="text-xl font-bold mb-2">Payment Policy</h4>
                <p>Advance: {venue.payment_policy.advance_percentage}%</p>
                <p>Security Deposit: {venue.payment_policy.security_deposit}</p>
                <p>Refund: {venue.payment_policy.refund_policy}</p>
                <p>Cancellation: {venue.payment_policy.cancellation_penalty}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow">
                <h4 className="text-xl font-bold mb-2">Contact Details</h4>
                <p>Phone: {venue.contact_details.phone}</p>
                <p>Email: {venue.contact_details.email}</p>

                <p className="mt-2 font-semibold">
                  Location: {venue.location.address}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "completed-events" && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Completed Events
            </h2>
            {mockCompletedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCompletedEvents.map((event, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        {event.name}
                      </h3>
                      <p className="text-gray-600 mt-2">
                        {event.short_description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No completed events available.</p>
            )}
          </div>
        )}
      </section>

      {/* Messaging Feature */}
      {!chatOpen && (
        <div
          className="fixed bottom-20 right-6 bg-orange-500 p-4 rounded-full cursor-pointer text-white shadow-2xl hover:scale-110 transition transform duration-300"
          onClick={openChat}
          title="Chat with Venue Owner"
        >
          <FaComments size={28} />
        </div>
      )}
      {chatOpen && (
        <ChatWidget partnerId={venue.owner?._id} onClose={closeChat} />
      )}

      <BottomNavbar />
    </div>
  );
};

export default PartyPalace;
