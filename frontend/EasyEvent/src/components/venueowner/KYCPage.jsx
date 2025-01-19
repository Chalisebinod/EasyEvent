import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const KYCPage = () => {
  const navigate = useNavigate();

  const fileInputRefs = {
    profile: useRef(null),
    citizenship: useRef(null),
    pan: useRef(null),
    map: useRef(null),
    signature: useRef(null),
  };

  const [imageUrls, setImageUrls] = useState({
    profile: "https://via.placeholder.com/150/DDD/888?text=Profile",
    citizenship: "https://via.placeholder.com/150/DDD/888?text=Citizenship",
    pan: "https://via.placeholder.com/150/DDD/888?text=PAN+Card",
    map: "https://via.placeholder.com/150/DDD/888?text=Map",
    signature: "https://via.placeholder.com/150/DDD/888?text=Signature",
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
  });

  const handleFileUpload = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrls((prevUrls) => ({ ...prevUrls, [key]: imageUrl }));
    }
  };

  const handleFileClick = (key) => {
    fileInputRefs[key].current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigateToLandingPage = () => {
    navigate("/"); // Adjust this route to your landing page path
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Sticky Header */}
      <div className="w-full flex justify-between items-center px-8 bg-white py-4 shadow-lg sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-orange-600">EasyEvent</h1>
        <button
          onClick={navigateToLandingPage}
          className="text-sm font-semibold text-orange-600 border border-orange-600 px-4 py-2 rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-300"
        >
          Back to Landing Page
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-9 mt-1 w-full max-w-4xl mx-auto">
          {/* Personal Information */}
          <h1 className="text-xl font-bold mb-6">KYC Verification</h1>
          <h6 className="text-xl font-semibold text-orange-500 mb-6">
            Personal Information
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 border border-gray-300 rounded-lg p-6 bg-gray-50 shadow-sm">
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Full Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg border-zinc-400"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Phone Number:
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg border-zinc-400"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Date of Birth:
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg border-zinc-400"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Gender:
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={handleInputChange}
                    className="mr-2"
                  />{" "}
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={handleInputChange}
                    className="mr-2"
                  />{" "}
                  Female
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    onChange={handleInputChange}
                    className="mr-2"
                  />{" "}
                  Other
                </label>
              </div>
            </div>
          </div>

          {/* Identity Details */}
          <h6 className="text-xl font-semibold text-orange-500 mb-6">
            Identity Details
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {[
              { label: "Profile Photo", key: "profile" },
              { label: "Citizenship Document", key: "citizenship" },
              { label: "PAN Card", key: "pan" },
              { label: "Location Map", key: "map" },
              { label: "Signature", key: "signature" },
            ].map(({ label, key }) => (
              <div
                key={key}
                className="border rounded-lg border-zinc-400 bg-zinc-400 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col items-center p-6">
                  <img
                    src={imageUrls[key]}
                    alt={label}
                    className="w-full max-h-40 object-cover rounded-lg"
                  />
                </div>
                <div className="flex justify-around items-center p-4">
                  <button
                    className="px-4 py-1 text-sm text-white bg-orange-500 rounded-lg hover:bg-red-500"
                    onClick={() => handleFileClick(key)}
                  >
                    Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRefs[key]}
                    className="hidden"
                    onChange={(e) => handleFileUpload(key, e)}
                  />
                  <button
                    className="px-4 py-1 text-sm text-white border border-white-500 rounded-lg hover:bg-orange-500 hover:text-white"
                    onClick={() => handleFileClick(key)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Confirmation */}
          <div className="flex items-center space-x-2 mb-8">
            <input type="checkbox" className="h-4 w-4 border rounded-md" />
            <label className="text-sm text-gray-600">
              All provided information is accurate and genuine.
            </label>
          </div>

          {/* Submit */}
          <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;
