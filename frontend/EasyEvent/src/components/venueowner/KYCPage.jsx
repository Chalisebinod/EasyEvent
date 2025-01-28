import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KYCPage = () => {
  const navigate = useNavigate();

  // File inputs and state
  const fileInputRefs = {
    profile: useRef(null),
    citizenshipFront: useRef(null),
    citizenshipBack: useRef(null),
    pan: useRef(null),
    map: useRef(null),
    signature: useRef(null),
  };

  const [imageFiles, setImageFiles] = useState({
    profile: null,
    citizenshipFront: null,
    citizenshipBack: null,
    pan: null,
    map: null,
    signature: null,
  });

  const [imageUrls, setImageUrls] = useState({
    profile: "",
    citizenshipFront: "",
    citizenshipBack: "",
    pan: "",
    map: "",
    signature: "",
  });

  // Form data for text inputs
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
  });

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(imageUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [imageUrls]);

  // Handle file uploads
  const handleFileUpload = (key, e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file && (!allowedTypes.includes(file.type) || file.size > maxSize)) {
      alert("Invalid file. Only JPG, PNG, and PDF files under 5MB are allowed.");
      return;
    }

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrls((prevUrls) => ({ ...prevUrls, [key]: imageUrl }));
      setImageFiles((prevFiles) => ({ ...prevFiles, [key]: file }));
    }
  };

  const handleFileClick = (key) => {
    fileInputRefs[key].current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form
  const handleSubmit = async () => {
    // Validate required fields
    const { name, phone, dob, gender } = formData;
    if (!name || !phone || !dob || !gender) {
      alert("Please fill in all required fields.");
      return;
    }

    // Validate required files
    if (!imageFiles.profile || !imageFiles.citizenshipFront) {
      alert("Please upload all required documents.");
      return;
    }

    // Prepare FormData for submission
    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("phone", phone);
    formDataToSend.append("dob", dob);
    formDataToSend.append("gender", gender);

    // Append files
    Object.keys(imageFiles).forEach((key) => {
      if (imageFiles[key]) {
        formDataToSend.append(key, imageFiles[key]);
      }
    });

    try {
      const response = await axios.put("http://localhost:8000/api/kyc", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("KYC updated successfully!");
        navigate("/"); // Redirect to home or another page
      }
    } catch (error) {
      console.error("Error updating KYC:", error);
      alert(`Error updating KYC: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="w-full flex justify-between items-center px-8 bg-white py-4 shadow-md sticky top-0">
        <h1 className="text-2xl font-bold text-orange-600">EasyEvent</h1>
        <button
          onClick={() => navigate("/")}
          className="text-sm font-semibold text-orange-600 border border-orange-600 px-4 py-2 rounded-lg hover:bg-orange-600 hover:text-white transition-colors"
        >
          Back to Home
        </button>
      </div>

      <div className="flex-grow bg-gray-50 py-10">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center text-orange-600">
            KYC Verification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {["name", "phone", "dob", "gender"].map((key) => (
              <div key={key}>
                <label className="block text-gray-700 font-medium mb-2 capitalize">
                  {key === "dob" ? "Date of Birth" : key}:
                </label>
                <input
                  type={key === "dob" ? "date" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300"
                  required
                />
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-orange-600 text-center mb-8">
            Upload Your Documents
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.keys(fileInputRefs).map((key) => (
              <div
                key={key}
                className="text-center p-4 bg-white rounded-lg shadow-md"
              >
                <h6 className="text-gray-700 font-medium text-sm mb-2 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </h6>

                <div className="mb-4 w-36 h-36 mx-auto border border-gray-300 rounded-md flex items-center justify-center bg-gray-100">
                  {imageUrls[key] && (
                    <img
                      className="w-full h-full object-cover rounded-md"
                      src={imageUrls[key]}
                      alt={key}
                    />
                  )}
                </div>

                <button
                  onClick={() => handleFileClick(key)}
                  className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition"
                >
                  Upload
                </button>

                <input
                  type="file"
                  ref={fileInputRefs[key]}
                  onChange={(e) => handleFileUpload(key, e)}
                  className="hidden"
                  accept="image/*,application/pdf"
                />
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-orange-600 text-white py-3 px-8 rounded-md font-semibold text-lg hover:bg-orange-700 transition"
            >
              Submit KYC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;
