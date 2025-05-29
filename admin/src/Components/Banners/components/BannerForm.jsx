import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function BannerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    location: "homepage-carousel",
    position: 1,
    url: "",
    buttonText: "",
    textPosition: "center",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const [imageOption, setImageOption] = useState("url"); // "url" or "upload"
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch banner data if editing
  useEffect(() => {
    if (isEditing) {
      fetchBanner();
    } else {
      // Set default dates for new banner
      const now = new Date();
      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      setFormData((prev) => ({
        ...prev,
        startDate: now.toISOString().slice(0, 16),
        endDate: nextMonth.toISOString().slice(0, 16),
      }));
    }
  }, [id, isEditing]);

  // Update image preview when image URL or file changes
  useEffect(() => {
    if (imageOption === "url" && formData.image) {
      setImagePreview(formData.image);
    } else if (imageOption === "upload" && imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreview("");
    }
  }, [formData.image, imageFile, imageOption]);

  const fetchBanner = async () => {
    setIsLoading(true);
    try {
      const token =
        localStorage.getItem("token") ||
        document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

      const response = await fetch(`${API_BASE_URL}/banners/admin/${id}`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        const banner = data.banner;
        setFormData({
          title: banner.title || "",
          subtitle: banner.subtitle || "",
          image: banner.image || "",
          location: banner.location || "homepage-carousel",
          position: banner.position || 1,
          url: banner.url || "",
          buttonText: banner.buttonText || "",
          textPosition: banner.textPosition || "center",
          startDate: banner.startDate
            ? new Date(banner.startDate).toISOString().slice(0, 16)
            : "",
          endDate: banner.endDate
            ? new Date(banner.endDate).toISOString().slice(0, 16)
            : "",
          isActive: banner.isActive !== undefined ? banner.isActive : true,
        });

        // If banner has an image, set it as URL option
        if (banner.image) {
          setImageOption("url");
        }
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageOptionChange = (option) => {
    setImageOption(option);
    if (option === "url") {
      setImageFile(null);
    } else {
      setFormData((prev) => ({ ...prev, image: "" }));
    }
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }));
        return;
      }

      setImageFile(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token =
        localStorage.getItem("token") ||
        document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return data.imageUrl;
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      throw new Error("Failed to upload image: " + error.message);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    if (imageOption === "url" && !formData.image.trim()) {
      newErrors.image = "Image URL is required";
    } else if (imageOption === "upload" && !imageFile && !formData.image) {
      newErrors.image = "Please select an image file";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.image;

      // Upload image if using file upload option
      if (imageOption === "upload" && imageFile) {
        imageUrl = await uploadImage(imageFile);
        toast.success("Image uploaded successfully! 📸");
      }

      const bannerData = {
        ...formData,
        image: imageUrl,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      const token =
        localStorage.getItem("token") ||
        document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

      const url = isEditing
        ? `${API_BASE_URL}/banners/admin/${id}`
        : `${API_BASE_URL}/banners/admin`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bannerData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          isEditing
            ? "Banner updated successfully! 🎉"
            : "Banner created successfully! 🎉"
        );
        setTimeout(() => {
          navigate("/admin/banners");
        }, 1500); // Delay navigation to show toast
      } else {
        setErrors({ submit: data.message || "Failed to save banner" });
        toast.error("Failed to save banner");
      }
    } catch (error) {
      setErrors({ submit: "Failed to save banner: " + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <i className="fas fa-spinner fa-spin text-primary text-2xl mb-2"></i>
            <p className="text-gray-500 dark:text-gray-400">
              Loading banner...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin/banners")}
            className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? "Edit Banner" : "Create New Banner"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isEditing
                ? "Update banner details"
                : "Add a new promotional banner"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Enter banner title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subtitle"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Subtitle
                    </label>
                    <input
                      type="text"
                      id="subtitle"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Enter banner subtitle"
                    />
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Banner Image
                </h3>

                {/* Image Option Toggle */}
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => handleImageOptionChange("url")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      imageOption === "url"
                        ? "bg-primary text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <i className="fas fa-link mr-2"></i>
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImageOptionChange("upload")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      imageOption === "upload"
                        ? "bg-primary text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <i className="fas fa-upload mr-2"></i>
                    Upload Image
                  </button>
                </div>

                {/* Image URL Input */}
                {imageOption === "url" && (
                  <div>
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Image URL *
                    </label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                {/* File Upload */}
                {imageOption === "upload" && (
                  <div>
                    <label
                      htmlFor="imageFile"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Upload Image *
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl"></i>
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="imageFile"
                            className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="imageFile"
                              name="imageFile"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </div>
                    </div>
                    {imageFile && (
                      <p className="mt-2 text-sm text-green-600">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>
                )}

                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              {/* Banner Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Banner Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Location *
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    >
                      <option value="homepage-carousel">
                        Homepage Carousel
                      </option>
                      <option value="homepage">Homepage Discount Banner</option>
                      <option value="newsletter">Newsletter Banner</option>
                      <option value="advertisement">
                        Advertisement Banner
                      </option>
                    </select>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="position"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Position
                    </label>
                    <input
                      type="number"
                      id="position"
                      name="position"
                      min="1"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="textPosition"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Text Position
                    </label>
                    <select
                      id="textPosition"
                      name="textPosition"
                      value={formData.textPosition}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Call to Action
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="url"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Link URL
                    </label>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="https://example.com/page"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="buttonText"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Button Text
                    </label>
                    <input
                      type="text"
                      id="buttonText"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Learn More"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Schedule
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Active (banner will be displayed when within schedule)
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <i className="fas fa-exclamation-circle text-red-400 mr-2 mt-0.5"></i>
                    <div className="text-sm text-red-700">{errors.submit}</div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate("/admin/banners")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <i
                        className={`fas ${
                          isEditing ? "fa-save" : "fa-plus"
                        } mr-2`}
                      ></i>
                      {isEditing ? "Update Banner" : "Create Banner"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Preview
            </h3>

            {imagePreview ? (
              <div className="space-y-4">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={imagePreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center">
                    <i className="fas fa-exclamation-triangle text-red-400 text-2xl"></i>
                    <span className="ml-2 text-red-600">Invalid image URL</span>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {formData.title || "Banner Title"}
                  </h4>
                  {formData.subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formData.subtitle}
                    </p>
                  )}
                  {formData.buttonText && (
                    <button className="mt-3 px-4 py-2 bg-primary text-white text-sm rounded-md">
                      {formData.buttonText}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-image text-gray-400 text-3xl mb-2"></i>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Add an image to see preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerForm;
