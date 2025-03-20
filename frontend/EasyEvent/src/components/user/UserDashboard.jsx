import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [venues, setVenues] = useState([]);

  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/venues", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        // Use an empty array as fallback if no venues are returned.
        setVenues(response.data.venues || []);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, [access_token]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Sorting Filters and Search Input */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex space-x-6">
            <select className="px-6 py-3 border rounded-lg">
              <option>Sort by Rating</option>
              <option>High to Low</option>
              <option>Low to High</option>
            </select>
            <select className="px-6 py-3 border rounded-lg">
              <option>Sort by Location</option>
              <option>Kathmandu</option>
              <option>Pokhara</option>
              <option>Jhapa</option>
            </select>
          </div>
        </div>

        {/* Venues Grid or No Venues Message */}
        {filteredVenues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredVenues.map((venue) => (
              <Link to={`/party-palace/${venue.id}`} key={venue.id}>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 cursor-pointer">
                  <img
                    src={
                      venue.profile_image
                        ? `http://localhost:8000/${venue.profile_image.replace(
                            /\\/g,
                            "/"
                          )}`
                        : "https://via.placeholder.com/300"
                    }
                    alt={venue.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {venue.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {venue.location.address}, {venue.location.city},{" "}
                      {venue.location.state} {venue.location.zip_code}
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      {venue.description}
                    </p>
                    <div>
                      {isNaN(parseFloat(venue.rating)) ? (
                        <p className="text-gray-500 text-sm">{venue.rating}</p>
                      ) : (
                        <div className="flex items-center">
                          {Array(Math.floor(parseFloat(venue.rating)))
                            .fill()
                            .map((_, index) => (
                              <span
                                key={index}
                                className="text-orange-500 text-xl"
                              >
                                ★
                              </span>
                            ))}
                          {parseFloat(venue.rating) % 1 !== 0 && (
                            <span className="text-orange-500 text-xl">☆</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <img
              src="https://via.placeholder.com/300x200?text=No+Venues+Available"
              alt="No venues available"
              className="w-60 h-40 mb-6"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Venues Available
            </h2>
            <p className="text-gray-600 mb-4">
              It seems we don't have any venues at the moment. Please check back
              later or explore other options.
            </p>
            <Link
              to="/"
              className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg shadow-md hover:bg-orange-700 transition duration-300"
            >
              Explore Other Options
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <BottomNavbar />
    </div>
  );
};

export default UserDashboard;
