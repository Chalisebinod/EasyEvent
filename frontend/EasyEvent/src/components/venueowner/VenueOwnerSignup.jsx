import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const VenueOwnerSignup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact_number: "",
    location: "",
    agreeToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and policy before signing up.");
      return;
    }
  
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      contact_number: formData.contact_number,
      location: formData.location,
    };
  
    try {
      const response = await fetch(
        "http://localhost:8000/api/signupVenueOwner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        toast.success("Signup successful!");
  
        console.log("Response:", data);
  
        // Delay navigation to allow the toast to display
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Adjust the delay (in milliseconds) as needed
      } else {
        const errorData = await response.json();
        toast.error(`Signup failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="flex min-h-screen">
      <ToastContainer/>
      {/* Left Section */}
      <div className="w-1/2 bg-orange-500 text-white flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold mb-4">Hello, Welcome!</h1>
        <p className="text-lg">
          Join Us Today – Simplify Your Event Planning Journey!
        </p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex justify-center items-center">
        <form
          className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">
            Get Started Now!!
          </h2>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none border-gray-600 border-2"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none border-gray-600 border-2"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none border-gray-600 border-2"
              required
            />
          </div>

          {/* Contact Number */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Contact Number
            </label>
            <input
              type="text"
              name="contact_number"
              placeholder="Contact Number"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none border-gray-600 border-2"
              required
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none border-gray-600 border-2"
              required
            />
          </div>

          {/* Terms & Policy */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
              required
            />
            <label className="ml-2 text-gray-700 text-sm">
              I agree to{" "}
              <a href="/terms" className="text-orange-500 underline">
                terms & policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded font-medium"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default VenueOwnerSignup;
