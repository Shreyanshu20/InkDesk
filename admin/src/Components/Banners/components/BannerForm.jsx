import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdmin } from "../../../Context/AdminContext";
import BannerFormFields from "./BannerFormFields";
import BannerImageUpload from "./BannerImageUpload";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function BannerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { adminData } = useAdmin();
  const isAdmin = adminData?.role === "admin";

  const checkAdminAccess = (action) => {
    if (isAdmin) {
      return true;
    } else {
      toast.error(`Access denied. Admin privileges required to ${action}.`);
      return false;
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
      },
    },
    homepage: {
      name: "Discount Banner",
      description:
        "Email collection banner with discount offer (no CTA needed - email input is built-in)",
      fields: {
        title: { required: true, label: "Discount Title" },
        subtitle: { required: false, label: "Discount Description" },
        image: { required: false, label: "Background Image (optional)" },
        position: { required: true, label: "Display Order" },
      },
    },
    advertisement: {
      name: "Advertisement Banner",
      description:
        "Image-only advertisement that redirects to shop page (supports responsive images)",
      fields: {
        title: {
          required: false,
          label: "Advertisement Name (internal use only)",
        },
        image: { required: true, label: "Desktop Image (≥1024px)" },
        mobileImage: { required: true, label: "Mobile Image (<1024px)" },
        url: { required: true, label: "Redirect URL" },
        position: { required: true, label: "Display Order" },
      },
    },
  };

  const currentBannerType =
    bannerTypes[formData.location] || bannerTypes["homepage-carousel"];

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
    if (!shouldShowField("subtitle")) {
      setFormData((prev) => ({ ...prev, subtitle: "" }));
    }
    if (!shouldShowField("url")) {
      setFormData((prev) => ({ ...prev, url: "" }));
    }
    if (!shouldShowField("buttonText")) {
      setFormData((prev) => ({ ...prev, buttonText: "" }));
    }
    if (!shouldShowField("textPosition")) {
      setFormData((prev) => ({ ...prev, textPosition: "center" }));
    }
    if (!shouldShowField("mobileImage")) {
      setFormData((prev) => ({ ...prev, mobileImage: "" }));
      setMobileImageFile(null);
      setMobileImagePreview("");
    }

    if (formData.location === "advertisement" && !formData.url) {
      setFormData((prev) => ({ ...prev, url: "/shop" }));
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

  const uploadImage = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append("images", file);

    try {
      const token =
        localStorage.getItem("token") ||
        document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

      const response = await fetch(`${API_BASE_URL}/upload/banner-image`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        return data.images && data.images.length > 0
          ? data.images[0].url
          : data.image?.url;
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      throw new Error("Failed to upload image: " + error.message);
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

  const validateForm = () => {
    const newErrors = {};

    Object.entries(currentBannerType.fields).forEach(([fieldName, config]) => {
      if (config.required) {
        if (fieldName === "image") {
          if (imageOption === "url" && !formData.image.trim()) {
            newErrors.image = `${config.label} is required`;
          } else if (
            imageOption === "upload" &&
            !imageFile &&
            !formData.image
          ) {
            newErrors.image = "Please select an image file";
          }
        } else if (fieldName === "mobileImage") {
          if (mobileImageOption === "url" && !formData.mobileImage.trim()) {
            newErrors.mobileImage = `${config.label} is required`;
          } else if (
            mobileImageOption === "upload" &&
            !mobileImageFile &&
            !formData.mobileImage
          ) {
            newErrors.mobileImage = "Please select a mobile image file";
          }
        } else if (
          !formData[fieldName] ||
          formData[fieldName].toString().trim() === ""
        ) {
          newErrors[fieldName] = `${config.label} is required`;
        }
      }
    });

    if (formData.location === "advertisement") {
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

    const action = isEditing ? "update banners" : "create banners";
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

      if (shouldShowField("subtitle") && formData.subtitle) {
        bannerData.subtitle = formData.subtitle;
      }
      if (shouldShowField("url") && formData.url) {
        bannerData.url = formData.url;
      }
      if (shouldShowField("buttonText") && formData.buttonText) {
        bannerData.buttonText = formData.buttonText;
      }
      if (shouldShowField("textPosition")) {
        bannerData.textPosition = formData.textPosition;
      }
      if (shouldShowField("mobileImage") && mobileImageUrl) {
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
        if (response.status === 403) {
          toast.error(`Access denied. Admin privileges required to ${action}.`);
        } else {
          setErrors({ submit: data.message || "Failed to save banner" });
          toast.error("Failed to save banner");
        }
      }
    } catch (error) {
      console.error("Error saving banner:", error);

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

  const handleCancel = () => {
    navigate("/admin/banners");
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-background min-h-screen">
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
    <div className="container mx-auto px-4 py-6 bg-background">
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary mr-4 focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1"
          aria-label="Go back to banners list"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {isEditing ? "Edit Banner" : "Create New Banner"}
        </h1>
      </div>

      {!isAdmin && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div className="flex">
            <i className="fas fa-exclamation-triangle text-red-500 dark:text-red-400 mr-2 text-lg"></i>
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
              You are viewing this form in read-only mode. Admin privileges are
              required to save changes.
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 p-6"
        noValidate
      >
        {Object.keys(errors).length > 0 && (
          <div
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4"
            role="alert"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-circle text-red-600 dark:text-red-400"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Please correct the following errors:
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(errors)
                      .filter(([_, message]) => message)
                      .map(([field, message]) => (
                        <li key={field}>{message}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <BannerFormFields
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            shouldShowField={shouldShowField}
            isFieldRequired={isFieldRequired}
            getFieldLabel={getFieldLabel}
            currentBannerType={currentBannerType}
          />

          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {formData.location === "advertisement"
                ? "Advertisement Images"
                : "Banner Images"}
            </h2>

            {formData.location === "advertisement" ? (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <i className="fas fa-desktop text-blue-500 mr-2"></i>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Desktop Image (screens ≥1024px)
                    </span>
                  </div>
                  <BannerImageUpload
                    fieldName="image"
                    label={getFieldLabel("image")}
                    required={isFieldRequired("image")}
                    currentOption={imageOption}
                    currentFile={imageFile}
                    currentFormValue={formData.image}
                    onOptionChange={handleImageOptionChange}
                    onFileChange={handleFileChange}
                    onFormChange={handleChange}
                    error={errors.image}
                    isDesktop={true}
                    imagePreview={imagePreview}
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <i className="fas fa-mobile-alt text-green-500 mr-2"></i>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mobile Image (screens &lt;1024px)
                    </span>
                  </div>
                  <BannerImageUpload
                    fieldName="mobileImage"
                    label={getFieldLabel("mobileImage")}
                    required={isFieldRequired("mobileImage")}
                    currentOption={mobileImageOption}
                    currentFile={mobileImageFile}
                    currentFormValue={formData.mobileImage}
                    onOptionChange={handleMobileImageOptionChange}
                    onFileChange={handleMobileFileChange}
                    onFormChange={handleChange}
                    error={errors.mobileImage}
                    isDesktop={false}
                    imagePreview={mobileImagePreview}
                  />
                </div>
              </div>
            ) : (
              shouldShowField("image") && (
                <BannerImageUpload
                  fieldName="image"
                  label={getFieldLabel("image")}
                  required={isFieldRequired("image")}
                  currentOption={imageOption}
                  currentFile={imageFile}
                  currentFormValue={formData.image}
                  onOptionChange={handleImageOptionChange}
                  onFileChange={handleFileChange}
                  onFormChange={handleChange}
                  error={errors.image}
                  isDesktop={true}
                  imagePreview={imagePreview}
                />
              )
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isAdmin}
            className={`px-6 py-2 rounded-md flex items-center gap-2 ${
              isAdmin
                ? "bg-primary hover:bg-primary/90 text-white"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>{isEditing ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                {isEditing ? "Update Banner" : "Create Banner"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BannerForm;
