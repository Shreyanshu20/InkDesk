import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SubcategoryTable from "./SubcategoryTable";
import { useAdmin } from "../../../Context/AdminContext";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSubcategoryTable, setShowSubcategoryTable] = useState(false);

  // Add admin context
  const { user, adminData } = useAdmin();
  const isAdmin = adminData?.role === "admin";

  useEffect(() => {
    if (id) {
      fetchCategory(id);
    } else {
      navigate("/admin/categories");
    }
  }, [id, navigate]);

  const fetchCategory = async (categoryId) => {
    try {
      setIsLoading(true);

      // Fetch category details
      const categoryResponse = await axios.get(
        `${API_BASE_URL}/admin/categories/${categoryId}`,
        { withCredentials: true }
      );

      if (categoryResponse.data.success && categoryResponse.data.category) {
        const cat = categoryResponse.data.category;

        // Fetch product count for this category
        let productCount = 0;
        try {
          const productResponse = await axios.get(
            `${API_BASE_URL}/products?category=${encodeURIComponent(cat.category_name)}&limit=1`
          );
          productCount = productResponse.data.pagination?.totalProducts || 0;
          console.log(`📊 Product count for "${cat.category_name}":`, productCount);
        } catch (error) {
          console.warn(`Failed to get product count for category ${cat.category_name}:`, error);
          productCount = 0;
        }

        setCategory({
          id: cat._id,
          name: cat.category_name,
          image: cat.category_image || "",
          subcategories: cat.subcategories || [],
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
          productsCount: productCount, // Use the fetched product count
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
    if (!isAdmin) {
      toast.error(
        "Access denied. Admin privileges required to edit categories."
      );
      return;
    }
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      toast.error(
        "Access denied. Admin privileges required to delete categories."
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/admin/categories/${id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          toast.success("Category deleted successfully");
          navigate("/admin/categories");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        const message =
          error.response?.data?.message || "Failed to delete category";
        toast.error(message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="text-center">
          <p className="text-gray-900 dark:text-gray-100">Category not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin/categories")}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 mr-4"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Category Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View and manage category information
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right */}
        <div className="flex items-center space-x-3">
          {isAdmin && (
            <>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 flex items-center font-medium shadow-sm"
              >
                <i className="fas fa-edit mr-2 text-sm"></i>
                Edit Category
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center font-medium shadow-sm"
              >
                <i className="fas fa-trash mr-2 text-sm"></i>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          {/* Category Image */}
          <div className="lg:col-span-1">
            {category.image ? (
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full aspect-square object-cover rounded-xl shadow-md bg-gray-100 dark:bg-gray-700"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center aspect-square bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <i className="fas fa-folder text-gray-400 text-4xl mb-3"></i>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No image available
                </p>
              </div>
            )}
          </div>

          {/* Category Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {category.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  <i className="fas fa-folder mr-2"></i>
                  Category
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  ID: {category.id}
                </span>
              </div>
            </div>

            {/* Stats - Simple inline display */}
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <i className="fas fa-layer-group text-purple-600 dark:text-purple-400"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Subcategories
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {category.subcategories.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <i className="fas fa-box text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {category.productsCount || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <i className="fas fa-calendar-plus text-blue-600 dark:text-blue-400"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created
                  </p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Subcategories Section */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <i className="fas fa-layer-group mr-2 text-gray-600 dark:text-gray-400"></i>
                  Subcategories ({category.subcategories.length})
                </h3>
                <button
                  onClick={() => setShowSubcategoryTable(true)}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <i className="fas fa-cog"></i>
                  Manage
                </button>
              </div>

              {category.subcategories && category.subcategories.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {category.subcategories
                    .slice(0, 8)
                    .map((subcategory, index) => (
                      <div
                        key={subcategory._id || index}
                        className="bg-white dark:bg-gray-600 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors border border-gray-200 dark:border-gray-500"
                      >
                        <div className="flex items-center">
                          <i className="fas fa-tag text-gray-400 mr-2 text-xs"></i>
                          {subcategory.subcategory_name}
                        </div>
                      </div>
                    ))}
                  {category.subcategories.length > 8 && (
                    <div className="bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center border border-gray-300 dark:border-gray-500">
                      <i className="fas fa-plus mr-1"></i>
                      {category.subcategories.length - 8} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-layer-group text-gray-300 dark:text-gray-600 text-3xl mb-3"></i>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No subcategories found
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    Click "Manage" to add subcategories
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subcategory Management Modal */}
      {showSubcategoryTable && (
        <SubcategoryTable
          categoryId={category.id}
          categoryName={category.name}
          onClose={() => {
            setShowSubcategoryTable(false);
            // Refresh category data to get updated subcategories
            fetchCategory(id);
          }}
        />
      )}
    </div>
  );
}

export default CategoryDetails;
