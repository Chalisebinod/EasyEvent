import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Adjust the import paths as needed
import BottomNavbar from "./BottomNavbar";

const PaymentPage = () => {
  // In a real scenario, these would be fetched automatically from your backend
  const [numGuests, setNumGuests] = useState(50);
  const [perPlate, setPerPlate] = useState(100);
  const [agreementChecked, setAgreementChecked] = useState(false);

  // New states for transaction details
  const [transactionNumber, setTransactionNumber] = useState("");
  const [pin, setPin] = useState("");

  const navigate = useNavigate();
  const totalPrice = numGuests * perPlate;

  const handlePayment = () => {
    if (!agreementChecked) {
      alert("Please read and accept the agreement before paying.");
      return;
    }
    if (!transactionNumber) {
      alert("Please enter your transaction number.");
      return;
    }
    if (pin.length !== 4) {
      alert("Please enter a valid 4-digit pin.");
      return;
    }
    // Proceed with payment logic here
    alert(`Payment Successful! Total: Rs. ${totalPrice}`);
    // Optionally navigate after payment
    // navigate("/somewhere");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar at the top */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Main content area */}
      <main className="flex items-center justify-center">
        {/* Card Container */}
        <div className="bg-white w-full max-w-xl shadow-lg rounded-md p-8 m-4">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
            Transaction Details
          </h1>

          {/* Display Static Details */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-700">Num Guests:</span>
            <span className="text-gray-900 font-medium">{numGuests}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-700">Per Plate:</span>
            <span className="text-gray-900 font-medium">{perPlate}</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="font-semibold text-gray-700">Total Price:</span>
            <span className="text-2xl font-bold text-red-500">
              Rs. {totalPrice}
            </span>
          </div>

          {/* Transaction Details Form */}
          <div className="mb-8">
            <div className="mb-4">
              <label
                htmlFor="transactionNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Transaction Number
              </label>
              <input
                type="text"
                id="transactionNumber"
                value={transactionNumber}
                onChange={(e) => setTransactionNumber(e.target.value)}
                placeholder="Enter Transaction Number"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="transactionAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Transaction Amount
              </label>
              <input
                type="text"
                id="transactionAmount"
                value={totalPrice}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-gray-100 "
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="pin"
                className="block text-sm font-medium text-gray-700"
              >
                4-Digit Pin
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit pin"
                maxLength="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start mb-6">
            <input
              type="checkbox"
              id="agreement"
              checked={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
              className="mt-1 mr-2"
            />
            <label htmlFor="agreement" className="text-gray-700">
              I have read and agree to the{" "}
              <Link to="/agreement" className="text-blue-600 hover:underline">
                terms and conditions
              </Link>
            </label>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={!agreementChecked}
            className={`w-full py-3 rounded-md text-white text-lg font-bold transition-colors ${
              agreementChecked
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Pay Now
          </button>
        </div>
      </main>

      {/* Sticky Bottom Navbar */}
      <div>
        <BottomNavbar />
      </div>
    </div>
  );
};

export default PaymentPage;
