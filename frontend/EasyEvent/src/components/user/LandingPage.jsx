import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import LandingImage from "../images/Landing.png"; // Replace with actual image
import BottomNavbar from "./BottomNavbar";

const LandingPage = () => {
  const navigate = useNavigate();
  const venueOwnerSectionRef = useRef(null);

  const scrollToVenueOwnerSection = () => {
    if (venueOwnerSectionRef.current) {
      venueOwnerSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-lg sticky top-0 z-50">
        <h1
          onClick={() => navigate("/")}
          className="text-3xl font-bold text-orange-600 hover:text-orange-700 transition duration-300 cursor-pointer"
        >
          EasyEvents
        </h1>
        <nav className="flex items-center space-x-6">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-2 bg-orange-600 text-white rounded-full shadow hover:bg-orange-700 transition"
          >
            Login
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-screen flex items-center justify-center text-center"
        style={{ backgroundImage: `url(${LandingImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-4xl text-white">
          <h1 className="text-5xl font-bold mb-4">
            Simplify Event Venue Booking
          </h1>
          <p className="text-xl mb-8">
            Discover the best venues for your events and celebrations.
          </p>
          <div className="flex justify-center space-x-6">
            <button
              onClick={scrollToVenueOwnerSection}
              className="px-8 py-3 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition"
            >
              List Your Venue
            </button>
            <button
              onClick={() => navigate("/user-dashboard-before")}
              className="px-8 py-3 bg-white text-orange-600 border-2 border-orange-600 rounded-full shadow hover:bg-orange-600 hover:text-white transition"
            >
              Explore Venues
            </button>
          </div>
        </div>
      </section>

      {/* User Features Section */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-4xl font-semibold text-orange-600 mb-8">
          For Event Planners
        </h2>
        <p className="text-lg text-gray-700 mb-12">
          Book the perfect venue for weddings, parties, or corporate events.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
          <div className="bg-gray-100 p-8 rounded-lg shadow hover:shadow-lg">
            <h3 className="text-xl font-bold text-orange-600 mb-4">
              Wide Range of Venues
            </h3>
            <p className="text-gray-600">
              From banquet halls to outdoor gardens.
            </p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg shadow hover:shadow-lg">
            <h3 className="text-xl font-bold text-orange-600 mb-4">
              Easy Bookings
            </h3>
            <p className="text-gray-600">Book venues with just a few clicks.</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg shadow hover:shadow-lg">
            <h3 className="text-xl font-bold text-orange-600 mb-4">
              Secure Payments
            </h3>
            <p className="text-gray-600">Safe and hassle-free transactions.</p>
          </div>
        </div>
      </section>

      {/* Venue Owner Features Section */}
      <section
        ref={venueOwnerSectionRef}
        className="py-20 bg-gray-50 text-center"
      >
        <h2 className="text-4xl font-semibold text-orange-600 mb-8">
          For Venue Owners
        </h2>
        <p className="text-lg text-gray-700 mb-12">
          List your venue and grow your business with EasyEvents.
        </p>
        <div className="flex justify-center space-x-6">
          <button
            onClick={() => navigate("/venue-owner-login")}
            className="px-6 py-3 bg-orange-600 text-white rounded-full shadow hover:bg-orange-700 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/venue-owner-signup")}
            className="px-6 py-3 bg-white text-orange-600 border-2 border-orange-600 rounded-full shadow hover:bg-orange-600 hover:text-white transition"
          >
            Signup
          </button>
        </div>
      </section>

      {/* Why Choose EasyEvents Section */}
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-4xl font-semibold text-orange-600 mb-8">
          Why Choose EasyEvents?
        </h2>
        <p className="text-lg text-gray-700 mb-12">
          A trusted platform connecting event planners with verified venues.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
          <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg">
            <h4 className="text-xl font-semibold text-orange-600 mb-4">
              Verified Venues
            </h4>
            <p>Trustworthy and reliable venue options.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg">
            <h4 className="text-xl font-semibold text-orange-600 mb-4">
              Seamless Experience
            </h4>
            <p>Smooth booking and payment processes.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg">
            <h4 className="text-xl font-semibold text-orange-600 mb-4">
              Customer Support
            </h4>
            <p>24/7 support for all your queries.</p>
          </div>
        </div>
      </section>
      <BottomNavbar/>
    </div>
  );
};

export default LandingPage;
