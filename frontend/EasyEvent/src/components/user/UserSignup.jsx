import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/signup",
        formData
      );

      if (response.status === 201) {
        toast.success("Signup successful! Please log in.");
        setFormData({ name: "", email: "", password: "" });

        // Add a delay before navigation
        setTimeout(() => {
          navigate("/login");
        }, 2000); // 2-second delay
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen">
      <ToastContainer />
      {/* Left Section */}
      <div className="w-1/2 bg-orange-500 flex flex-col justify-center items-center p-10">
        <h1 className="text-5xl font-bold text-white">
          Hello, <span className="text-yellow-300">Welcome!</span>
        </h1>
        <p className="mt-4 text-lg text-white">
          Join Us Today – Simplify Your Event Planning Journey!
        </p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
        <h2 className="text-3xl font-bold text-orange-500 mb-4">
          Users Signup !!
        </h2>

        <form className="w-3/4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <EyeIcon className="w-6 h-6 text-gray-500" />
                ) : (
                  <EyeSlashIcon className="w-6 h-6 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg ${
              isSubmitting
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            } text-white`}
          >
            {isSubmitting ? "Signing up..." : "Signup"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-3 text-center">
          <p className="mt-6 text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-600 font-medium hover:underline"
            >
              {" "}
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
