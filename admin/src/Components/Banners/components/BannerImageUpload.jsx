import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "../../../Context/AdminContext.jsx";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function BannerImageUpload({
  fieldName,
  label,
  required,
  currentOption,
  currentFile,
  currentFormValue,
  onOptionChange,
  onFileChange,
  onFormChange,
  error,
  isDesktop = true,
  imagePreview
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { adminData } = useAdmin();
  const isAdmin = adminData?.role === "admin";

  const handleFileSelect = (e) => {
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required to upload images.");
      e.target.value = ""; // Clear the file input
      return;
    }
    
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      onFileChange(e);
    }
  };

  const handleOptionSelect = (option) => {
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required to change image options.");
      return;
    }
    onOptionChange(option);
  };

  const handleFormValueChange = (e) => {
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required to modify image URLs.");
      return;
    }
    onFormChange(e);
  };

  return (
    <div>
      {/* Admin warning for non-admin users */}
      {!isAdmin && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">
            <i className="fas fa-lock text-red-500 dark:text-red-400 mr-2"></i>
            Image upload is restricted to admin users only.
          </p>
        </div>
      )}

      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
        {label} {required && "*"}
      </h4>

      {/* Option buttons */}
      <div className="flex space-x-3 mb-4">
        <button
          type="button"
          onClick={() => handleOptionSelect("url")}
          disabled={!isAdmin}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            currentOption === "url"
              ? "bg-primary text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          } ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <i className="fas fa-link mr-2"></i>
          Image URL
        </button>
        <button
          type="button"
          onClick={() => handleOptionSelect("upload")}
          disabled={!isAdmin}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            currentOption === "upload"
              ? "bg-primary text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          } ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <i className="fas fa-upload mr-2"></i>
          Upload Image
        </button>
      </div>

      {/* URL input */}
      {currentOption === "url" && (
        <div>
          <input
            type="url"
            name={fieldName}
            value={currentFormValue}
            onChange={handleFormValueChange}
            required={required && currentOption === "url"}
            disabled={!isAdmin}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text dark:bg-gray-700 dark:text-white ${
              error 
                ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={isDesktop ? "Desktop image URL" : "Mobile image URL"}
          />
        </div>
      )}

      {/* File upload */}
      {currentOption === "upload" && (
        <div>
          <div 
            className={`mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
              error 
                ? 'border-red-300 dark:border-red-600' 
                : 'border-gray-300 dark:border-gray-600'
            } ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}`}
            onClick={() => isAdmin && fileInputRef.current?.click()}
          >
            <div className="space-y-1 text-center">
              {uploading ? (
                <i className="fas fa-spinner fa-spin text-2xl text-primary"></i>
              ) : (
                <i className="fas fa-cloud-upload-alt text-gray-400 text-2xl"></i>
              )}
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-primary">
                  {uploading 
                    ? `Uploading ${isDesktop ? 'desktop' : 'mobile'} image...`
                    : `Upload ${isDesktop ? 'desktop' : 'mobile'} image`
                  }
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, WEBP up to 5MB
              </p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={!isAdmin || uploading}
            className="sr-only"
          />

          {currentFile && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {currentFile.name}
            </p>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-1 flex items-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-sm mr-1"></i>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="mt-4">
          <div className="relative">
            <img
              src={imagePreview}
              alt={`${isDesktop ? 'Desktop' : 'Mobile'} preview`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="hidden w-full h-32 items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
              <i className="fas fa-exclamation-triangle text-red-400 text-xl"></i>
              <span className="ml-2 text-red-600 text-sm">Invalid image URL</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BannerImageUpload;