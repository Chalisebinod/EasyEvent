import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VenueSidebar from "./VenueSideBar";

const KYCPage = () => {
  const navigate = useNavigate();
  const fileInputRefs = useRef({});
  const [loading, setLoading] = useState(false);

  // To store preview URLs for individual document uploads
  const [docPreviewUrls, setDocPreviewUrls] = useState({});
  // To store the actual file objects for required documents
  const [docFiles, setDocFiles] = useState({});

  // Venue images (should be exactly 2 or 3)
  const [venueImages, setVenueImages] = useState([]);
  const [venueImagesUrls, setVenueImagesUrls] = useState([]);

  // Form values for venue details
  const [formValues, setFormValues] = useState({
    venueName: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  // List of required file fields
  const fileFields = [
    "profile",
    "citizenshipFront",
    "citizenshipBack",
    "pan",
    "map",
    "signature",
  ];

  // Cleanup created object URLs on unmount or when URLs change
  useEffect(() => {
    return () => {
      Object.values(docPreviewUrls).forEach(
        (url) => url && URL.revokeObjectURL(url)
      );
      venueImagesUrls.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [docPreviewUrls, venueImagesUrls]);

  // Handle input changes for venue information
  const handleInputChange = (e) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle file changes for individual documents or for venue images
  const handleFileChange = (field, e, multiple = false) => {
    if (multiple) {
      const files = Array.from(e.target.files);
      // Limit the maximum allowed to 3 files, ignore any extras
      if (files.length > 3) {
        alert("Please select a maximum of 3 venue images.");
        return;
      }
      const urls = files.map((file) => URL.createObjectURL(file));
      setVenueImages(files);
      setVenueImagesUrls(urls);
    } else {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type and size (5MB max)
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 5 * 1024 * 1024;
      if (!allowedTypes.includes(file.type) || file.size > maxSize) {
        alert("Invalid file! Only JPG, PNG, and PDF under 5MB are allowed.");
        return;
      }
      const url = URL.createObjectURL(file);
      setDocPreviewUrls((prev) => ({ ...prev, [field]: url }));
      setDocFiles((prev) => ({ ...prev, [field]: file }));
    }
  };

  // Handle form submission to send the KYC data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { venueName, address, city, state, zip_code } = formValues;
    if (!venueName || !address || !city || !state || !zip_code) {
      alert("Please fill in all required venue details.");
      return;
    }

    // Check that required documents are uploaded
    if (
      !docFiles.profile ||
      !docFiles.citizenshipFront ||
      !docFiles.citizenshipBack ||
      !docFiles.pan ||
      !docFiles.map ||
      !docFiles.signature
    ) {
      alert("Please upload all required documents.");
      return;
    }

    // Validate that the user has selected exactly 2 or 3 venue images.
    if (venueImages.length < 2 || venueImages.length > 3) {
      alert("Please upload exactly 2 or 3 venue images.");
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();

    // Append venue details
    formDataToSend.append("venueName", venueName);
    const venueAddress = { address, city, state, zip_code };
    formDataToSend.append("venueAddress", JSON.stringify(venueAddress));

    // Append required document files
    fileFields.forEach((field) => {
      if (docFiles[field]) {
        formDataToSend.append(field, docFiles[field]);
      }
    });

    // Append venue images (exactly 2 or 3)
    venueImages.forEach((file) => {
      formDataToSend.append("venueImages", file);
    });

    // Log the formData before sending
    console.log("Form Data to Send:", formDataToSend);

    try {
      const token = localStorage.getItem("access_token"); // Get access token from localStorage (or sessionStorage, or state)

      const response = await axios.post(
        "http://localhost:8000/api/kyc/post",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Send access token as Bearer token
          },
        }
      );

      if (response.status === 200) {
        alert("KYC updated successfully!");
        navigate("/venue-owner-dashboard");
      }
    } catch (error) {
      alert(
        `Error updating KYC: ${error.response?.data?.error || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <VenueSidebar />
      <div className="flex-grow">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">EasyEvent</h1>
          <button
            onClick={() => navigate("/")}
            className="text-orange-600 border border-orange-600 px-4 py-2 rounded hover:bg-orange-600 hover:text-white transition"
          >
            Back to Home
          </button>
        </header>
        <main className="p-8 bg-gray-50">
          <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-orange-600 mb-4 text-center">
              KYC Verification
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Venue Information Section */}
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Venue Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      htmlFor="venueName"
                      className="block text-gray-700 font-medium"
                    >
                      Venue Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="venueName"
                      name="venueName"
                      value={formValues.venueName}
                      onChange={handleInputChange}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-gray-700 font-medium"
                    >
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formValues.address}
                      onChange={handleInputChange}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-gray-700 font-medium"
                      >
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formValues.city}
                        onChange={handleInputChange}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-gray-700 font-medium"
                      >
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formValues.state}
                        onChange={handleInputChange}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="zip_code"
                        className="block text-gray-700 font-medium"
                      >
                        Zip Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="zip_code"
                        name="zip_code"
                        value={formValues.zip_code}
                        onChange={handleInputChange}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Document Upload Section */}
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Upload Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fileFields.map((field) => (
                    <div
                      key={field}
                      className="flex flex-col items-center border p-4 rounded-md"
                    >
                      <label className="mb-2 text-gray-700 font-medium capitalize">
                        {field.replace(/([A-Z])/g, " $1")}
                      </label>
                      <div className="w-32 h-32 border border-dashed border-gray-300 flex items-center justify-center mb-2 rounded-md bg-gray-100">
                        {docPreviewUrls[field] ? (
                          <img
                            src={docPreviewUrls[field]}
                            alt={field}
                            className="object-cover w-full h-full rounded-md"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">No file</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[field]?.click()}
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                      >
                        Upload
                      </button>
                      <input
                        type="file"
                        ref={(el) => (fileInputRefs.current[field] = el)}
                        onChange={(e) => handleFileChange(field, e)}
                        className="hidden"
                        accept="image/*,application/pdf"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Venue Images (Required 2 or 3) */}
              {/* Venue Images Section */}
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Upload Venue Images <span className="text-red-500">*</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Venue Image 1 */}
                  <div className="flex flex-col items-center border p-4 rounded-md">
                    <label className="mb-2 text-gray-700 font-medium">
                      Venue Image 1
                    </label>
                    <div className="w-32 h-32 border border-dashed border-gray-300 flex items-center justify-center mb-2 rounded-md bg-gray-100">
                      {venueImagesUrls[0] ? (
                        <img
                          src={venueImagesUrls[0]}
                          alt="Venue Image 1"
                          className="object-cover w-full h-full rounded-md"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No file</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRefs.current["venueImage1"]?.click()
                      }
                      className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                    >
                      Upload Image 1
                    </button>
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current["venueImage1"] = el)}
                      onChange={(e) => handleFileChange("venueImage1", e)}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  {/* Venue Image 2 */}
                  <div className="flex flex-col items-center border p-4 rounded-md">
                    <label className="mb-2 text-gray-700 font-medium">
                      Venue Image 2
                    </label>
                    <div className="w-32 h-32 border border-dashed border-gray-300 flex items-center justify-center mb-2 rounded-md bg-gray-100">
                      {venueImagesUrls[1] ? (
                        <img
                          src={venueImagesUrls[1]}
                          alt="Venue Image 2"
                          className="object-cover w-full h-full rounded-md"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No file</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRefs.current["venueImage2"]?.click()
                      }
                      className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                    >
                      Upload Image 2
                    </button>
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current["venueImage2"] = el)}
                      onChange={(e) => handleFileChange("venueImage2", e)}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  {/* Venue Image 3 */}
                  <div className="flex flex-col items-center border p-4 rounded-md">
                    <label className="mb-2 text-gray-700 font-medium">
                      Venue Image 3
                    </label>
                    <div className="w-32 h-32 border border-dashed border-gray-300 flex items-center justify-center mb-2 rounded-md bg-gray-100">
                      {venueImagesUrls[2] ? (
                        <img
                          src={venueImagesUrls[2]}
                          alt="Venue Image 3"
                          className="object-cover w-full h-full rounded-md"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No file</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRefs.current["venueImage3"]?.click()
                      }
                      className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                    >
                      Upload Image 3
                    </button>
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current["venueImage3"] = el)}
                      onChange={(e) => handleFileChange("venueImage3", e)}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>
                <small className="mt-2 text-gray-500">
                  Please upload exactly 3 images.
                </small>
              </section>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-700 transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit KYC"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KYCPage;
