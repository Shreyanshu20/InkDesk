import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CategoryImageUpload from "./CategoryImageUpload";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function CategoryForm({ mode: propMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const mode = propMode || (id ? "edit" : "add");

  const [formData, setFormData] = useState({
    name: "",
    subcategories: [],
    newSubcategory: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState(null);

  // Fetch category for editing
  useEffect(() => {
    if (mode === "edit" && id) {
      fetchCategory(id);
    }
  }, [mode, id]);

  const fetchCategory = async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}`);
      
      if (response.data.success && response.data.category) {
        const cat = response.data.category;
        
        // Extract subcategory names from populated subcategories
        const subcategoryNames = cat.subcategories ? 
          cat.subcategories.map(sub => sub.subcategory_name) : [];
        
        setCategory(cat);
        setFormData({
          name: cat.category_name || "",
          subcategories: subcategoryNames,
          newSubcategory: "",
        });

        // Handle existing image
        if (cat.category_image) {
          setPreviewImage(cat.category_image);
          setUploadedImage({
            url: cat.category_image,
            public_id: '',
            alt_text: ''
          });
        }
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      toast.error("Failed to load category");
      navigate("/admin/categories");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormTouched(true);

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const addSubcategory = () => {
    if (formData.newSubcategory.trim()) {
      setFormData({
        ...formData,
        subcategories: [...formData.subcategories, formData.newSubcategory.trim()],
        newSubcategory: "",
      });
    }
  };

  const removeSubcategory = (index) => {
    const newSubs = formData.subcategories.filter((_, i) => i !== index);
    setFormData({ ...formData, subcategories: newSubs });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormTouched(true);
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const categoryData = {
        category_name: formData.name,
        category_image: uploadedImage?.url || previewImage || "",
        subcategories: formData.subcategories || [],
      };

      let response;
      if (mode === "add") {
        response = await axios.post(`${API_BASE_URL}/categories`, categoryData, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.put(`${API_BASE_URL}/categories/${id}`, categoryData, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (response.data.success) {
        toast.success(`Category ${mode === "add" ? "created" : "updated"} successfully!`);
        navigate("/admin/categories");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(`Failed to ${mode === "add" ? "create" : "update"} category`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin/categories")}
          className="text-text hover:text-primary mr-4 transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="text-2xl font-semibold text-text">
          {mode === "add" ? "Add New Category" : "Edit Category"}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Category Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                  Category Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border ${
                    formErrors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-text focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  placeholder="Enter category name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              {/* Subcategories */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Subcategories
                </label>
                
                {/* Existing subcategories */}
                {formData.subcategories.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {formData.subcategories.map((sub, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                        <span className="text-sm text-text">{sub}</span>
                        <button
                          type="button"
                          onClick={() => removeSubcategory(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new subcategory */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="newSubcategory"
                    value={formData.newSubcategory}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Add subcategory"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSubcategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSubcategory}
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div>
              <CategoryImageUpload
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                uploadedImage={uploadedImage}
                setUploadedImage={setUploadedImage}
                error={formErrors.image}
                formTouched={formTouched}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-text hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {mode === "add" ? "Creating..." : "Updating..."}
                </>
              ) : (
                mode === "add" ? "Create Category" : "Update Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryForm;