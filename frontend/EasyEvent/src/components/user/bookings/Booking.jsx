import React, { useState, useEffect } from "react";

import { toast, ToastContainer } from "react-toastify";
import Navbar from "../Navbar";
import BottomNavbar from "../BottomNavbar";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaComments } from "react-icons/fa";
import ChatWidget from "../chat/ChatWidget";

const Booking = () => {
  const { id: venueId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");
  const [chatOpen, setChatOpen] = useState(false);

  // Receive partnerId from navigation state (if passed)
  const partnerIdFromState = location.state?.partnerId;
  console.log("partner Id", partnerIdFromState);
  

  // API data for halls and food
  const [halls, setHalls] = useState([]);
  const [foods, setFoods] = useState([]);

  // Form state
  const [selectedHall, setSelectedHall] = useState(null);
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([
    { name: "", description: "" },
  ]);

  // Food type filter
  const [selectedFoodType, setSelectedFoodType] = useState("All");

  // Pricing fields
  const [originalPrice, setOriginalPrice] = useState(0);
  const officialTotal = guestCount ? guestCount * originalPrice : 0;

  // User offer
  const [offerMode, setOfferMode] = useState("perPlate");
  const [userOfferedValue, setUserOfferedValue] = useState("");
  const [offerError, setOfferError] = useState("");

  // Computed final price
  const [finalPrice, setFinalPrice] = useState(0);
  const [totalCostFinal, setTotalCostFinal] = useState(0);

  // Capacity error
  const [capacityError, setCapacityError] = useState("");

  // Chat feature
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // Handle sending a chat message
  const handleSendMessage = () => {
    if (chatInput.trim() === "") return;
    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: chatInput,
      time: new Date().toLocaleTimeString(),
    };
    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput("");
  };

  // Fetch halls
  useEffect(() => {
    if (!venueId) return;
    fetch(`http://localhost:8000/api/halls/${venueId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setHalls(data.halls);
      })
      .catch((err) => console.error("Error fetching halls:", err));
  }, [venueId, accessToken]);

  // Fetch foods
  useEffect(() => {
    if (!venueId) return;
    fetch(`http://localhost:8000/api/food/venue/${venueId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const allFoods = [];
        data.forEach((category) => {
          if (Array.isArray(category.foods)) {
            category.foods.forEach((food) => {
              allFoods.push({ ...food, food_type: category.food_type });
            });
          }
        });
        setFoods(allFoods);
      })
      .catch((err) => console.error("Error fetching foods:", err));
  }, [venueId, accessToken]);

  // Compute final price whenever offer changes
  useEffect(() => {
    if (guestCount && userOfferedValue) {
      const count = parseInt(guestCount);
      const offerVal = parseFloat(userOfferedValue);
      let offeredPerPlate = 0;
      if (offerMode === "perPlate") {
        offeredPerPlate = offerVal;
      } else {
        offeredPerPlate = count ? offerVal / count : 0;
      }
      setFinalPrice(offeredPerPlate);
      setTotalCostFinal(offeredPerPlate * count);
    }
  }, [guestCount, userOfferedValue, offerMode, originalPrice]);

  // Validate guest count
  const handleGuestCountChange = (e) => {
    const value = e.target.value;
    if (selectedHall && parseInt(value) > selectedHall.capacity) {
      setCapacityError(
        `Maximum capacity for ${selectedHall.name} is ${selectedHall.capacity} guests.`
      );
    } else {
      setCapacityError("");
    }
    setGuestCount(value);
  };

  const openChat = () => {
    setChatOpen(true);
    setIsMinimized(false);
  };

  const closeChat = () => {
    setChatOpen(false);
  };

  // Validate user offer
  const handleUserOfferedValueChange = (e) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    let minOffer = 0;
    if (offerMode === "perPlate") {
      minOffer = originalPrice * 0.7;
    } else {
      minOffer = officialTotal * 0.7;
    }
    if (numValue < minOffer) {
      setOfferError(
        `Minimum allowed offer is ${minOffer.toFixed(2)} (${offerMode === "perPlate" ? "per plate" : "total"
        }).`
      );
    } else {
      setOfferError("");
    }
    setUserOfferedValue(value);
  };

  // Toggle food selection
  const toggleFoodSelection = (foodId) => {
    if (selectedFoods.includes(foodId)) {
      setSelectedFoods(selectedFoods.filter((id) => id !== foodId));
    } else {
      setSelectedFoods([...selectedFoods, foodId]);
    }
  };

  // Additional services
  const handleServiceChange = (index, field, value) => {
    const newServices = [...additionalServices];
    newServices[index][field] = value;
    setAdditionalServices(newServices);
  };

  const addService = () => {
    setAdditionalServices((prev) => [...prev, { name: "", description: "" }]);
  };

  const removeService = (index) => {
    const newServices = [...additionalServices];
    newServices.splice(index, 1);
    setAdditionalServices(newServices);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedHall) {
      alert("Please select a hall.");
      return;
    }
    if (!eventType || !eventDate || !guestCount) {
      alert("Please fill in all event details.");
      return;
    }
    if (capacityError) {
      alert("Please adjust guest count as per hall capacity.");
      return;
    }
    if (offerError) {
      alert(offerError);
      return;
    }
    const offeredPerPlate =
      offerMode === "perPlate"
        ? parseFloat(userOfferedValue)
        : parseFloat(userOfferedValue) / parseInt(guestCount);
    const finalP = Math.round((parseFloat(originalPrice) + offeredPerPlate) / 2);
    const payload = {
      venue: venueId,
      hall: selectedHall._id,
      event_details: {
        event_type: eventType,
        date: eventDate,
        guest_count: parseInt(guestCount),
      },
      selected_foods: selectedFoods,
      additional_services: additionalServices,
      pricing: {
        original_per_plate_price: parseFloat(originalPrice),
        user_offered_per_plate_price: offeredPerPlate,
        final_per_plate_price: finalP,
        total_cost: finalP * parseInt(guestCount),
      },
    };

    fetch("http://localhost:8000/api/booking/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Booking created:", data);
        toast.success("Booking request submitted successfully!");
      })
      .catch((err) => {
        console.error("Error creating booking:", err);
        alert("Failed to create booking. Please try again.");
      });
  };

  // Filter foods
  const filteredFoods =
    selectedFoodType === "All"
      ? foods
      : foods.filter((food) => food.food_type === selectedFoodType);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Content Area */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-gray-100">
        {/* Navbar */}
        <Navbar />
        <ToastContainer />

        {/* Main Container */}
        <div className="max-w-screen-xl mx-auto bg-white shadow-lg rounded-xl p-10 my-8">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
            Book Your Event
          </h1>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Hall Selection */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">
                Select a Hall
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {halls.map((hall) => (
                  <div
                    key={hall._id}
                    className={`border rounded-xl p-4 cursor-pointer transition transform hover:scale-105 ${selectedHall && selectedHall._id === hall._id
                      ? "border-orange-500 shadow-2xl"
                      : "border-gray-300"
                      }`}
                    onClick={() => {
                      setSelectedHall(hall);
                      setOriginalPrice(hall.pricePerPlate);
                    }}
                  >
                    {hall.images && hall.images.length > 0 ? (
                      <img
                        src={`http://localhost:8000/${hall.images[0].replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt={hall.name}
                        className="w-full h-48 object-cover rounded-xl mb-4"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                        No Image
                      </div>
                    )}
                    <p className="text-center font-medium text-lg">
                      {hall.name}
                    </p>
                    <p className="text-center text-sm text-gray-600">
                      Capacity: {hall.capacity}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Event Details */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">
                Event Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Event Type</option>
                    <option value="Marriage">Marriage</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Guest Count
                  </label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={handleGuestCountChange}
                    className="mt-2 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="1"
                  />
                  {capacityError && (
                    <p className="text-red-500 text-sm mt-1">
                      {capacityError}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Food Selection */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">
                Select Foods
              </h2>
              {/* Food Type Toggle */}
              <div className="flex space-x-4 mb-6">
                {["All", "Veg", "Non Veg"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedFoodType(type)}
                    className={`px-4 py-2 rounded-full transition ${selectedFoodType === type
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {filteredFoods.map((food) => (
                  <div
                    key={food._id}
                    className={`border rounded-xl p-3 cursor-pointer transition transform hover:scale-105 ${selectedFoods.includes(food._id)
                      ? "border-orange-500 shadow-xl"
                      : "border-gray-300"
                      }`}
                    onClick={() => toggleFoodSelection(food._id)}
                  >
                    <p className="text-center text-sm font-medium">
                      {food.name}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Additional Services */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">
                Additional Services
              </h2>
              {additionalServices.map((service, index) => (
                <div key={index} className="border p-4 rounded-xl mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-medium text-lg">
                      Service {index + 1}
                    </p>
                    {additionalServices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) =>
                        handleServiceChange(index, "name", e.target.value)
                      }
                      className="mt-2 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter service name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Description
                    </label>
                    <textarea
                      value={service.description}
                      onChange={(e) =>
                        handleServiceChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="mt-2 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter description"
                    ></textarea>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                className="px-4 py-2 bg-orange-500 text-white rounded-full transition hover:bg-orange-600"
              >
                Add Service
              </button>
            </section>

            {/* Pricing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">
                Pricing
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {/* Official Pricing */}
                <div className="p-6 border rounded-xl bg-gray-50 shadow-inner">
                  <h3 className="text-xl font-semibold mb-4">
                    Official Pricing
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium">
                        Price per Plate
                      </label>
                      <input
                        type="number"
                        value={originalPrice}
                        readOnly
                        className="mt-2 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium">
                        Total Price
                      </label>
                      <input
                        type="number"
                        value={officialTotal}
                        readOnly
                        className="mt-2 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Your Offer */}
                <div className="p-6 border rounded-xl bg-gray-50 shadow-inner">
                  <h3 className="text-xl font-semibold mb-4">Your Offer</h3>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Select Offer Type
                    </label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setOfferMode("perPlate");
                          setUserOfferedValue("");
                          setOfferError("");
                        }}
                        className={`px-4 py-2 rounded-full transition ${offerMode === "perPlate"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-800"
                          }`}
                      >
                        Per Plate
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOfferMode("total");
                          setUserOfferedValue("");
                          setOfferError("");
                        }}
                        className={`px-4 py-2 rounded-full transition ${offerMode === "total"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-800"
                          }`}
                      >
                        Total
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {offerMode === "perPlate" ? (
                      <>
                        <div>
                          <label className="block text-gray-700 font-medium">
                            Offered Price per Plate
                          </label>
                          <input
                            type="number"
                            value={userOfferedValue}
                            onChange={handleUserOfferedValueChange}
                            placeholder="Enter your offered price"
                            className="mt-2 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium">
                            Total Offer
                          </label>
                          <input
                            type="number"
                            value={
                              guestCount && userOfferedValue
                                ? guestCount * userOfferedValue
                                : ""
                            }
                            readOnly
                            className="mt-2 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-gray-700 font-medium">
                            Offered Total Price
                          </label>
                          <input
                            type="number"
                            value={userOfferedValue}
                            onChange={handleUserOfferedValueChange}
                            placeholder="Enter your offered total price"
                            className="mt-2 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium">
                            Equivalent Price per Plate
                          </label>
                          <input
                            type="number"
                            value={
                              guestCount && userOfferedValue
                                ? (userOfferedValue / guestCount).toFixed(2)
                                : ""
                            }
                            readOnly
                            className="mt-2 w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {offerError && (
                    <p className="text-red-500 text-sm mt-2">{offerError}</p>
                  )}
                  <div className="mt-6 p-4 border-t">
                    <p className="text-gray-700">
                      Final Accepted Price per Plate:{" "}
                      <span className="font-semibold">{finalPrice}</span>
                    </p>
                    <p className="text-gray-700">
                      Total Final Cost:{" "}
                      <span className="font-semibold">{totalCostFinal}</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="text-center">
              <button
                type="submit"
                className="px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full shadow-lg hover:shadow-2xl transition"
              >
                Submit Booking Request
              </button>
            </div>
          </form>
        </div>

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
          <ChatWidget partnerId={partnerIdFromState} onClose={closeChat} />
        )}

      </div>

      {/* Bottom Navbar always at the bottom */}
      <BottomNavbar />
    </div>
  );
};

export default Booking;
