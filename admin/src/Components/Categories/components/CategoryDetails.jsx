import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function CategoryDetails() {
  const { id } = useParams(); // This should get the ID from URL
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("CategoryDetails ID from params:", id); // Debug log

  useEffect(() => {
    console.log("useEffect running with id:", id); // Debug log
    if (id) {
      fetchCategory(id);
    } else {
      console.log("No ID found, redirecting..."); // Debug log
      navigate("/admin/categories");
    }
  }, [id, navigate]);

  const fetchCategory = async (categoryId) => {
    try {
      console.log("Fetching category with ID:", categoryId);
      setIsLoading(true);
      
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}`);
      console.log("Category API response:", response.data);
      
      if (response.data.success && response.data.category) {
        const cat = response.data.category;
        
        // FIX: subcategories are stored as simple strings, not objects
        const subcategoryNames = cat.subcategories || [];
        
        console.log("Subcategory names:", subcategoryNames);
        
        setCategory({
          id: cat._id,
          name: cat.category_name,
          image: cat.category_image || "",
          subcategories: subcategoryNames, // Fixed this line
        });
      } else {
        throw new Error("Category not found");
      }
      
    } catch (error) {
      console.error("Error fetching category:", error);
      toast.error("Failed to load category");
      navigate("/admin/categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/categories/${id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          toast.success("Category deleted successfully");
          navigate("/admin/categories");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center">
          <p className="text-text">Category not found</p>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-semibold text-text">Category Details</h1>
      </div>

      {/* Category Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Category Image */}
          <div className="p-6 md:border-r border-gray-200 dark:border-gray-700">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-64 object-cover rounded-lg shadow-sm"
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <i className="fas fa-folder text-gray-400 text-4xl"></i>
              </div>
            )}
          </div>

          {/* Category Info */}
          <div className="p-6 md:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text">{category.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                ID: {category.id}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {/* Subcategories Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Subcategories ({category.subcategories.length})
                </h3>
                {category.subcategories && category.subcategories.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {category.subcategories.map((subcategory, index) => (
                      <div
                        key={subcategory._id || index}
                        className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        {subcategory.subcategory_name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No subcategories found
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <i className="fas fa-edit mr-2"></i> Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <i className="fas fa-trash mr-2"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryDetails;