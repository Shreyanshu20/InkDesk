import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ProductFormFields from "./ProductFormFields";
import ProductImageUpload from "./ProductImageUpload";
import { useAdmin } from "../../../Context/AdminContext.jsx";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function ProductForm({ mode: propMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAdmin();
  const isAdmin = user?.role === "admin";

  const [mode, setMode] = useState(propMode || "add");
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
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
  const [touchedFields, setTouchedFields] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();

    if (id && (mode === "edit" || propMode === "edit")) {
      setMode("edit");
      fetchProduct(id);
    }
  }, [id, propMode, mode]);

  useEffect(() => {
    if (formData.category && categories.length > 0) {
      const selectedCategory = categories.find(
        (cat) => cat.name === formData.category
      );
      if (selectedCategory) {
        fetchSubcategoriesByCategory(selectedCategory.id);
      }
    } else {
      setFilteredSubcategories([]);
      setFormData((prev) => ({ ...prev, subcategory: "" }));
    }
  }, [formData.category, categories]);

  useEffect(() => {
    if (Object.keys(touchedFields).length > 0) {
      const newErrors = {};

      Object.keys(touchedFields).forEach((fieldName) => {
        if (touchedFields[fieldName]) {
          const error = validateField(fieldName, formData[fieldName]);
          if (error) {
            newErrors[fieldName] = error;
          }
        }
      });

      if (touchedFields.images && uploadedImages.length === 0) {
        newErrors.images = "At least one product image is required";
      }

      setErrors(newErrors);
    }
  }, [formData, uploadedImages, touchedFields]);

  const fetchSubcategoriesByCategory = async (categoryId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/categories/subcategories/${categoryId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setFilteredSubcategories(response.data.subcategories);

        if (formData.subcategory) {
          const isValidSubcategory = response.data.subcategories.some(
            (sub) => sub.subcategory_name === formData.subcategory
          );
          if (!isValidSubcategory) {
            setFormData((prev) => ({ ...prev, subcategory: "" }));
          }
        }
      } else {
        setFilteredSubcategories([]);
      }
    } catch (error) {
      setFilteredSubcategories([]);
      
      if (error.response?.status === 404 && subcategories.length > 0) {
        const filtered = subcategories.filter(sub => sub.category_id === categoryId);
        setFilteredSubcategories(filtered);
      }
    }
  };

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
      toast.error("Failed to load categories");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/subcategories`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        setSubcategories(response.data.subcategories);
      }
    } catch (error) {
      toast.error("Failed to load subcategories");
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/products/${productId}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

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

        if (
          product.product_images &&
          Array.isArray(product.product_images) &&
          product.product_images.length > 0
        ) {
          const processedImages = product.product_images.map((img) => ({
            url: img.url || img,
            public_id: img.public_id || "",
            alt_text: img.alt_text || "",
          }));
          setUploadedImages(processedImages);
          setPreviewImages(processedImages.map((img) => img.url));
        } else if (product.product_image) {
          const singleImageObj = {
            url: product.product_image,
            public_id: "",
            alt_text: "",
          };
          setUploadedImages([singleImageObj]);
          setPreviewImages([product.product_image]);
        } else {
          setUploadedImages([]);
          setPreviewImages([]);
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(
          "Product not found or you don't have permission to edit it"
        );
      } else if (error.response?.status === 401) {
        toast.error("Please login to edit products");
      } else {
        toast.error("Failed to load product");
      }
      navigate("/admin/products");
    }
  };

  const validateField = (name, value) => {
    const trimmedValue = typeof value === "string" ? value.trim() : value;

    switch (name) {
      case "name":
        if (!trimmedValue) return "Product name is required";
        if (trimmedValue.length < 3)
          return "Product name must be at least 3 characters";
        if (trimmedValue.length > 100)
          return "Product name must not exceed 100 characters";
        return null;

      case "description":
        if (!trimmedValue) return "Description is required";
        if (trimmedValue.length < 10)
          return "Description must be at least 10 characters";
        if (trimmedValue.length > 1000)
          return "Description must not exceed 1000 characters";
        return null;

      case "price":
        if (!value) return "Price is required";
        const price = parseFloat(value);
        if (isNaN(price)) return "Price must be a valid number";
        if (price <= 0) return "Price must be greater than 0";
        if (price > 1000000) return "Price seems to high";
        return null;

      case "stock":
        if (value === "" || value === null || value === undefined)
          return "Stock quantity is required";
        const stock = parseInt(value);
        if (isNaN(stock)) return "Stock must be a valid number";
        if (stock < 0) return "Stock cannot be negative";
        if (stock > 100000) return "Stock quantity seems to high";
        return null;

      case "category":
        if (!trimmedValue) return "Category is required";
        return null;

      case "subcategory":
        if (!trimmedValue) return "Subcategory is required";
        return null;

      case "brand":
        if (!trimmedValue) return "Brand is required";
        if (trimmedValue.length < 2)
          return "Brand name must be at least 2 characters";
        if (trimmedValue.length > 50)
          return "Brand name must not exceed 50 characters";
        return null;

      case "discount":
        if (value && value !== "") {
          const discount = parseFloat(value);
          if (isNaN(discount)) return "Discount must be a valid number";
          if (discount < 0) return "Discount cannot be negative";
          if (discount > 100) return "Discount cannot exceed 100%";
        }
        return null;

      case "rating":
        if (value && value !== "") {
          const rating = parseFloat(value);
          if (isNaN(rating)) return "Rating must be a valid number";
          if (rating < 0) return "Rating cannot be negative";
          if (rating > 5) return "Rating cannot exceed 5";
        }
        return null;

      default:
        return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    setFormTouched(true);
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "name",
      "description",
      "price",
      "stock",
      "category",
      "subcategory",
      "brand",
    ];

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    ["discount", "rating"].forEach((field) => {
      if (formData[field] && formData[field] !== "") {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    if (!uploadedImages || uploadedImages.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    if (formData.discount && formData.price) {
      const price = parseFloat(formData.price);
      const discount = parseFloat(formData.discount);
      if (discount >= price) {
        newErrors.discount =
          "Discount cannot be equal to or greater than price";
      }
    }

    setErrors(newErrors);
    setTouchedFields(
      Object.fromEntries(requiredFields.map((field) => [field, true]))
    );
    if (!uploadedImages || uploadedImages.length === 0) {
      setTouchedFields((prev) => ({ ...prev, images: true }));
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required to save products.");
      return;
    }

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const element =
        document.getElementById(firstErrorField) ||
        document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const processedImages = uploadedImages.map((img) => ({
        url: img.url || img,
        public_id: img.public_id || "",
        alt_text: img.alt_text || "",
      }));

      const productData = {
        product_name: formData.name.trim(),
        product_description: formData.description.trim(),
        product_price: parseFloat(formData.price),
        product_stock: parseInt(formData.stock),
        product_category: formData.category.trim(),
        product_subcategory: formData.subcategory.trim(),
        product_brand: formData.brand.trim(),
        product_discount: formData.discount ? parseFloat(formData.discount) : 0,
        product_rating: formData.rating ? parseFloat(formData.rating) : 0,
        product_images: processedImages,
        product_image: processedImages.length > 0 ? processedImages[0].url : "",
      };

      let response;
      if (mode === "add") {
        response = await axios.post(`${API_BASE_URL}/admin/products`, productData, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.put(
          `${API_BASE_URL}/admin/products/${id}`,
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
        navigate(`/admin/products?t=${Date.now()}`);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("You can only modify your own products");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          `Failed to ${mode === "add" ? "create" : "update"} product`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formTouched) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    navigate("/admin/products");
  };

  const handleImageUploadSuccess = () => {
    if (errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

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
        className="bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 p-6"
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
                        <li key={field}>
                          <button
                            type="button"
                            onClick={() => {
                              const element =
                                document.getElementById(field) ||
                                document.querySelector(`[name="${field}"]`);
                              if (element) {
                                element.focus();
                                element.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                              }
                            }}
                            className="hover:underline focus:outline-none focus:underline text-left"
                          >
                            {message}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ProductFormFields
            formData={formData}
            errors={errors}
            categories={categories}
            subcategories={filteredSubcategories}
            handleInputChange={handleInputChange}
            handleFieldBlur={handleFieldBlur}
            touchedFields={touchedFields}
          />

          <ProductImageUpload
            previewImages={previewImages}
            setPreviewImages={setPreviewImages}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            error={errors.images}
            touched={touchedFields.images}
            onUploadSuccess={handleImageUploadSuccess}
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
                <span>{mode === "add" ? "Adding..." : "Updating..."}</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                {mode === "edit" ? "Update Product" : "Create Product"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;