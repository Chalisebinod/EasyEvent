// src/components/ReviewForm.jsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");

  // Get venueOwnerId from URL params (sent via email)
  const [searchParams] = useSearchParams();
  const venueOwnerId = searchParams.get("venueOwnerId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // User should be logged in
      const response = await axios.post(
        "http://localhost:5000/api/reviews/submit",
        { venueOwnerId, rating, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error submitting review");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Rate the Venue</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Rating (0-10)</label>
        <input
          type="number"
          min="0"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <label className="block mb-2">Review</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
    
  );
};

export default ReviewForm;
