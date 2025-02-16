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
import { useNavigate } from "react-router-dom";
import VenueSidebar from "./VenueSidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const VenueOwnerDashboard = () => {
  const [verified, setVerified] = useState(null); // null indicates status not yet determined
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    axios
      .get("http://localhost:8000/api/check-kyc-status", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("KYC status response:", response.data.status);
        if (response.data.status.toLowerCase() === "approved") {
          setVerified(true);
        } else {
          setVerified(false);
        }
      })
      .catch((error) => {
        console.error("Error checking KYC status:", error);
        toast.error("Error verifying KYC status.");
        setVerified(false);
      });
  }, []);

  // Show a loader (or nothing) until we have determined the KYC status
  if (verified === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If KYC is not approved, display only the KYC warning message
  if (!verified) {
    return (
      <div className="h-screen flex bg-gray-100">
        {/* Sidebar remains visible */}
        <VenueSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-bold text-2xl text-yellow-500 mb-4">
              KYC Verification Required
            </p>
            <p className="mb-6">
              Your KYC is not approved. Please update your KYC to access the
              dashboard.
            </p>
            <button
              className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
              onClick={() => navigate("/venue-KYC")}
            >
              Update KYC
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard data and options (rendered only if verified)
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <VenueSidebar />
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
          <div
            className="bg-white p-4 shadow rounded"
            style={{ height: "400px" }}
          >
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Monthly Data
            </h3>
            <Bar data={barData} options={chartOptions} />
          </div>
          <div
            className="bg-white p-4 shadow rounded"
            style={{ height: "400px" }}
          >
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Event Types
            </h3>
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default VenueOwnerDashboard;
