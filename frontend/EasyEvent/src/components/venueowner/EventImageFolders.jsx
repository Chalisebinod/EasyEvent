import React, { useState, useRef } from "react";
import { FaPlus, FaTrash, FaFolder, FaUpload } from "react-icons/fa";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import VenueSidebar from "./VenueSidebar";
import "tailwindcss/tailwind.css";

// Generate 50 placeholder images for each folder
const generateImages = (folderKey) => {
  return Array.from({ length: 50 }, (_, idx) => ({
    id: Date.now() + idx,
    url: `https://picsum.photos/200/200?random=${idx}&folder=${folderKey}`,
    name: `Image ${idx + 1}`,
  }));
};

// Example data structure for images
const initialImages = {
  wedding: generateImages("wedding"),
  bartabanda: generateImages("bartabanda"),
  cooperative: generateImages("cooperative"),
  birthday: generateImages("birthday"),
  others: generateImages("others"),
};

// Folders you want to show; note that color property is no longer used.
const eventFolders = [
  { label: "Wedding", key: "wedding" },
  { label: "Bartabanda", key: "bartabanda" },
  { label: "Cooperative", key: "cooperative" },
  { label: "Birthday", key: "birthday" },
  { label: "Others", key: "others" },
];

function EventImageFolders() {
  const [activeFolder, setActiveFolder] = useState(null);
  const [imagesByFolder, setImagesByFolder] = useState(initialImages);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);

  const fileInputRefs = useRef({});

  const openFolder = (folderKey) => {
    setActiveFolder(folderKey);
    setCurrentPage(1);
  };

  const closeFolder = () => {
    setActiveFolder(null);
    setCurrentPage(1);
  };

  const handleUploadClick = (folderKey, e) => {
    e.stopPropagation(); // Prevent the folder click event from triggering
    fileInputRefs.current[folderKey]?.click();
  };

  const handleFileChange = (folderKey, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type) || file.size > maxSize) {
        alert("Invalid file! Only JPG/PNG under 5MB are allowed.");
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    const newImages = validFiles.map((file, idx) => ({
      id: Date.now() + idx,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setImagesByFolder((prev) => ({
      ...prev,
      [folderKey]: [...prev[folderKey], ...newImages],
    }));

    e.target.value = "";
  };

  const openPreview = (img) => {
    setPreviewImage(img);
    setShowPreview(true);
  };

  const handleDelete = (folderKey, imgId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    setImagesByFolder((prev) => ({
      ...prev,
      [folderKey]: prev[folderKey].filter((img) => img.id !== imgId),
    }));
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewImage(null);
  };

  const itemsPerPage = 25;
  const currentImages = activeFolder
    ? imagesByFolder[activeFolder].slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const totalPages = activeFolder
    ? Math.ceil(imagesByFolder[activeFolder].length / itemsPerPage)
    : 1;

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const toggleImageSelection = (imgId) => {
    setSelectedImages((prev) =>
      prev.includes(imgId)
        ? prev.filter((id) => id !== imgId)
        : [...prev, imgId]
    );
  };

  const handleBulkDelete = () => {
    if (!window.confirm("Are you sure you want to delete selected images?"))
      return;
    setImagesByFolder((prev) => ({
      ...prev,
      [activeFolder]: prev[activeFolder].filter(
        (img) => !selectedImages.includes(img.id)
      ),
    }));
    setSelectedImages([]);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <VenueSidebar />

      <div className="flex-1 p-6 md:p-10">
        {!activeFolder && (
          <>
            <h1 className="text-3xl mb-20 font-bold text-gray-800 dark:text-white mb-12 text-center">
              Completed Events
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventFolders.map((folder) => (
                <div
                  key={folder.key}
                  className="relative bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 border border-gray-200"
                  onClick={() => openFolder(folder.key)}
                >
                  <FaFolder className="text-gray-700 w-16 h-16 mb-4" />
                  <div className="text-xl font-bold text-gray-700 text-center">
                    {folder.label}
                  </div>
                  <div
                    className="absolute right-6 top-6 group"
                    onClick={(e) => handleUploadClick(folder.key, e)}
                  >
                    <button className="bg-gray-100 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center shadow hover:bg-gray-200 transition">
                      <FaUpload size={20} />
                    </button>
                    <div className="absolute -top-8 right-0 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      Upload Images
                    </div>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={(el) => (fileInputRefs.current[folder.key] = el)}
                    accept="image/*"
                    onChange={(e) => handleFileChange(folder.key, e)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {activeFolder && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={closeFolder}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                &larr; Back
              </button>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center capitalize flex-1">
                {eventFolders.find((f) => f.key === activeFolder)?.label} Images
              </h2>
              {selectedImages.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete Selected
                </button>
              )}
            </div>

            <div className="grid grid-cols-5 gap-6">
              {currentImages.map((img) => (
                <div
                  key={img.id}
                  className="relative group border rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-32 object-cover cursor-pointer"
                    onClick={() => openPreview(img)}
                  />
                  <button
                    onClick={() => handleDelete(activeFolder, img.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <FaTrash size={14} />
                  </button>
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(img.id)}
                    onChange={() => toggleImageSelection(img.id)}
                    className="absolute top-2 left-2"
                  />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center disabled:opacity-50 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  <AiOutlineLeft className="mr-1" />
                  Prev
                </button>
                <span className="text-gray-700 dark:text-white font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center disabled:opacity-50 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Next
                  <AiOutlineRight className="ml-1" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showPreview && previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-3xl w-full max-h-full overflow-auto">
            <button
              onClick={closePreview}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition"
            >
              ✕
            </button>
            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="w-full h-auto object-contain rounded-lg"
            />
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
              {previewImage.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventImageFolders;
