import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-pink-100 min-h-screen">
      {/* Header Section */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Company Name */}
          <div className="text-2xl font-bold text-orange-500">
            EASY<span className="text-orange-500">EVENTS</span>
          </div>
          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-500 px-2 py-1">
              HOME
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-500 px-2 py-1">
              Explore Venues
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-500 px-2 py-1">
              Bookings
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-500 px-2 py-1">
              Proposal
            </a>
          </nav>
          {/* Profile Image */}
          <div className="flex items-center">
            <img
              src="https://via.placeholder.com/40" // Replace with actual profile image URL
              alt="User Profile"
              className="h-10 w-10 rounded-full border border-gray-300"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {/* Our Mission Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-orange-500">
            Our Mission
          </h2>
          <p className="text-lg mb-8">
            Simplifying event planning by connecting people with the perfect
            venues and services. We aim to make the process secure, efficient,
            and enjoyable for everyone.
          </p>
          <div className="flex justify-center">
            <img
              src="image1.jpg" // Replace with actual image path
              alt="Event Venue 1"
              className="rounded-lg shadow-md w-full md:w-1/2"
            />
          </div>
        </section>

        {/* Our Story Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-orange-500">Our Story</h2>
          <p className="text-lg mb-8">
            Our journey began with the realization that event planning is often
            stressful and inefficient. We created the Event-Venue Booking System
            to change that. By leveraging technology, we provide a seamless
            platform where users can search, book, and manage venues with ease.
          </p>
          <div className="flex justify-center">
            <img
              src="image2.jpg" // Replace with actual image path
              alt="Event Venue 2"
              className="rounded-lg shadow-md w-full md:w-1/2"
            />
          </div>
        </section>

        {/* What We Offer and By the Numbers */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-orange-500">
              What We Offer
            </h2>
            <ul className="list-disc list-inside text-lg">
              <li>Verified Venue Details</li>
              <li>Secure Transactions</li>
              <li>Real-Time Messaging</li>
              <li>Customized Solutions</li>
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 text-orange-500">
              By the Numbers
            </h2>
            <ul className="list-disc list-inside text-lg">
              <li>1000+ Venues Listed</li>
              <li>500+ Events Booked Monthly</li>
              <li>95% Customer Satisfaction</li>
            </ul>
          </div>
        </section>

        {/* Contact Us Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4 text-orange-500">
            Contact Us
          </h2>
          <p className="text-lg mb-4">
            Have questions or need assistance? Reach out to us at:
          </p>
          <ul className="text-lg">
            <li>
              Email:{" "}
              <a
                href="mailto:chalisebinod40@gmail.com"
                className="text-orange-500"
              >
                chalisebinod40@gmail.com
              </a>
            </li>
            <li>Phone: +977-9863335796</li>
            <li>Address: Kathmandu, Nepal</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
