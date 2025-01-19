import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      <ToastContainer/>
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
          Get Started Now!!
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
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-start mb-6">
            <input type="checkbox" id="terms" className="mr-2" />
            <label htmlFor="terms" className="text-gray-700">
              I agree to{" "}
              <a href="#" className="text-orange-500 underline">
                terms & policy
              </a>
            </label>
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
      </div>
    </div>
  );
};

export default UserSignup;
