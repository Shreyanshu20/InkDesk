import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdmin } from '../../../context/AdminContext';

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function BannerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { adminData } = useAdmin(); // Get current user from context
  const isAdmin = adminData?.role === 'admin';

  // Add role check function
  const checkAdminAccess = (action) => {
    if (isAdmin) {
      return true; // Admin can do everything
    } else {
      toast.error(`Access denied. Admin privileges required to ${action}.`);
      return false; // User is restricted
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    mobileImage: "",
    location: "homepage-carousel",
    position: 1,
    url: "",
    buttonText: "",
    textPosition: "center",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const [imageOption, setImageOption] = useState("url");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
  const [mobileImageOption, setMobileImageOption] = useState("url");
  const [mobileImageFile, setMobileImageFile] = useState(null);
  const [mobileImagePreview, setMobileImagePreview] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Banner type configurations (newsletter completely removed)
  const bannerTypes = {
    "homepage-carousel": {
      name: "Homepage Carousel",
      description: "Full-featured banner for the homepage carousel",
      fields: {
        title: { required: true, label: "Banner Title" },
        subtitle: { required: false, label: "Banner Subtitle" },
        image: { required: true, label: "Banner Image" },
        url: { required: false, label: "Link URL" },
        buttonText: { required: false, label: "Button Text" },
        textPosition: { required: true, label: "Text Position" },
        position: { required: true, label: "Display Order" },
      }
    },
    "homepage": {
      name: "Discount Banner",
      description: "Email collection banner with discount offer (no CTA needed - email input is built-in)",
      fields: {
        title: { required: true, label: "Discount Title" },
        subtitle: { required: false, label: "Discount Description" },
        image: { required: false, label: "Background Image (optional)" },
        position: { required: true, label: "Display Order" },
      }
    },
    "advertisement": {
      name: "Advertisement Banner",
      description: "Image-only advertisement that redirects to shop page (supports responsive images)",
      fields: {
        title: { required: false, label: "Advertisement Name (internal use only)" },
        image: { required: true, label: "Desktop Image (≥1024px)" },
        mobileImage: { required: true, label: "Mobile Image (<1024px)" },
        url: { required: true, label: "Redirect URL" },
        position: { required: true, label: "Display Order" },
      }
    }
  };

  const currentBannerType = bannerTypes[formData.location] || bannerTypes["homepage-carousel"];

  const shouldShowField = (fieldName) => {
    return currentBannerType.fields.hasOwnProperty(fieldName);
  };

  const isFieldRequired = (fieldName) => {
    return currentBannerType.fields[fieldName]?.required || false;
  };

  const getFieldLabel = (fieldName) => {
    return currentBannerType.fields[fieldName]?.label || fieldName;
  };

  useEffect(() => {
    if (isEditing) {
      fetchBanner();
    } else {
      const now = new Date();
      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      setFormData((prev) => ({
        ...prev,
        startDate: now.toISOString().slice(0, 16),
        endDate: nextMonth.toISOString().slice(0, 16),
      }));
    }
  }, [id, isEditing]);

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

  useEffect(() => {
    if (mobileImageOption === "url" && formData.mobileImage) {
      setMobileImagePreview(formData.mobileImage);
    } else if (mobileImageOption === "upload" && mobileImageFile) {
      const objectUrl = URL.createObjectURL(mobileImageFile);
      setMobileImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setMobileImagePreview("");
    }
  }, [formData.mobileImage, mobileImageFile, mobileImageOption]);

  useEffect(() => {
    if (!shouldShowField('subtitle')) {
      setFormData(prev => ({ ...prev, subtitle: "" }));
    }
    if (!shouldShowField('url')) {
      setFormData(prev => ({ ...prev, url: "" }));
    }
    if (!shouldShowField('buttonText')) {
      setFormData(prev => ({ ...prev, buttonText: "" }));
    }
    if (!shouldShowField('textPosition')) {
      setFormData(prev => ({ ...prev, textPosition: "center" }));
    }
    if (!shouldShowField('mobileImage')) {
      setFormData(prev => ({ ...prev, mobileImage: "" }));
      setMobileImageFile(null);
      setMobileImagePreview("");
    }
    
    if (formData.location === 'advertisement' && !formData.url) {
      setFormData(prev => ({ ...prev, url: "/shop" }));
    }
  }, [formData.location]);

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
          mobileImage: banner.mobileImage || "",
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

        if (banner.image) {
          setImageOption("url");
        }
        if (banner.mobileImage) {
          setMobileImageOption("url");
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

  const handleMobileImageOptionChange = (option) => {
    setMobileImageOption(option);
    if (option === "url") {
      setMobileImageFile(null);
    } else {
      setFormData((prev) => ({ ...prev, mobileImage: "" }));
    }
    setErrors((prev) => ({ ...prev, mobileImage: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

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

  const handleMobileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          mobileImage: "Please select a valid image file",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          mobileImage: "Image size must be less than 5MB",
        }));
        return;
      }

      setMobileImageFile(file);
      setErrors((prev) => ({ ...prev, mobileImage: "" }));
    }
  };

  const uploadImage = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append("images", file); // Changed from "image" to "images" to match other components

    try {
      const token =
        localStorage.getItem("token") ||
        document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

      // FIX: Use the same path as other upload components
      const response = await fetch(`${API_BASE_URL}/api/upload/category-images`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        // Handle response format from category-images endpoint
        return data.images && data.images.length > 0 ? data.images[0].url : data.image?.url;
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      throw new Error("Failed to upload image: " + error.message);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(currentBannerType.fields).forEach(([fieldName, config]) => {
      if (config.required) {
        if (fieldName === 'image') {
          if (imageOption === "url" && !formData.image.trim()) {
            newErrors.image = `${config.label} is required`;
          } else if (imageOption === "upload" && !imageFile && !formData.image) {
            newErrors.image = "Please select an image file";
          }
        } else if (fieldName === 'mobileImage') {
          if (mobileImageOption === "url" && !formData.mobileImage.trim()) {
            newErrors.mobileImage = `${config.label} is required`;
          } else if (mobileImageOption === "upload" && !mobileImageFile && !formData.mobileImage) {
            newErrors.mobileImage = "Please select a mobile image file";
          }
        } else if (!formData[fieldName] || formData[fieldName].toString().trim() === "") {
          newErrors[fieldName] = `${config.label} is required`;
        }
      }
    });

    if (formData.location === 'advertisement') {
      if (!formData.url || !formData.url.trim()) {
        newErrors.url = "Redirect URL is required for advertisement banners";
      }
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

    // Check admin access before submission
    const action = isEditing ? 'update banners' : 'create banners';
    if (!checkAdminAccess(action)) return;

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.image;
      let mobileImageUrl = formData.mobileImage;

      if (imageOption === "upload" && imageFile) {
        imageUrl = await uploadImage(imageFile);
        toast.success("Desktop image uploaded successfully! 📸");
      }

      if (mobileImageOption === "upload" && mobileImageFile) {
        mobileImageUrl = await uploadImage(mobileImageFile);
        toast.success("Mobile image uploaded successfully! 📱");
      }

      const bannerData = {
        title: formData.title,
        location: formData.location,
        image: imageUrl,
        position: formData.position,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        isActive: formData.isActive,
      };

      if (shouldShowField('subtitle') && formData.subtitle) {
        bannerData.subtitle = formData.subtitle;
      }
      if (shouldShowField('url') && formData.url) {
        bannerData.url = formData.url;
      }
      if (shouldShowField('buttonText') && formData.buttonText) {
        bannerData.buttonText = formData.buttonText;
      }
      if (shouldShowField('textPosition')) {
        bannerData.textPosition = formData.textPosition;
      }
      if (shouldShowField('mobileImage') && mobileImageUrl) {
        bannerData.mobileImage = mobileImageUrl;
      }

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
        }, 1500);
      } else {
        // Handle specific error cases
        if (response.status === 403) {
          toast.error(`Access denied. Admin privileges required to ${action}.`);
        } else {
          setErrors({ submit: data.message || "Failed to save banner" });
          toast.error("Failed to save banner");
        }
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      
      // Handle network errors
      if (error.response?.status === 403) {
        toast.error(`Access denied. Admin privileges required to ${action}.`);
      } else {
        setErrors({ submit: "Failed to save banner: " + error.message });
        toast.error("Failed to save banner");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderImageUploadSection = (
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
    isDesktop = true
  ) => (
    <div>
      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
        {label} {required && "*"}
      </h4>

      <div className="flex space-x-3 mb-4">
        <button
          type="button"
          onClick={() => onOptionChange("url")}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            currentOption === "url"
              ? "bg-primary text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          <i className="fas fa-link mr-2"></i>
          Image URL
        </button>
        <button
          type="button"
          onClick={() => onOptionChange("upload")}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            currentOption === "upload"
              ? "bg-primary text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          <i className="fas fa-upload mr-2"></i>
          Upload Image
        </button>
      </div>

      {currentOption === "url" && (
        <div>
          <input
            type="url"
            name={fieldName}
            value={currentFormValue}
            onChange={onFormChange}
            required={required && currentOption === "url"}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            placeholder={isDesktop ? "Desktop image URL" : "Mobile image URL"}
          />
        </div>
      )}

      {currentOption === "upload" && (
        <div>
          <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <i className="fas fa-cloud-upload-alt text-gray-400 text-2xl"></i>
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                  <span>Upload {isDesktop ? 'desktop' : 'mobile'} image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, WEBP up to 5MB
              </p>
            </div>
          </div>
          {currentFile && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {currentFile.name}
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );

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
      {/* Remove the warning banner - users can access the form */}
      {/* Show a subtle info banner instead */}
      {!isAdmin && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <div className="flex items-center">
            <i className="fas fa-info-circle text-blue-400 mr-2"></i>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              You can view and explore this form. Admin privileges are required to save changes.
            </p>
          </div>
        </div>
      )}

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
                ? `Update ${currentBannerType.name.toLowerCase()}`
                : `Add a new ${currentBannerType.name.toLowerCase()}`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Banner Type
                </h3>
                <div className="mb-3">
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  >
                    <option value="homepage-carousel">Homepage Carousel</option>
                    <option value="homepage">Discount Banner</option>
                    <option value="advertisement">Advertisement Banner</option>
                  </select>
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>{currentBannerType.name}:</strong> {currentBannerType.description}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shouldShowField('title') && (
                    <div className={shouldShowField('subtitle') ? "" : "md:col-span-2"}>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {getFieldLabel('title')} {isFieldRequired('title') && "*"}
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required={isFieldRequired('title')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        placeholder={
                          formData.location === 'advertisement' 
                            ? "Internal name for this advertisement"
                            : `Enter ${getFieldLabel('title').toLowerCase()}`
                        }
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.title}
                        </p>
                      )}
                    </div>
                  )}

                  {shouldShowField('subtitle') && (
                    <div>
                      <label
                        htmlFor="subtitle"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {getFieldLabel('subtitle')} {isFieldRequired('subtitle') && "*"}
                      </label>
                      <input
                        type="text"
                        id="subtitle"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        required={isFieldRequired('subtitle')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        placeholder={`Enter ${getFieldLabel('subtitle').toLowerCase()}`}
                      />
                      {errors.subtitle && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {(shouldShowField('image') || shouldShowField('mobileImage')) && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {formData.location === 'advertisement' ? 'Advertisement Images' : 'Banner Image'} 
                    {(isFieldRequired('image') || isFieldRequired('mobileImage')) && "*"}
                  </h3>

                  {formData.location === 'advertisement' ? (
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <i className="fas fa-desktop text-blue-500 mr-2"></i>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Desktop Image (screens ≥1024px)
                          </span>
                        </div>
                        {renderImageUploadSection(
                          'image',
                          getFieldLabel('image'),
                          isFieldRequired('image'),
                          imageOption,
                          imageFile,
                          formData.image,
                          handleImageOptionChange,
                          handleFileChange,
                          handleChange,
                          errors.image,
                          true
                        )}
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <i className="fas fa-mobile-alt text-green-500 mr-2"></i>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mobile Image (screens less than 1024px)
                          </span>
                        </div>
                        {renderImageUploadSection(
                          'mobileImage',
                          getFieldLabel('mobileImage'),
                          isFieldRequired('mobileImage'),
                          mobileImageOption,
                          mobileImageFile,
                          formData.mobileImage,
                          handleMobileImageOptionChange,
                          handleMobileFileChange,
                          handleChange,
                          errors.mobileImage,
                          false
                        )}
                      </div>
                    </div>
                  ) : (
                    shouldShowField('image') && renderImageUploadSection(
                      'image',
                      getFieldLabel('image'),
                      isFieldRequired('image'),
                      imageOption,
                      imageFile,
                      formData.image,
                      handleImageOptionChange,
                      handleFileChange,
                      handleChange,
                      errors.image,
                      true
                    )
                  )}
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Banner Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {shouldShowField('position') && (
                    <div>
                      <label
                        htmlFor="position"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {getFieldLabel('position')} {isFieldRequired('position') && "*"}
                      </label>
                      <input
                        type="number"
                        id="position"
                        name="position"
                        min="1"
                        value={formData.position}
                        onChange={handleChange}
                        required={isFieldRequired('position')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                      {errors.position && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.position}
                        </p>
                      )}
                    </div>
                  )}

                  {shouldShowField('textPosition') && (
                    <div>
                      <label
                        htmlFor="textPosition"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {getFieldLabel('textPosition')} {isFieldRequired('textPosition') && "*"}
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
                  )}
                </div>
              </div>

              {(shouldShowField('url') || shouldShowField('buttonText')) && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {formData.location === 'advertisement' ? 'Redirect Settings' : 'Call to Action'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shouldShowField('url') && (
                      <div>
                        <label
                          htmlFor="url"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          {getFieldLabel('url')} {isFieldRequired('url') && "*"}
                        </label>
                        <input
                          type="url"
                          id="url"
                          name="url"
                          value={formData.url}
                          onChange={handleChange}
                          required={isFieldRequired('url')}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          placeholder={
                            formData.location === 'advertisement' 
                              ? "/shop" 
                              : "https://example.com/page"
                          }
                        />
                        {formData.location === 'advertisement' && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Users will be redirected here when they click the advertisement
                          </p>
                        )}
                        {errors.url && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.url}
                          </p>
                        )}
                      </div>
                    )}

                    {shouldShowField('buttonText') && (
                      <div>
                        <label
                          htmlFor="buttonText"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          {getFieldLabel('buttonText')} {isFieldRequired('buttonText') && "*"}
                        </label>
                        <input
                          type="text"
                          id="buttonText"
                          name="buttonText"
                          value={formData.buttonText}
                          onChange={handleChange}
                          required={isFieldRequired('buttonText')}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          placeholder="Learn More"
                        />
                        {errors.buttonText && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.buttonText}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                      required
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
                      required
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

              {errors.submit && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <i className="fas fa-exclamation-circle text-red-400 mr-2 mt-0.5"></i>
                    <div className="text-sm text-red-700">{errors.submit}</div>
                  </div>
                </div>
              )}

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
                  disabled={isSubmitting} // Remove the !isAdmin disable condition
                  className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                    isAdmin 
                      ? 'bg-primary hover:bg-primary-dark text-white' 
                      : 'bg-primary hover:bg-primary-dark text-white opacity-90' // Show as normal button for users
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  // Remove the onClick toast for non-admin
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

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Preview
            </h3>

            {formData.location === 'advertisement' ? (
              <div className="space-y-4">
                {imagePreview && (
                  <div>
                    <div className="flex items-center mb-2">
                      <i className="fas fa-desktop text-blue-500 mr-2"></i>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Desktop (≥1024px)
                      </span>
                    </div>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={imagePreview}
                        alt="Desktop advertisement preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {mobileImagePreview && (
                  <div>
                    <div className="flex items-center mb-2">
                      <i className="fas fa-mobile-alt text-green-500 mr-2"></i>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mobile (less than 1024px)
                      </span>
                    </div>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={mobileImagePreview}
                        alt="Mobile advertisement preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {formData.url && (
                  <p className="text-xs text-gray-400 text-center">
                    Redirects to: {formData.url}
                  </p>
                )}
              </div>
            ) : (
              <>
                {imagePreview && shouldShowField('image') ? (
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
                      {formData.subtitle && shouldShowField('subtitle') && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formData.subtitle}
                        </p>
                      )}
                      {formData.buttonText && shouldShowField('buttonText') && (
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
                        {shouldShowField('image') ? "Add an image to see preview" : `${currentBannerType.name} Preview`}
                      </p>
                      {formData.title && (
                        <p className="text-gray-700 dark:text-gray-300 mt-2 font-medium">
                          {formData.title}
                        </p>
                      )}
                      {formData.subtitle && shouldShowField('subtitle') && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          {formData.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <p><strong>Type:</strong> {currentBannerType.name}</p>
                <p><strong>Location:</strong> {formData.location}</p>
                {shouldShowField('position') && (
                  <p><strong>Position:</strong> {formData.position}</p>
                )}
                {formData.location === 'advertisement' && (
                  <p><strong>Responsive:</strong> Desktop + Mobile images</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerForm;