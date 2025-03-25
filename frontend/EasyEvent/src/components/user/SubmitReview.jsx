import React, { useState } from "react";
import { useParams } from "react-router-dom";

/**
 * A simple star rating input component (interactive).
 * The parent can pass `rating` and `onRatingChange` props.
 */
function StarRatingInput({ rating, onRatingChange }) {
  // We assume rating is 1 to 5. You can adjust as needed.
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={star <= rating ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`w-8 h-8 ${
              star <= rating ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902
                 0l2.019 6.22a1 1 0 00.95.69h6.545c.969
                 0 1.371 1.24.588 1.81l-5.3 3.846a1
                 1 0 00-.364 1.118l2.019 6.22c.3.922-.755
                 1.688-1.54 1.118l-5.3-3.846a1 1 0
                 00-1.176 0l-5.3 3.846c-.785.57-1.84-.196-1.54-1.118l2.02-6.22a1
                 1 0 00-.364-1.118l-5.3-3.846c-.783-.57-.38-1.81.588-1.81h6.545a1
                 1 0 00.95-.69l2.02-6.22z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

function SubmitReview() {
  const { id: venueId } = useParams(); // or useParams().venueId

  // Local state for rating and comment
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Optional: track loading, error, success states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      // ---------------------
      // Example: If you want to integrate the backend, uncomment the fetch call:
      //
      // const response = await fetch(
      //   `http://localhost:8000/api/venues/${venueId}/reviews`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ rating, comment }),
      //   }
      // );
      //
      // if (!response.ok) {
      //   throw new Error("Failed to submit review");
      // }
      // ---------------------

      // Simulate a short delay (remove this setTimeout when integrating backend)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // If successful, show success message
      setSuccess(true);
      // Clear form
      setRating(0);
      setComment("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If success is true, show a simple thank-you message
  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Thank You!
          </h1>
          <p className="text-gray-700 mb-2">
            Your review has been submitted successfully.
          </p>
          <p className="text-gray-500">
            We appreciate your feedback and hope to serve you again!
          </p>
        </div>
      </div>
    );
  }

  // Otherwise, render the review form
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          Submit Your Review
        </h1>
        <p className="mb-6 text-gray-600">
          Venue ID: <span className="font-mono">{venueId}</span>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <label className="block mb-2 text-gray-700 font-medium">
            Your Rating
          </label>
          <StarRatingInput rating={rating} onRatingChange={setRating} />
          {rating === 0 && (
            <p className="text-sm text-red-500 mt-1">
              Please select a star rating.
            </p>
          )}

          {/* Comment */}
          <label className="block mt-6 mb-2 text-gray-700 font-medium">
            Your Review
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-orange-400"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
          ></textarea>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="mt-4 px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitReview;
