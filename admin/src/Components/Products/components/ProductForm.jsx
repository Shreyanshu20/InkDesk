import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Changed from react-hot-toast
import ProductFormFields from "./ProductFormFields";
import ProductImageUpload from "./ProductImageUpload";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function ProductForm({ mode: propMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState(propMode || "add");
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
    brand: "",
    discount: "",
    rating: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // Fetch categories and product data
  useEffect(() => {
    fetchCategories();

    if (id && (mode === "edit" || propMode === "edit")) {
      setMode("edit");
      fetchProduct(id);
    }
  }, [id, propMode, mode]);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      if (response.data.success) {
        const transformedCategories = response.data.categories.map(
          (category) => ({
            id: category._id,
            name: category.category_name,
          })
        );
        setCategories(transformedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories"); // react-toastify
    }
  };

  // Fetch product for editing
  const fetchProduct = async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
      if (response.data.success) {
        const product = response.data.product;

        setProduct(product);
        setFormData({
          name: product.product_name || "",
          description: product.product_description || "",
          price: product.product_price?.toString() || "",
          stock: product.product_stock?.toString() || "",
          category: product.product_category || "",
          subcategory: product.product_subcategory || "",
          brand: product.product_brand || "",
          discount: product.product_discount?.toString() || "",
          rating: product.product_rating?.toString() || "",
          status: product.product_stock > 0 ? "active" : "out_of_stock",
        });

        // Handle both new multiple images and old single image format
        if (
          product.product_images &&
          Array.isArray(product.product_images) &&
          product.product_images.length > 0
        ) {
          // New format - process to ensure consistent structure
          const processedImages = product.product_images.map((img) => ({
            url: img.url || img,
            public_id: img.public_id || "", // Handle missing public_id
            alt_text: img.alt_text || "",
          }));
          setUploadedImages(processedImages);
          setPreviewImages(processedImages.map((img) => img.url));
        } else if (product.product_image) {
          // Old format - single image
          const singleImageObj = {
            url: product.product_image,
            public_id: "", // Old images don't have public_id
            alt_text: "",
          };
          setUploadedImages([singleImageObj]);
          setPreviewImages([product.product_image]);
        } else {
          // No images
          setUploadedImages([]);
          setPreviewImages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
      navigate("/admin/products");
    }
  };

  // Validate field
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() ? null : "Product name is required";
      case "description":
        return value.trim() ? null : "Description is required";
      case "price":
        if (!value) return "Price is required";
        if (isNaN(value)) return "Price must be a number";
        if (Number(value) < 0) return "Price cannot be negative";
        return null;
      case "stock":
        if (!value) return "Stock quantity is required";
        if (isNaN(value)) return "Stock must be a number";
        if (Number(value) < 0) return "Stock cannot be negative";
        return null;
      case "category":
        return value ? null : "Category is required";
      default:
        return null;
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    setFormTouched(true);

    if (formTouched) {
      const fieldError = validateField(name, fieldValue);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (uploadedImages.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormTouched(true);

    if (!validateForm()) {
      const firstErrorField = document.querySelector(".error-field");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorField.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Process uploadedImages to ensure proper structure
      const processedImages = uploadedImages.map((img) => ({
        url: img.url || img,
        public_id: img.public_id || "", // Ensure public_id exists (can be empty string)
        alt_text: img.alt_text || "",
      }));

      const productData = {
        product_name: formData.name,
        product_description: formData.description,
        product_price: parseFloat(formData.price),
        product_stock: parseInt(formData.stock),
        product_category: formData.category,
        product_subcategory: formData.subcategory || "",
        product_brand: formData.brand || "",
        product_discount: parseFloat(formData.discount) || 0,
        product_rating: parseFloat(formData.rating) || 0,
        product_images: processedImages, // Use processed images
        product_image: processedImages.length > 0 ? processedImages[0].url : "", // Backward compatibility
      };

      console.log("Sending product data:", productData); // Debug log

      let response;
      if (mode === "add") {
        response = await axios.post(`${API_BASE_URL}/products`, productData, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.put(
          `${API_BASE_URL}/products/${id}`,
          productData,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (response.data.success) {
        toast.success(
          `Product ${mode === "add" ? "created" : "updated"} successfully!`
        );

        // Force refresh with timestamp
        const timestamp = Date.now();
        navigate(`/admin/products?t=${timestamp}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      console.error("Error details:", error.response?.data); // More detailed error log

      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("You can only modify your own products");
      } else {
        toast.error(
          `Failed to ${mode === "add" ? "create" : "update"} product`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (formTouched) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    navigate("/admin/products");
  };

  // Handle image change
  const handleImageChange = (newImages) => {
    setPreviewImages(newImages);

    if (newImages.length > 0 && errors.images) {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors.images;
        return updatedErrors;
      });
    }
  };

  // Check for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formTouched) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formTouched]);

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-100 dark:bg-gray-900">
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary mr-4 focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1"
          aria-label="Go back to products list"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {mode === "add" ? "Add New Product" : "Edit Product"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 p-6"
        noValidate
      >
        {/* Form error summary */}
        {Object.keys(errors).length > 0 && formTouched && (
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
                        <li key={field}>
                          <a
                            href={`#${field}`}
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById(field)?.focus();
                            }}
                            className="hover:underline focus:outline-none focus:underline"
                          >
                            {message}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column */}
          <ProductFormFields
            formData={formData}
            errors={errors}
            categories={categories}
            handleInputChange={handleInputChange}
            formTouched={formTouched}
          />

          {/* Right Column */}
          <ProductImageUpload
            previewImages={previewImages}
            setPreviewImages={setPreviewImages}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            error={errors.images}
            formTouched={formTouched}
          />
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
            className="px-5 py-2.5 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>{mode === "add" ? "Adding..." : "Updating..."}</span>
              </>
            ) : (
              <span>{mode === "add" ? "Add Product" : "Update Product"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
export default ProductForm;
