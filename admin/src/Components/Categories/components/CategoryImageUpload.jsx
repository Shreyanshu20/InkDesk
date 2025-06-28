import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAdmin } from "../../../Context/AdminContext";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function CategoryImageUpload({
  previewImage,
  setPreviewImage,
  uploadedImage,
  setUploadedImage,
  error,
  formTouched,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const { user, adminData } = useAdmin();
  const isAdmin = adminData?.role === "admin";

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const file = files[0];

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload only JPG, PNG, or WebP images");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("images", file);

      const response = await axios.post(
        `${API_BASE_URL}/upload/category-images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success && response.data.images.length > 0) {
        const uploadedImg = response.data.images[0];
        setUploadedImage(uploadedImg);
        setPreviewImage(uploadedImg.url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to upload images");
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = async () => {
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required to remove images.");
      return;
    }

    try {
      if (uploadedImage?.public_id) {
        await axios.delete(
          `${API_BASE_URL}/upload/category-images/${uploadedImage.public_id}`,
          { withCredentials: true }
        );
      }

      setUploadedImage(null);
      setPreviewImage("");
      toast.success("Image removed successfully");
    } catch (error) {
      toast.error("Failed to remove image");
    }
  };

  const handleFileSelect = (e) => {
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required to upload images.");
      e.target.value = "";
      return;
    }
    handleImageUpload(e);
  };

  return (
    <div className="space-y-4">
      {!isAdmin && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">
            <i className="fas fa-lock text-red-500 dark:text-red-400 mr-2"></i>
            Image upload is restricted to admin users only.
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category Image
        </label>

        {!previewImage ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              uploading
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : formTouched && error
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-primary"
            } ${!isAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() =>
              !uploading && isAdmin && fileInputRef.current?.click()
            }
          >
            {uploading ? (
              <>
                <i className="fas fa-spinner fa-spin text-3xl text-blue-500 mb-2"></i>
                <p className="text-blue-600 dark:text-blue-400 mb-1">
                  Uploading image...
                </p>
              </>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  {!isAdmin
                    ? "Upload restricted to admin users"
                    : "Click to upload category image"}
                </p>
              </>
            )}

            <p className="text-sm text-gray-500">JPG, PNG, or WebP (max 5MB)</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading || !isAdmin}
            />
          </div>
        ) : (
          <div className="relative group">
            <img
              src={previewImage}
              alt="Category preview"
              className="w-full h-64 object-cover rounded-xl shadow-md border border-gray-200 dark:border-gray-600"
            />
            {isAdmin && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        )}

        {formTouched && error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}

export default CategoryImageUpload;