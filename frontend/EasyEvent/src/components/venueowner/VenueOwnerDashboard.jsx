import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // For navigation
import VenueSidebar from "./VenueSideBar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const VenueOwnerDashboard = () => {
  const [verified, setVerified] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    // if (!token) {
    //   console.log("No access token");
    //   toast.error("You are not logged in.");
    //   return;
    // }
    // Example logic to check KYC status (add your own logic here)
    axios
      .get("http://localhost:8000/api/check-kyc-status", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.kycStatus !== "verified") {
          setShowWarning(true);
        } else {
          setVerified(true);
        }
      })
      .catch((error) => {
        console.error("Error checking KYC status:", error);
        toast.error("Error verifying KYC status.");
      });
  }, []);

  const barData = {
    labels: ["A", "B", "C", "D"],
    datasets: [
      {
        label: "Monthly Data",
        data: [300, 600, 900, 1200],
        backgroundColor: ["#f87171", "#fbbf24", "#34d399", "#60a5fa"],
      },
    ],
  };

  const pieData = {
    labels: ["Corporate", "Weddings", "Birthdays", "Others"],
    datasets: [
      {
        data: [40, 30, 10, 20],
        backgroundColor: ["#60a5fa", "#34d399", "#fbbf24", "#d1d5db"],
      },
    ],
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* KYC Warning Box */}
      {showWarning && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white p-4 text-center">
          <p className="font-bold text-lg">KYC Verification Required</p>
          <p>Please update your KYC to use all features.</p>
          <button
            className="mt-4 bg-orange-600 text-white px-6 py-2 rounded"
            onClick={() => navigate("/venue-KYC")}
          >
            Update KYC
          </button>
        </div>
      )}
      {/* Sidebar */}
      <VenueSidebar /> {/* Use the Sidebar component here */}
      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-orange-500">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="text-orange-500 text-lg">🔔</span>
            <img
              src="https://via.placeholder.com/30"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[{ title: "Total Bookings", value: "45", bg: "bg-orange-100" }].map(
            (stat, index) => (
              <div
                key={index}
                className={`p-4 rounded shadow ${stat.bg} text-center`}
              >
                <h3 className="text-sm font-bold text-gray-700 mb-2">
                  {stat.title}
                </h3>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              </div>
            )
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Monthly Data
            </h3>
            <Bar data={barData} />
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Event Types
            </h3>
            <Pie data={pieData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default VenueOwnerDashboard;
