import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CategoryImageUpload from "./CategoryImageUpload";
import SubcategoryTable from "./SubcategoryTable";
import { useAdmin } from "../../../Context/AdminContext";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function CategoryForm({ mode: propMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const mode = propMode || (id ? "edit" : "add");

  const { user, adminData } = useAdmin();
  const isAdmin = adminData?.role === "admin";

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

  useEffect(() => {
    if (mode === "edit" && id) {
      fetchCategory(id);
    }
  }, [mode, id]);

  const fetchCategory = async (categoryId) => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/admin/categories/${categoryId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const category = response.data.category;
        setFormData({
          name: category.category_name || "",
          subcategories:
            category.subcategories?.map((sub) =>
              typeof sub === "string" ? sub : sub.subcategory_name
            ) || [],
          newSubcategory: "",
        });
        setPreviewImage(category.category_image || "");
        setCategory(category);
      }
    } catch (error) {
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
        subcategories: [
          ...formData.subcategories,
          formData.newSubcategory.trim(),
        ],
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

    if (!isAdmin) {
      toast.error(
        "Access denied. Admin privileges required to save categories."
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = {
        category_name: formData.name.trim(),
        category_image: uploadedImage?.url || previewImage || "",
        subcategories: formData.subcategories.filter((sub) => sub.trim()),
      };

      let response;
      if (mode === "edit" && id) {
        response = await axios.put(
          `${API_BASE_URL}/admin/categories/${id}`,
          submitData,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/admin/categories`,
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
      const message =
        error.response?.data?.message ||
        `Failed to ${mode === "edit" ? "update" : "create"} category`;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSubcategoryModal = () => {
    setShowSubcategoryTable(false);
    if (mode === "edit" && id) {
      fetchCategory(id);
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/admin/categories")}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 mr-4"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {mode === "add" ? "Add New Category" : "Edit Category"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {mode === "add"
              ? "Create a new product category"
              : "Update category information"}
          </p>
        </div>
      </div>

      {!isAdmin && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div className="flex">
            <i className="fas fa-exclamation-triangle text-red-500 dark:text-red-400 mr-2 text-lg"></i>
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
              You are viewing this form in read-only mode. Admin privileges are
              required to save changes.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Category Name<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    formErrors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-primary"
                  }`}
                  placeholder="Enter category name"
                />
                {formErrors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subcategories{" "}
                    {mode === "edit" &&
                      category?.subcategories &&
                      `(${category.subcategories.length})`}
                  </label>
                  {mode === "edit" && category && (
                    <button
                      type="button"
                      onClick={() => setShowSubcategoryTable(true)}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <i className="fas fa-cog"></i>
                      Manage
                    </button>
                  )}
                </div>

                {mode === "edit" && category?.subcategories ? (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    {category.subcategories.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {category.subcategories
                          .slice(0, 6)
                          .map((subcategory, index) => (
                            <div
                              key={subcategory._id || index}
                              className="bg-white dark:bg-gray-600 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors border border-gray-200 dark:border-gray-500 flex items-center"
                            >
                              <i className="fas fa-tag text-gray-400 mr-2 text-xs"></i>
                              {subcategory.subcategory_name}
                            </div>
                          ))}
                        {category.subcategories.length > 6 && (
                          <div className="bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center border border-gray-300 dark:border-gray-500">
                            <i className="fas fa-plus mr-1"></i>
                            {category.subcategories.length - 6} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <i className="fas fa-layer-group text-gray-300 dark:text-gray-600 text-2xl mb-2"></i>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No subcategories found
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Click "Manage" button above for full subcategory
                      management
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.subcategories.length > 0 && (
                      <div className="space-y-2">
                        {formData.subcategories.map((sub, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center">
                              <i className="fas fa-tag text-gray-400 mr-2 text-sm"></i>
                              <span className="text-sm text-gray-900 dark:text-gray-100">
                                {sub}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSubcategory(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                              title="Remove subcategory"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="newSubcategory"
                        value={formData.newSubcategory}
                        onChange={handleInputChange}
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
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
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm transition-colors shadow-sm flex items-center"
                      >
                        <i className="fas fa-plus mr-1"></i>
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
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

          <div className="flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isAdmin}
              className={`px-6 py-2 rounded-lg text-base font-medium flex items-center gap-2 transition-all duration-200 shadow-sm ${
                isAdmin
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {mode === "add" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>
                  <i
                    className={`fas ${mode === "add" ? "fa-plus" : "fa-save"}`}
                  ></i>
                  {mode === "add" ? "Create Category" : "Update Category"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

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
