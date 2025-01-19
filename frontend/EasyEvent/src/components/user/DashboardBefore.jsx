import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardBefore = () => {
  const navigate = useNavigate();

  const venues = [
    {
      id: 1,
      name: "Luxury Banquet Hall",
      location: "Jaipati, Kathmandu",
      image: "https://via.placeholder.com/300",
      rating: 5,
    },
    {
      id: 2,
      name: "Cozy Garden Venue",
      location: "Thamel, Kathmandu",
      image: "https://via.placeholder.com/300",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Bravo Venue",
      location: "Shiva Chowk, Pokhara",
      image: "https://via.placeholder.com/300",
      rating: 4,
    },
    {
      id: 4,
      name: "Charming Retreat Venue",
      location: "Chitwan",
      image: "https://via.placeholder.com/300",
      rating: 4.5,
    },
    {
      id: 5,
      name: "Grand Imperial Venue",
      location: "Bhaktapur",
      image: "https://via.placeholder.com/300",
      rating: 4,
    },
    {
      id: 6,
      name: "Elegant Garden Venue",
      location: "Lalitpur",
      image: "https://via.placeholder.com/300",
      rating: 5,
    },
    {
      id: 7,
      name: "Rustic Country Venue",
      location: "Banepa",
      image: "https://via.placeholder.com/300",
      rating: 4,
    },
    {
      id: 8,
      name: "Royal Heritage Venue",
      location: "Patan Durbar Square",
      image: "https://via.placeholder.com/300",
      rating: 4.5,
    },
    {
      id: 9,
      name: "Urban Rooftop Venue",
      location: "New Road, Kathmandu",
      image: "https://via.placeholder.com/300",
      rating: 5,
    },
    {
      id: 10,
      name: "Beachfront Venue",
      location: "Lakeside, Pokhara",
      image: "https://via.placeholder.com/300",
      rating: 4.5,
    },
    {
      id: 11,
      name: "Modern Conference Venue",
      location: "Gongabu, Kathmandu",
      image: "https://via.placeholder.com/300",
      rating: 4,
    },
    {
      id: 12,
      name: "Serene Forest Venue",
      location: "Godavari",
      image: "https://via.placeholder.com/300",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="pl-8  text-2xl font-bold text-orange-500 ">
            EasyEvents
          </div>

          {/* Search Bar */}
          <div className="hidden sm:block">
            <input
              type="text"
              placeholder="Search venues..."
              className="px-4 py-2 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-1 bg-orange-600 text-white text-lg font-medium rounded-3xl shadow-lg hover:bg-orange-700 transition duration-300"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/user-signup")}
              className="px-8 py-1 bg-transparent border-2 border-orange-600 text-orange-600 font-medium rounded-3xl shadow-md hover:bg-orange-600 hover:text-white transition duration-300"
            >
              Signup
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-16 py-14">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Trending Venues
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-60 object-cover"
                style={{ height: "300px", width: "300px" }}
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-700">
                  {venue.name}
                </h3>
                <p className="text-gray-600 text-sm">{venue.location}</p>
                <div className="flex items-center mt-2">
                  {[...Array(Math.floor(venue.rating))].map((_, index) => (
                    <span key={index} className="text-orange-500 text-xl">
                      ★
                    </span>
                  ))}
                  {venue.rating % 1 !== 0 && (
                    <span className="text-orange-500 text-xl">☆</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-orange-500 text-white py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Section */}
          <div>
            <h4 className="text-lg font-bold mb-3">About EasyEvents</h4>
            <p className="text-sm">
              EasyEvents is your one-stop solution for finding the perfect venue
              for your special occasions. Browse, book, and celebrate with ease.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="text-lg font-bold mb-3">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-bold mb-3">Contact Us</h4>
            <p className="text-sm">Email: contact@easyevents.com</p>
            <p className="text-sm">Phone: +977-123456789</p>
            <p className="text-sm">Location: Kathmandu, Nepal</p>
          </div>
        </div>
        <div className="text-center text-sm mt-6 border-t border-orange-300 pt-4">
          © 2025 EasyEvents. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default DashboardBefore;
