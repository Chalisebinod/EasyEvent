import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "./BottomNavbar";
import { ArrowRightIcon } from "lucide-react";

const ImageCarousel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation(); // Prevent modal from opening
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };

  const prevImage = (e) => {
    e.stopPropagation(); // Prevent modal from opening
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-56 overflow-hidden group">
      {/* Main Image */}
      <img
        src={images[currentImageIndex]}
        alt={`Venue image ${currentImageIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/70 p-2 rounded-full transition duration-300 z-20"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-800" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/70 p-2 rounded-full transition duration-300 z-20"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-800" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Image Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-orange-600 w-6' 
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const DashboardBefore = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [venues, setVenues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Fetch venues from the API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/venues");
        if (!response.ok) {
          console.error("Error fetching venues:", response.statusText);
          setVenues([]); 
          return;
        }
        const data = await response.json();
        setVenues(data.venues || []); 
      } catch (error) {
        console.error("Error fetching venues:", error);
        setVenues([]); 
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
  const openModal = (venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Clickable Logo */}
          <div
            onClick={() => navigate("/")}
            className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500 cursor-pointer hover:opacity-80 transition-all duration-300"
          >
            EasyEvents
          </div>
         
          <div className="flex items-center space-x-4">
            <div className="relative group">
            <div className="flex-1 flex justify-end">
            <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-orange-600 text-white rounded-full text-sm font-medium hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Login
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => navigate("/user-signup")}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-black border border-orange-600 rounded-full text-sm font-medium hover:bg-orange-700 hover:text-white transition-colors shadow-md hover:shadow-lg"
              >
                Signup
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {filteredVenues.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="bg-orange-100 p-8 rounded-full mb-6 animate-pulse">
              <svg 
                className="w-24 h-24 text-orange-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m5-4v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              No Venues Available
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Sorry, there are no venues listed at the moment. Please check back later or explore other options.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white font-semibold rounded-full shadow-md hover:opacity-90 transition duration-300"
            >
              Explore Other Options
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredVenues.map((venue) => {
              // Prepare venue images (main + additional)
              const venueImages = [
                venue.profile_image 
                  ? `http://localhost:8000/${venue.profile_image.replace(/\\/g, "/")}`
                  : "https://via.placeholder.com/300",
                ...(venue.additional_images || []).slice(0, 2).map(img => 
                  `http://localhost:8000/${img.replace(/\\/g, "/")}`
                )
              ];

              return (
                <div
                  key={venue.id}
                  onClick={() => openModal(venue)}
                  className="bg-white rounded-xl overflow-hidden shadow-lg transform hover:scale-105 hover:shadow-2xl transition duration-300 cursor-pointer group"
                >
                  {/* Image Carousel */}
                  <ImageCarousel images={venueImages} />
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition duration-300">
                      {venue.name}
                    </h3>
                    <p className="text-gray-600 mb-2 flex items-center">
                      <svg 
                        className="w-5 h-5 mr-2 text-orange-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {venue.location.address}, {venue.location.city}, {venue.location.state}
                    </p>
                    <p className="text-gray-500 text-sm mb-14 line-clamp-2">
                      {venue.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <BottomNavbar />

      {/* Modal for Unauthenticated Users */}
      {isModalOpen && selectedVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dimmed & Blurred Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            {/* Venue Images Carousel */}
            <div className="mb-6">
              <ImageCarousel 
                images={[
                  selectedVenue.profile_image 
                    ? `http://localhost:8000/${selectedVenue.profile_image.replace(/\\/g, "/")}`
                    : "https://via.placeholder.com/300",
                  ...(selectedVenue.additional_images || []).slice(0, 2).map(img => 
                    `http://localhost:8000/${img.replace(/\\/g, "/")}`
                  )
                ]} 
              />
            </div>

            <div className="absolute top-4 right-4">
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 transition duration-300"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-orange-600">
                {selectedVenue.name}
              </h2>
              <p className="mb-6 text-gray-700 max-w-sm mx-auto">
                To view full details and book this venue, please log in or sign up.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    closeModal();
                    navigate("/login");
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-full hover:opacity-90 transition duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    navigate("/user-signup");
                  }}
                  className="px-6 py-2 border-2 border-orange-600 text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition duration-300"
                >
                  Signup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBefore;