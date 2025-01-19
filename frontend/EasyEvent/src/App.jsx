import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import LandingPage from "./components/user/LandingPage";
import VenueOwnerSignup from "./components/venueowner/VenueOwnerSignup";
import UserDashboard from "./components/user/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import VenueOwnerDashboard from "./components/venueowner/VenueOwnerDashboard";
import UserSignup from "./components/user/UserSignup";
import KYCPage from "./components/venueowner/KYCPage";
import DashboardBefore from "./components/user/DashboardBefore";
import UserLogin from "./components/user/Userlogin";
import Profile from "./components/user/Profile";
import { reactLocalStorage } from "reactjs-localstorage";
import ChangePassword from "./components/user/ChangePassword";
import PaymentDetails from "./components/user/PaymentDetails";
import DeleteAccount from "./components/user/DeleteAccount";
import UserPage from "./components/admin/UserPage";
import VenueOwnerPage from "./components/admin/VenueOwnerPage";
import AdminPage from "./components/admin/AdminPage";
import VenueOwnerUserProfile from "./components/admin/VenueOwnerUserProfile";
import VenueOwnerProfile from "./components/venueowner/VenueOwnerProfile";

function App() {
  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   console.log("Token from localStorage:", token);
  //   if (!token) {
  //     console.log("No access token");
  //     localStorage.removeItem("token removed", token);
  //   }
  //   if (token) {
  //     axios
  //       .get("http://localhost:8000/api/autoLogin", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then((response) => {
  //         const { user } = response.data;
  //         const role = user.role;

  //         // Conditional navigation based on user role
  //         if (role === "admin") {
  //           window.location.href = "/admin-dashboard";
  //         } else if (role === "venueOwner") {
  //           window.location.href = "/venue-owner-dashboard";
  //         } else if (role === "user") {
  //           window.location.href = "/user-dashboard";
  //         } else {
  //           toast.error("Unknown user role.");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Auto-login failed:", error);
  //         localStorage.removeItem("access_token");
  //         toast.error("Session expired. Please log in again.");
  //       });
  //   }
  // }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Pages */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/user-profile" element={<Profile />} />

        {/* Signup Page for VenueOwner */}
        <Route path="/user-signup" element={<UserSignup />} />
        <Route path="/venue-owner-signup" element={<VenueOwnerSignup />} />

        {/* Dashboard Pages */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/all-user" element={<UserPage />} />
        <Route path="/all-venueUser" element={<VenueOwnerPage />} />
        <Route path="/all-admin" element={<AdminPage />} />
        <Route
          path="/venueOwner-profile/:id"
          element={<VenueOwnerUserProfile />}
        />

        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route
          path="/venue-owner-dashboard"
          element={<VenueOwnerDashboard />}
        />
                <Route
          path="/venue-owner-self-profile"
          element={<VenueOwnerProfile />}
        />

        <Route path="/user-dashboard-before" element={<DashboardBefore />} />

        {/* KYCPage */}
        <Route path="/venue-KYC" element={<KYCPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/payment-details" element={<PaymentDetails />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        {/* Redirect to Home if no match */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
