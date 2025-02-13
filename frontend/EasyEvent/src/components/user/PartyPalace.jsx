import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";



const PartyPalace = () => {
  const { id } = useParams(); // Get venue id from URL params
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/venues/${id}`);
        const data = await response.json();
        // Assuming the response returns a key "venue"
        setVenue(data.venue);
      } catch (err) {
        setError("Failed to fetch venue details");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{error}</p>
      </div>
    );
  if (!venue)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No venue details available.</p>
      </div>
    );

  // Helper to build image URL (handles Windows backslashes)
  const getImageUrl = (imgPath) =>
    `http://localhost:8000/${imgPath.replace(/\\/g, "/")}`;

  return (
    <div className="bg-gray-100">
      <Navbar />

      {/* Container */}
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div
          className="relative h-80 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              venue.profile_image
                ? getImageUrl(venue.profile_image)
                : "https://via.placeholder.com/1200x400"
            })`,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <h1 className="text-5xl text-white font-bold">{venue.name}</h1>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8 bg-white shadow-lg rounded-lg -mt-12 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Overview & Contact */}
            <div>
              <h2 className="text-3xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-700 mb-6">{venue.description}</p>
              <div className="mb-6">
                <h3 className="text-xl font-semibold">Location</h3>
                <p className="text-gray-600">
                  {venue.location.address}, {venue.location.city},{" "}
                  {venue.location.state} {venue.location.zip_code}
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold">Contact Details</h3>
                <p className="text-gray-600">
                  <strong>Phone:</strong> {venue.contact_details.phone}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {venue.contact_details.email}
                </p>
                {venue.contact_details.social_media && (
                  <div className="mt-2">
                    {venue.contact_details.social_media.facebook && (
                      <p className="text-gray-600">
                        <strong>Facebook:</strong>{" "}
                        {venue.contact_details.social_media.facebook}
                      </p>
                    )}
                    {venue.contact_details.social_media.instagram && (
                      <p className="text-gray-600">
                        <strong>Instagram:</strong>{" "}
                        {venue.contact_details.social_media.instagram}
                      </p>
                    )}
                    {venue.contact_details.social_media.website && (
                      <p className="text-gray-600">
                        <strong>Website:</strong>{" "}
                        {venue.contact_details.social_media.website}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">Payment Policy</h3>
                <p className="text-gray-600">
                  <strong>Advance Percentage:</strong>{" "}
                  {venue.payment_policy.advance_percentage}%
                </p>
                <p className="text-gray-600">
                  <strong>Security Deposit:</strong> $
                  {venue.payment_policy.security_deposit}
                </p>
                <p className="text-gray-600">
                  <strong>Refund Policy:</strong>{" "}
                  {venue.payment_policy.refund_policy}
                </p>
                <p className="text-gray-600">
                  <strong>Cancellation Penalty:</strong>{" "}
                  {venue.payment_policy.cancellation_penalty}
                </p>
              </div>
            </div>

            {/* Right Column - Gallery & Event Pricing */}
            <div>
              <h2 className="text-3xl font-semibold mb-4">Gallery</h2>
              {venue.images && venue.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {venue.images.map((img, index) => (
                    <img
                      key={index}
                      src={getImageUrl(img)}
                      alt={`Gallery ${index}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mb-6">
                  No additional images available.
                </p>
              )}

              <h2 className="text-3xl font-semibold mb-4">Event Pricing</h2>
              {venue.event_pricing && venue.event_pricing.length > 0 ? (
                <div className="space-y-4">
                  {venue.event_pricing.map((pricing, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="text-xl font-semibold">
                        {pricing.event_type}
                      </h3>
                      <p className="text-gray-600">
                        <strong>Price Per Plate:</strong> $
                        {pricing.pricePerPlate}
                      </p>
                      {pricing.description && (
                        <p className="text-gray-600">{pricing.description}</p>
                      )}
                      {pricing.services_included &&
                        pricing.services_included.length > 0 && (
                          <p className="text-gray-600">
                            <strong>Services Included:</strong>{" "}
                            {pricing.services_included.join(", ")}
                          </p>
                        )}
                      {pricing.hall && (
                        <p className="text-gray-600">
                          <strong>Hall:</strong> {pricing.hall.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No event pricing available.</p>
              )}
            </div>
          </div>

          {/* Additional Services Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-semibold mb-4">Additional Services</h2>
            {venue.additional_services &&
            venue.additional_services.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {venue.additional_services.map((service, index) => (
                  <li key={index}>
                    <span className="font-semibold">{service.name}:</span>{" "}
                    {service.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No additional services available.</p>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-semibold mb-4">Reviews</h2>
            {venue.reviews && venue.reviews.length > 0 ? (
              <div className="space-y-4">
                {venue.reviews.map((review, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2">{review.user}</span>
                      <span className="text-yellow-500">
                        {Array(review.rating)
                          .fill()
                          .map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <small className="text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default PartyPalace;
