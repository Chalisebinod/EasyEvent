import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import VenueSidebar from "./VenueSideBar";
// import { useVenue } from "../../context/venueContext";


const Hall = () => {
//   const { venueID } = useVenue(); // from your venue context
  // State for halls list, loading and error messages

  const venueID = localStorage.getItem("venueID")
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form fields for hall details
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [pricePerPlate, setPricePerPlate] = useState("");
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [availability, setAvailability] = useState(true);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [seatingArrangements, setSeatingArrangements] = useState([]);
  const [seatingInput, setSeatingInput] = useState("");

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingHallId, setEditingHallId] = useState(null);

  useEffect(() => {
    if (!venueID) {
      setLoading(false);
      return;
    }
    const fetchHalls = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:8000/api/halls", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setHalls(response.data.halls);
  
        // If no halls exist, create a new hall automatically
        if (response.data.halls.length === 0) {
          await createDefaultHall();
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHalls();
  }, [venueID]);
  
  const createDefaultHall = async () => {
    const hallData = {
      venue: venueID,
      name: "Default Hall",
      capacity: 100,
      pricePerPlate: 50,
      features: ["Basic Setup"],
      availability: true,
      blocked_dates: [],
      seating_arrangements: ["Theater Style"],
    };
  
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:8000/api/halls",
        hallData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Default hall created successfully");
      setHalls([response.data.hall]); // Update UI with the new hall
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };
  

  // Reset the form fields after submission or cancel
  const resetForm = () => {
    setName("");
    setCapacity("");
    setPricePerPlate("");
    setFeatures([]);
    setFeatureInput("");
    setAvailability(true);
    setBlockedDates([]);
    setNewBlockedDate("");
    setSeatingArrangements([]);
    setSeatingInput("");
    setIsEditing(false);
    setEditingHallId(null);
  };

  // Add a new feature
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Add a new blocked date
  const handleAddBlockedDate = () => {
    if (newBlockedDate.trim()) {
      setBlockedDates([...blockedDates, newBlockedDate.trim()]);
      setNewBlockedDate("");
    }
  };

  const handleRemoveBlockedDate = (index) => {
    setBlockedDates(blockedDates.filter((_, i) => i !== index));
  };

  // Add a new seating arrangement
  const handleAddSeating = () => {
    if (seatingInput.trim()) {
      setSeatingArrangements([...seatingArrangements, seatingInput.trim()]);
      setSeatingInput("");
    }
  };

  const handleRemoveSeating = (index) => {
    setSeatingArrangements(seatingArrangements.filter((_, i) => i !== index));
  };

  // Handle form submission (create new hall or update an existing hall)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Include the venueID so that the hall is associated with the current venue
    const hallData = {
      venue: venueID,
      name,
      capacity: Number(capacity),
      pricePerPlate: Number(pricePerPlate),
      features,
      availability,
      blocked_dates: blockedDates, // Backend can convert these to Date objects as needed
      seating_arrangements: seatingArrangements,
    };

    try {
      const token = localStorage.getItem("access_token");
      if (isEditing && editingHallId) {
        // Update hall
        const response = await axios.patch(
          `http://localhost:8000/api/halls/${editingHallId}`,
          hallData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Hall updated successfully");
        setHalls(
          halls.map((hall) =>
            hall._id === editingHallId ? response.data.hall : hall
          )
        );
      } else {
        // Create new hall
        const response = await axios.post(
          "http://localhost:8000/api/halls",
          hallData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Hall added successfully");
        setHalls([...halls, response.data.hall]);
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Pre-fill form fields for editing a hall
  const handleEdit = (hall) => {
    setName(hall.name);
    setCapacity(hall.capacity);
    setPricePerPlate(hall.pricePerPlate);
    setFeatures(hall.features);
    setAvailability(hall.availability);
    // Convert each blocked date to YYYY-MM-DD format for the date input
    setBlockedDates(
      hall.blocked_dates.map(
        (date) => new Date(date).toISOString().split("T")[0]
      )
    );
    setSeatingArrangements(hall.seating_arrangements);
    setIsEditing(true);
    setEditingHallId(hall._id);
  };

  // Delete a hall
  const handleDelete = async (hallId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/api/halls/${hallId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Hall deleted successfully");
      setHalls(halls.filter((hall) => hall._id !== hallId));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <ToastContainer />
      <VenueSidebar />
      <div className="flex-grow p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Manage Halls</h1>
        {/* Check if a venue exists */}
        {!venueID ? (
          <div className="text-center text-xl text-red-600">
            No venue created yet. Please create your venue first.
          </div>
        ) : loading ? (
          <p>Loading halls...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            {/* Display existing halls */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Existing Halls</h2>
              {halls.length === 0 ? (
                <p>No halls found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {halls.map((hall) => (
                    <div
                      key={hall._id}
                      className="bg-white p-4 rounded shadow border"
                    >
                      <h3 className="text-xl font-bold">{hall.name}</h3>
                      <p>
                        <span className="font-semibold">Capacity:</span>{" "}
                        {hall.capacity}
                      </p>
                      <p>
                        <span className="font-semibold">Price Per Plate:</span>{" "}
                        ${hall.pricePerPlate}
                      </p>
                      <p>
                        <span className="font-semibold">Features:</span>{" "}
                        {hall.features.join(", ")}
                      </p>
                      <p>
                        <span className="font-semibold">Availability:</span>{" "}
                        {hall.availability ? "Yes" : "No"}
                      </p>
                      <p>
                        <span className="font-semibold">Blocked Dates:</span>{" "}
                        {hall.blocked_dates &&
                          hall.blocked_dates
                            .map((d) => new Date(d).toLocaleDateString())
                            .join(", ")}
                      </p>
                      <p>
                        <span className="font-semibold">
                          Seating Arrangements:
                        </span>{" "}
                        {hall.seating_arrangements.join(", ")}
                      </p>
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => handleEdit(hall)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(hall._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form for adding or editing a hall */}
            <div className="bg-white p-6 rounded shadow border">
              <h2 className="text-2xl font-semibold mb-4">
                {isEditing ? "Edit Hall" : "Add New Hall"}
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Hall Name */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Hall Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                {/* Capacity and Price Per Plate */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Capacity</label>
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Price Per Plate
                    </label>
                    <input
                      type="number"
                      value={pricePerPlate}
                      onChange={(e) => setPricePerPlate(e.target.value)}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                </div>
                {/* Features */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Features</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      className="w-full border p-2 rounded"
                      placeholder="Add feature"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="ml-2 bg-blue-500 text-white px-3 py-2 rounded"
                    >
                      Add
                    </button>
                  </div>
                  {features.length > 0 && (
                    <ul className="mt-2">
                      {features.map((feat, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between border-b py-1"
                        >
                          {feat}
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="text-red-500"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Availability */}
                <div className="mb-4 flex items-center">
                  <label className="mr-2 font-medium">Availability</label>
                  <input
                    type="checkbox"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                  />
                </div>
                {/* Blocked Dates */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">
                    Blocked Dates
                  </label>
                  <div className="flex">
                    <input
                      type="date"
                      value={newBlockedDate}
                      onChange={(e) => setNewBlockedDate(e.target.value)}
                      className="border p-2 rounded"
                    />
                    <button
                      type="button"
                      onClick={handleAddBlockedDate}
                      className="ml-2 bg-blue-500 text-white px-3 py-2 rounded"
                    >
                      Add Date
                    </button>
                  </div>
                  {blockedDates.length > 0 && (
                    <ul className="mt-2">
                      {blockedDates.map((date, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between border-b py-1"
                        >
                          {date}
                          <button
                            type="button"
                            onClick={() => handleRemoveBlockedDate(index)}
                            className="text-red-500"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Seating Arrangements */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">
                    Seating Arrangements
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={seatingInput}
                      onChange={(e) => setSeatingInput(e.target.value)}
                      className="w-full border p-2 rounded"
                      placeholder="Add seating arrangement"
                    />
                    <button
                      type="button"
                      onClick={handleAddSeating}
                      className="ml-2 bg-blue-500 text-white px-3 py-2 rounded"
                    >
                      Add
                    </button>
                  </div>
                  {seatingArrangements.length > 0 && (
                    <ul className="mt-2">
                      {seatingArrangements.map((seat, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between border-b py-1"
                        >
                          {seat}
                          <button
                            type="button"
                            onClick={() => handleRemoveSeating(index)}
                            className="text-red-500"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  {isEditing ? "Update Hall" : "Add Hall"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Hall;
