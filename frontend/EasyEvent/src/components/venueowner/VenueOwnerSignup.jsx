import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const VenueOwnerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact_number: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      contact_number: formData.contact_number,
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
        toast.success("Signup successful!");
        setTimeout(() => navigate("/login"), 2000);
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
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex flex-col justify-center items-center p-10 shadow-lg">
        <h1 className="text-5xl font-bold mb-4">Welcome, Venue Owners!</h1>
        <p className="text-lg text-center">
          Join us and make event planning seamless!
        </p>
      </div>
      <div className="w-1/2 flex justify-center items-center p-8">
        <form
          className="w-full max-w-md bg-white p-8 shadow-xl rounded-lg border border-gray-200"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
            Signup
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 border-gray-300"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 border-gray-300"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-orange-500 border-gray-300"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-12 transform -translate-y-1/2"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <EyeIcon className="w-6 h-6 text-gray-500" />
                ) : (
                  <EyeSlashIcon className="w-6 h-6 text-gray-500" />
                )}
              </button>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contact_number"
                placeholder="+1234567890"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 border-gray-300"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-all"
          >
            Signup
          </button>
          <p className="mt-4 text-center text-gray-600 text-sm">
            Already have an account?
            <Link
              to="/login"
              className="text-orange-600 font-medium hover:underline"
            >
              {" "}
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VenueOwnerSignup;
