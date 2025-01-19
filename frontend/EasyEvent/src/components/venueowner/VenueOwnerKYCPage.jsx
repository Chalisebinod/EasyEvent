import React from "react";
import { useNavigate } from "react-router-dom";

const VenueOwnerKYCPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <div className="text-3xl font-extrabold text-orange-500">
          EasyEvents
        </div>
      </header>

      {/* Main Section */}
      <main className="container mx-auto py-16 px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-4xl font-bold text-orange-500 text-center mb-6">
            Complete Your KYC Verification
          </h2>
          <p className="text-lg text-gray-700 text-center mb-8">
            To start listing and managing your venues, please upload your
            documents for KYC verification. This step is crucial to ensure trust
            and transparency on our platform.
          </p>

          {/* Benefits Section */}
          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Benefits of KYC Verification
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Feature your venue in top search results</li>
              <li>Earn trust with verified badges for your listings</li>
              <li>Enable secure and seamless online payments</li>
              <li>Access detailed analytics of customer interactions</li>
              <li>Increase visibility and engagement with potential clients</li>
            </ul>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button
              onClick={() => navigate("/kyc-upload")}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full shadow-md hover:bg-orange-600 transition duration-300"
            >
              Upload Documents for KYC
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">
            What You Can Do After KYC Verification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h4 className="text-xl font-bold text-orange-500 mb-4">
                List Your Venues
              </h4>
              <p className="text-gray-700">
                Add detailed profiles for your venues, including photos,
                pricing, and capacity.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h4 className="text-xl font-bold text-orange-500 mb-4">
                Manage Bookings
              </h4>
              <p className="text-gray-700">
                Accept, decline, or manage booking requests seamlessly in real
                time.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h4 className="text-xl font-bold text-orange-500 mb-4">
                Receive Secure Payments
              </h4>
              <p className="text-gray-700">
                Ensure smooth financial transactions with secure payment
                gateways.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h4 className="text-xl font-bold text-orange-500 mb-4">
                Analytics Dashboard
              </h4>
              <p className="text-gray-700">
                Gain insights into customer behavior and venue performance
                through analytics.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h4 className="text-xl font-bold text-orange-500 mb-4">
                Real-Time Messaging
              </h4>
              <p className="text-gray-700">
                Communicate directly with clients to negotiate bookings or
                clarify requirements.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h4 className="text-xl font-bold text-orange-500 mb-4">
                Build Reputation
              </h4>
              <p className="text-gray-700">
                Enhance your credibility with verified listings and positive
                client reviews.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VenueOwnerKYCPage;
