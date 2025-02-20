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
import EmailVerification from "./components/user/EmailVerification";
import PasswordChange from "./components/user/PasswordChange";
import ForgetPassword from "./components/user/ForgotPassword";
import UserLogin from "./components/user/UserLogin";
import CreateVenue from "./components/venueowner/CreateVenue";
import VenueProfile from "./components/venueowner/VenueProfile";
import EventBookingForm from "./components/user/EventBookingForm";
import KycRequest from "./components/admin/KycRequest";
import KycProfile from "./components/admin/KycProfile";
import Notification from "./components/venueowner/Notification";
import Hall from "./components/venueowner/Hall";
import PartyPalace from "./components/user/PartyPalace";
import AgreementPage from "./components/venueowner/AgreementPage";
import Request from "./components/venueowner/Request";
import EventDetails from "./components/venueowner/EventDetails";
import UserBookings from "./components/user/UserBookings";
import Booking from "./components/user/bookings/Booking";

function App() {
  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   console.log("Token from localStorage:", token);
  //   if (!token) {
  //     console.log("No access token");
  //     localStorage en removed", token);
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
        <Route path="/Venue-profile" element={<VenueProfile />} />
        <Route path="/halls" element={<Hall />} />
        <Route path="/party-palace/:id" element={<PartyPalace />} />

        <Route path="/venueOwnerKyc" element={<KYCPage />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/agreement" element={<AgreementPage />} />
        <Route path="/user-request" element={<Request />} />
        <Route path="/event-details/:id" element={<EventDetails />} />

        <Route path="/user-bookings" element={<UserBookings />} />
        <Route path="/user-book/:id" element={<Booking />} />


        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Pages */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/user-profile" element={<Profile />} />

        {/* Signup Page for VenueOwner */}
        <Route path="/user-signup" element={<UserSignup />} />
        <Route path="/venue-owner-signup" element={<VenueOwnerSignup />} />

        {/* change password and email verification */}
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/forgotpassword" element={<ForgetPassword />} />

        <Route path="/password-change" element={<PasswordChange />} />

        {/* Dashboard Pages */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/all-user" element={<UserPage />} />
        <Route path="/all-venueUser" element={<VenueOwnerPage />} />
        <Route path="/all-admin" element={<AdminPage />} />
        <Route path="/kyc-request" element={<KycRequest />} />
        <Route path="/kyc-profile/:kycId" element={<KycProfile />} />

        <Route
          path="/venueOwner-profile/:id"
          element={<VenueOwnerUserProfile />}
        />
        <Route path="/Create-venue" element={<CreateVenue />} />

        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/event-booking-form" element={<EventBookingForm />} />

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
