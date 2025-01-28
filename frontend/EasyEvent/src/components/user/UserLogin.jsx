import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      toast.success(response.data.message);
      const token = response.data.token;

      localStorage.setItem("access_token", token);

      // Redirect based on user role with a delay
      setTimeout(() => {
        if (response.data.role === "admin") {
          navigate("/admin-dashboard");
        } else if (response.data.role === "venueOwner") {
          navigate("/venue-owner-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }, 2000);
    } catch (error) {
      toast.error("Login failed!");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-orange-500 flex flex-col justify-center items-center p-10">
        <h1 className="text-5xl font-bold text-white">
          Welcome, <span className="text-yellow-300">Back!</span>
        </h1>
        <p className="mt-4 text-lg text-white">
          Seamless Event Planning Starts Here – Find, Book, and Celebrate with
          Confidence!
        </p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
        <h2 className="text-3xl font-bold text-orange-500 mb-4">Login</h2>
        <p className="text-gray-600 mb-8">
          Enter your Credentials to access your account
        </p>

        <form className="w-3/4" onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="email"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="password"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
            <Link
              to="/forgotpassword"
              className="text-orange-500 hover:underline"
            >
              Forgot password
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
          >
            Login
          </button>
        </form>

        <div className="my-4 flex items-center justify-center">
          <span className="text-gray-400 text-sm">or</span>
        </div>

        <button className="w-3/4 flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-100">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>

        <div className="mt-4">
          <button
            className="w-3/4 border border-orange-500 text-orange-500 py-2 rounded-lg hover:bg-orange-100"
            onClick={() => navigate("/user-signup")}
          >
            Signup
          </button>
        </div>
      </div>

      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
};

export default UserLogin;
