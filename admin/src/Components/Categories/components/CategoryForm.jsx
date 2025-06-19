import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CategoryImageUpload from "./CategoryImageUpload";
import SubcategoryTable from "./SubcategoryTable";

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
  const [showSubcategoryTable, setShowSubcategoryTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch category for editing
  useEffect(() => {
    if (mode === "edit" && id) {
      fetchCategory(id);
    }
  }, [mode, id]);

  const fetchCategory = async (categoryId) => {
    try {
      setIsLoading(true);
      console.log("🔍 Fetching category for edit:", categoryId);
      
      const response = await axios.get(
        `${API_BASE_URL}/admin/categories/${categoryId}`, // Add /admin prefix
        { withCredentials: true }
      );
      
      if (response.data.success) {
        const category = response.data.category;
        setFormData({
          name: category.category_name || '',
          subcategories: category.subcategories?.map(sub => 
            typeof sub === 'string' ? sub : sub.subcategory_name
          ) || [],
          newSubcategory: "",
        });
        setPreviewImage(category.category_image || '');
        setCategory(category);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      toast.error("Failed to load category for editing");
      navigate("/admin/categories");
    } finally {
      setIsLoading(false);
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
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const submitData = {
        category_name: formData.name.trim(),
        category_image: uploadedImage?.url || previewImage || '',
        subcategories: formData.subcategories.filter(sub => sub.trim())
      };

      let response;
      if (mode === "edit" && id) {
        console.log("✏️ Updating category:", id);
        response = await axios.put(
          `${API_BASE_URL}/admin/categories/${id}`, // Add /admin prefix
          submitData,
          { withCredentials: true }
        );
      } else {
        console.log("➕ Creating new category");
        response = await axios.post(
          `${API_BASE_URL}/admin/categories`, // Add /admin prefix
          submitData,
          { withCredentials: true }
        );
      }

      if (response.data.success) {
        toast.success(
          mode === "edit" 
            ? "Category updated successfully!" 
            : "Category created successfully!"
        );
        navigate("/admin/categories");
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      const message = error.response?.data?.message || 
        `Failed to ${mode === "edit" ? "update" : "create"} category`;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSubcategoryModal = () => {
    setShowSubcategoryTable(false);
    // Refresh category data to get updated subcategories
    if (mode === "edit" && id) {
      fetchCategory(id);
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

              {/* Subcategories Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-text">
                    Subcategories {mode === "edit" && category?.subcategories && 
                      `(${category.subcategories.length})`}
                  </label>
                  {mode === "edit" && category && (
                    <button
                      type="button"
                      onClick={() => setShowSubcategoryTable(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                    >
                      <i className="fas fa-cog"></i>
                      Manage
                    </button>
                  )}
                </div>
                
                {mode === "edit" && category?.subcategories ? (
                  // Show existing subcategories for edit mode
                  <div className="mb-4">
                    {category.subcategories.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {category.subcategories.slice(0, 6).map((subcategory, index) => (
                          <div
                            key={subcategory._id || index}
                            className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            {subcategory.subcategory_name}
                          </div>
                        ))}
                        {category.subcategories.length > 6 && (
                          <div className="bg-gray-100 dark:bg-gray-600 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
                            +{category.subcategories.length - 6} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                        No subcategories found
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Click "Manage" button above for full subcategory management
                    </p>
                  </div>
                ) : (
                  // Show add subcategories interface for add mode
                  <div>
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
                )}
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

      {/* Subcategory Management Modal */}
      {showSubcategoryTable && mode === "edit" && category && (
        <SubcategoryTable
          categoryId={category._id}
          categoryName={category.category_name}
          onClose={handleCloseSubcategoryModal}
        />
      )}
    </div>
  );
}

export default CategoryForm;