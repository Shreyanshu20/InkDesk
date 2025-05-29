import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "../Common/Table";
import Pagination from "../Common/Pagination";
import BulkActions from "../Common/BulkActions";
import CategoryDetails from "./components/CategoryDetails";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Categories({ view: propView }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const view = propView || (id ? "view" : "list");

  // 🔥 ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURNS
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/categories`);
      
      if (response.data.success) {
        const transformedCategories = response.data.categories.map(category => ({
          id: category._id,
          name: category.category_name,
          description: category.description || "No description provided",
          image: category.category_image || "",
          subcategories: category.subcategories || [], // This will now be the populated array
          subcategoryCount: category.subcategories ? category.subcategories.length : 0,
          productCount: category.productCount || 0,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }));
        
        setCategories(transformedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category
  const deleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
        return true;
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
      return false;
    }
  };

  // Navigation handlers
  const handleAddCategory = () => {
    navigate("/admin/categories/add");
  };

  const handleViewCategory = (categoryId) => {
    navigate(`/admin/categories/view/${categoryId}`);
  };

  const handleEditCategory = (categoryId) => {
    navigate(`/admin/categories/edit/${categoryId}`);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(categoryId);
    }
  };

  // Filter and sort logic
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const sortedFilteredCategories = useMemo(() => {
    let sortableCategories = [...filteredCategories];
    if (sortConfig && sortConfig.key) {
      sortableCategories.sort((a, b) => {
        let aValue = a[sortConfig.key] || "";
        let bValue = b[sortConfig.key] || "";

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCategories;
  }, [filteredCategories, sortConfig]);

  const paginatedCategories = useMemo(() => {
    return sortedFilteredCategories.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedFilteredCategories, page, rowsPerPage]);

  // Selection handlers
  const handleSelectCategory = (id, selected) => {
    setSelectedCategories(
      selected
        ? [...selectedCategories, id]
        : selectedCategories.filter((categoryId) => categoryId !== id)
    );
  };

  const handleSelectAll = (selected) => {
    if (selected) {
      const allCategoryIds = filteredCategories.map((category) => category.id);
      setSelectedCategories(allCategoryIds);
    } else {
      setSelectedCategories([]);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (selectedIds) => {
    if (window.confirm(`Delete ${selectedIds.length} selected categories?`)) {
      for (const id of selectedIds) {
        await deleteCategory(id);
      }
      setSelectedCategories([]);
    }
  };

  // Table columns
  const tableColumns = [
    {
      key: "name",
      label: "Category",
      sortable: true,
      className: "px-6 py-4 whitespace-nowrap",
      customRenderer: (category) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-primary/10 rounded-md flex items-center justify-center text-primary">
                <i className="fas fa-folder"></i>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {category.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ID: {category.id?.slice(-8) || "No ID"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "subcategoryCount",
      label: "Subcategories",
      sortable: true,
      className: "px-6 py-4 whitespace-nowrap",
      customRenderer: (category) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
            {category.subcategories ? category.subcategories.length : 0} subcategories
          </span>
        </div>
      ),
    },
    {
      key: "productCount",
      label: "Products",
      sortable: true,
      className: "px-6 py-4 whitespace-nowrap",
      customRenderer: (category) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
            {category.productCount || 0} products
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      className: "px-6 py-4 whitespace-nowrap",
      customRenderer: (category) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {category.createdAt
            ? new Date(category.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Unknown"}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium",
      customRenderer: (category) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => handleViewCategory(category.id)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
            title="View category"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            onClick={() => handleEditCategory(category.id)}
            className="text-primary hover:text-primary/80 p-1 rounded transition-colors"
            title="Edit category"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => handleDeleteCategory(category.id)}
            className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
            title="Delete category"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  // 🔥 NOW WE CAN SAFELY DO CONDITIONAL RETURNS AFTER ALL HOOKS
  if (view === "view" && id) {
    return <CategoryDetails categoryId={id} />; // Pass the ID as prop
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your product categories
          </p>
        </div>

        <button
          onClick={handleAddCategory}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2 transition-colors"
        >
          <i className="fas fa-plus"></i>
          <span>Add Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="search"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
        <Table
          data={paginatedCategories}
          columns={tableColumns}
          selectedItems={selectedCategories}
          onSelect={handleSelectCategory}
          onSelectAll={handleSelectAll}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
          isLoading={isLoading}
          emptyMessage={
            searchQuery
              ? "No categories matching your search"
              : "No categories found"
          }
        />

        <Pagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={filteredCategories.length}
          handlePageChange={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
          entityName="categories"
        />
      </div>

      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <BulkActions
          selectedItems={selectedCategories}
          entityName="categories"
          actions={[
            {
              label: "Delete",
              onClick: handleDelete,
              className: "bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md",
              icon: "fas fa-trash",
              title: "Delete selected categories",
            },
          ]}
        />
      )}
    </div>
  );
}

export default Categories;