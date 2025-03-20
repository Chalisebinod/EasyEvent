import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "./BottomNavbar";

const DashboardBefore = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [venues, setVenues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch venues from the API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/venues");
        if (!response.ok) {
          console.error("Error fetching venues:", response.statusText);
          setVenues([]); // Fallback to an empty array if the response is not OK
          return;
        }
        const data = await response.json();
        setVenues(data.venues || []); // Ensure venues is an array
      } catch (error) {
        console.error("Error fetching venues:", error);
        setVenues([]); // Fallback to an empty array if there's an error
      }
    };
    fetchVenues();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal handlers
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Clickable Logo */}
          <div
            onClick={() => navigate("/")}
            className="pl-8 text-2xl font-bold text-orange-500 cursor-pointer hover:underline transition-colors duration-200"
          >
            EasyEvents
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
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-6 py-12">
          {filteredVenues.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <img
                src="https://via.placeholder.com/300x200?text=No+Venues+Available"
                alt="No venues"
                className="w-60 h-40 mb-6"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Venues Available
              </h2>
              <p className="text-gray-600 mb-4">
                Sorry, there are no venues listed at the moment. Please check back later.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg shadow-md hover:bg-orange-700 transition duration-300"
              >
                Explore Other Options
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredVenues.map((venue) => (
                <div
                  key={venue.id}
                  onClick={openModal}
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 cursor-pointer"
                >
                  <img
                    src={
                      venue.profile_image
                        ? `http://localhost:8000/${venue.profile_image.replace(/\\/g, "/")}`
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
                              <span key={index} className="text-orange-500 text-xl">
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
              ))}
            </div>
          )}
        </main>
        <BottomNavbar />
      </div>

      {/* Modal for Unauthenticated Users */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dimmed & Blurred Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="relative z-10 bg-white p-8 rounded-lg shadow-2xl max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-orange-600">
              Restricted Access
            </h2>
            <p className="mb-6 text-gray-700">
              To view detailed information about this venue, please log in or sign up.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  closeModal();
                  navigate("/login");
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition duration-300"
              >
                Login
              </button>
              <button
                onClick={() => {
                  closeModal();
                  navigate("/user-signup");
                }}
                className="px-4 py-2 border border-orange-600 text-orange-600 rounded hover:bg-orange-600 hover:text-white transition duration-300"
              >
                Signup
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBefore;
