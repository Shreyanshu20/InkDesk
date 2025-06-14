import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function ProductImageUpload({
  previewImages,
  setPreviewImages,
  uploadedImages,
  setUploadedImages,
  error,
  touched,
  onUploadSuccess,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState({});

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Validate file types
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error("Please upload only JPG, PNG, or WebP images");
      return;
    }

    // Validate file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error("Images must be smaller than 5MB");
      return;
    }

    // Check total images limit (max 6 images)
    const currentImageCount = Array.isArray(uploadedImages)
      ? uploadedImages.length
      : 0;
    if (currentImageCount + files.length > 6) {
      toast.error("Maximum 6 images allowed per product");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      console.log("📤 Uploading files:", files.map((f) => f.name));

      const response = await axios.post(
        `${API_BASE_URL}/upload/product-images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const newImages = response.data.images;
        const currentUploaded = Array.isArray(uploadedImages)
          ? uploadedImages
          : [];
        const currentPreviews = Array.isArray(previewImages)
          ? previewImages
          : [];

        console.log("✅ Upload successful:", newImages);

        setUploadedImages([...currentUploaded, ...newImages]);
        setPreviewImages([
          ...currentPreviews,
          ...newImages.map((img) => img.url),
        ]);

        // Notify parent component of successful upload
        if (onUploadSuccess) {
          onUploadSuccess();
        }

        toast.success(`${newImages.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to upload images");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to upload images. Please try again.");
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = async (index) => {
    const currentUploaded = Array.isArray(uploadedImages)
      ? uploadedImages
      : [];
    const currentPreviews = Array.isArray(previewImages) ? previewImages : [];

    if (index < 0 || index >= currentUploaded.length) {
      toast.error("Invalid image index");
      return;
    }

    const imageToRemove = currentUploaded[index];

    // Set deleting state for this specific image
    setDeleting((prev) => ({ ...prev, [index]: true }));

    try {
      console.log("🗑️ Removing image at index:", index, imageToRemove);

      // Only attempt to delete from Cloudinary if we have a public_id
      if (imageToRemove?.public_id && imageToRemove.public_id.trim() !== "") {
        console.log(
          "🗑️ Deleting from Cloudinary with public_id:",
          imageToRemove.public_id
        );

        try {
          const deleteResponse = await axios.delete(
            `${API_BASE_URL}/upload/product-images/${encodeURIComponent(
              imageToRemove.public_id
            )}`,
            {
              withCredentials: true,
              timeout: 10000, // 10 second timeout
            }
          );

          console.log("✅ Cloudinary deletion response:", deleteResponse.data);
        } catch (deleteError) {
          console.warn(
            "⚠️ Failed to delete from Cloudinary (continuing anyway):",
            deleteError.response?.data || deleteError.message
          );
          // Continue with local removal even if Cloudinary deletion fails
        }
      } else {
        console.log("ℹ️ No public_id found, skipping Cloudinary deletion");
      }

      // Remove from local arrays regardless of Cloudinary deletion result
      const newUploadedImages = currentUploaded.filter((_, i) => i !== index);
      const newPreviewImages = currentPreviews.filter((_, i) => i !== index);

      setUploadedImages(newUploadedImages);
      setPreviewImages(newPreviewImages);

      toast.success("Image removed successfully");
    } catch (error) {
      console.error("❌ Error removing image:", error);
      toast.error("Failed to remove image. Please try again.");
    } finally {
      // Clear deleting state
      setDeleting((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    }
  };

  // Safe array handling
  const safeUploadedImages = Array.isArray(uploadedImages)
    ? uploadedImages
    : [];
  const safePreviewImages = Array.isArray(previewImages) ? previewImages : [];
  const hasError = touched && error;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Product Images<span className="text-red-500">*</span>
          <span className="text-sm text-gray-500 ml-2">
            ({safeUploadedImages.length}/6 images)
          </span>
        </label>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            uploading
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : hasError
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-primary"
          } ${
            safeUploadedImages.length >= 6
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={() =>
            !uploading &&
            safeUploadedImages.length < 6 &&
            fileInputRef.current?.click()
          }
        >
          {uploading ? (
            <>
              <i className="fas fa-spinner fa-spin text-3xl text-blue-500 mb-2"></i>
              <p className="text-blue-600 dark:text-blue-400 mb-1">
                Uploading images...
              </p>
            </>
          ) : (
            <>
              <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
              <p className="text-gray-700 dark:text-gray-300 mb-1">
                {safeUploadedImages.length >= 6
                  ? "Maximum images reached"
                  : "Click to upload images"}
              </p>
            </>
          )}

          <p className="text-sm text-gray-500">
            JPG, PNG, or WebP (max 5MB each, up to 6 images)
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading || safeUploadedImages.length >= 6}
          />
        </div>

        {hasError && (
          <p
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            <i className="fas fa-exclamation-circle mr-1"></i>
            {error}
          </p>
        )}
      </div>

      {safePreviewImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Uploaded Images ({safePreviewImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {safePreviewImages.map((preview, index) => (
              <div key={`${preview}-${index}`} className="relative group">
                <img
                  src={preview}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                  loading="lazy"
                />

                {/* Loading overlay for deletion */}
                {deleting[index] && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin text-white text-xl"></i>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={deleting[index]}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Remove image ${index + 1}`}
                >
                  {deleting[index] ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    "×"
                  )}
                </button>

                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}

                {/* Debug info in development */}
                {process.env.NODE_ENV === "development" &&
                  safeUploadedImages[index]?.public_id && (
                    <div
                      className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded max-w-20 truncate"
                      title={safeUploadedImages[index].public_id}
                    >
                      ID:{" "}
                      {safeUploadedImages[index].public_id.split("/").pop()}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image management info */}
      {safeUploadedImages.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>• First image will be used as the main product image</p>
          <p>• You can upload up to 6 images per product</p>
          <p>• Supported formats: JPG, PNG, WebP (max 5MB each)</p>
        </div>
      )}
    </div>
  );
}

export default ProductImageUpload;
