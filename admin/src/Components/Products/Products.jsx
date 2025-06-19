import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";
import Table from "../Common/Table";
import Pagination from "../Common/Pagination";
import BulkActions from "../Common/BulkActions";
import { getProductTableConfig } from "../Common/tableConfig.jsx";
import ProductDetails from "./components/ProductDetails";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Transform product data from backend format to frontend format
const transformProduct = (product) => ({
  id: product._id,
  name: product.product_name,
  description: product.product_description,
  price: product.product_price,
  inventory: product.product_stock,
  category: product.product_category,
  brand: product.product_brand || "N/A",
  image: product.product_image || "/placeholder-product.jpg",
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
  owner: product.owner ? `${product.owner.first_name} ${product.owner.last_name}` : "Unknown",
  status: product.product_stock > 0 ? "active" : "out_of_stock",
});

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Products() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for stats calculation
  const [categories, setCategories] = useState([]); // KEEP ONLY THIS ONE
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [view, setView] = useState("list");

  // Separate state for input values (immediate) and applied filters (debounced)
  const [searchInput, setSearchInput] = useState(""); // What user types
  const [searchQuery, setSearchQuery] = useState(""); // What gets applied
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [totalProducts, setTotalProducts] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Debounce search input (500ms delay)
  const debouncedSearchInput = useDebounce(searchInput, 500);

  // Update searchQuery when debounced input changes
  useEffect(() => {
    setSearchQuery(debouncedSearchInput);
    setPage(0); // Reset to first page when search changes
  }, [debouncedSearchInput]);

  // Calculate stats from allProducts (which now comes from the stats API)
  const stats = useMemo(() => {
    if (!allProducts || typeof allProducts !== 'object') {
      return {
        totalProducts: 0,
        activeProducts: 0,
        outOfStockProducts: 0,
        totalInventoryValue: 0,
      };
    }

    // allProducts now contains the stats object from the API
    return {
      totalProducts: allProducts.totalProducts || 0,
      activeProducts: allProducts.activeProducts || 0,
      outOfStockProducts: allProducts.outOfStockProducts || 0,
      totalInventoryValue: allProducts.totalInventoryValue || 0,
    };
  }, [allProducts]);

  // CHANGE: Use admin routes for all product operations
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams();
      params.append("page", page + 1);
      params.append("limit", rowsPerPage);

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (sortConfig.key) {
        params.append("sortBy", sortConfig.key);
        params.append("sortOrder", sortConfig.direction === "ascending" ? "asc" : "desc");
      }

      // CHANGE: Use admin route
      const response = await axios.get(
        `${API_BASE_URL}/admin/products?${params.toString()}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setProducts(response.data.products.map(transformProduct));
        setTotalProducts(response.data.pagination.totalProducts);
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, categoryFilter, statusFilter, sortConfig]);

  // CHANGE: Use admin route for product stats
  const fetchAllProducts = useCallback(async () => {
    try {
      console.log("📊 Fetching product statistics...");

      const response = await axios.get(`${API_BASE_URL}/admin/products/stats`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        setAllProducts(response.data.stats);
        console.log("📊 Product stats loaded:", response.data.stats);
      }
    } catch (error) {
      console.error("❌ Error fetching product stats:", error);
    }
  }, []);

  // CHANGE: Use admin route for single product
  const fetchProductById = useCallback(async (productId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/products/${productId}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        const transformedProduct = transformProduct(response.data.product);
        setCurrentProduct(transformedProduct);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
      navigate("/admin/products");
    }
  }, [navigate]);

  // ADD: Missing fetchCategories function
  const fetchCategories = useCallback(async () => {
    try {
      console.log("📦 Fetching categories...");

      const response = await axios.get(`${API_BASE_URL}/admin/categories`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        setCategories(response.data.categories);
        console.log("📦 Categories loaded:", response.data.categories.length);
      }
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      // Don't show toast error for categories as it's not critical
    }
  }, []);

  // CHANGE: Use admin route for delete
  const deleteProduct = useCallback(async (productId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/products/${productId}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        toast.success("Product deleted successfully");
        return true;
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
      return false;
    }
  }, []);

  // Bulk delete products
  const bulkDeleteProducts = useCallback(async (productIds) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/products/bulk-delete`,
        { productIds },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        toast.success(
          `Successfully deleted ${response.data.deletedCount} products`
        );
        return true;
      }
    } catch (error) {
      console.error("Error bulk deleting products:", error);
      if (error.response?.status === 403) {
        toast.error("You can only delete your own products");
      } else {
        toast.error("Failed to delete products");
      }
      return false;
    }
  }, []);

  // ADD: Missing updateProduct function
  const updateProduct = useCallback(async (productId, updateData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/products/${productId}`,
        updateData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        toast.success("Product updated successfully");
        return true;
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
      return false;
    }
  }, []);

  // Load initial data (only once)
  useEffect(() => {
    fetchCategories();
    fetchAllProducts(); // Fetch all products for stats
  }, [fetchCategories, fetchAllProducts]);

  // Fetch products when filter parameters change (debounced)
  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [fetchProducts, categories]);

  // Handle URL parameters
  useEffect(() => {
    if (id) {
      fetchProductById(id);
      setView("view");
    } else {
      setView("list");
    }
  }, [id, fetchProductById]);

  // Handle refresh from navigation state
  useEffect(() => {
    if (location.state?.refresh) {
      console.log("🔄 Refreshing products due to navigation state");
      fetchProducts();
      fetchAllProducts(); // Also refresh stats
      window.history.replaceState({}, document.title);
    }
  }, [location.state, fetchProducts, fetchAllProducts]);

  // Handle URL timestamp refresh
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const timestamp = urlParams.get("t");

    if (timestamp) {
      console.log("🔄 Timestamp detected - forcing refresh");
      window.history.replaceState({}, document.title, window.location.pathname);

      setPage(0);
      setSearchInput("");
      setSearchQuery("");
      setCategoryFilter("all");
      setStatusFilter("all");

      if (categories.length > 0) {
        fetchProducts();
        fetchAllProducts(); // Also refresh stats
      }
    }
  }, [location.search, categories, fetchProducts, fetchAllProducts]);

  // Event handlers with proper state management
  const handleSearchInputChange = useCallback((e) => {
    setSearchInput(e.target.value);
    // Don't call fetchProducts here - let debouncing handle it
  }, []);

  const handleCategoryFilterChange = useCallback((e) => {
    setCategoryFilter(e.target.value);
    setPage(0); // Reset to first page
    // fetchProducts will be called automatically via useEffect
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
    setPage(0); // Reset to first page
    // fetchProducts will be called automatically via useEffect
  }, []);

  // Product action handlers
  const handleViewProduct = useCallback(
    (productId) => {
      navigate(`/admin/products/view/${productId}`);
    },
    [navigate]
  );

  const handleEditProduct = useCallback(
    (productId) => {
      navigate(`/admin/products/edit/${productId}`);
    },
    [navigate]
  );

  const handleDeleteProduct = useCallback(
    async (productId) => {
      if (window.confirm("Are you sure you want to delete this product?")) {
        const success = await deleteProduct(productId);
        if (success) {
          fetchProducts();
          fetchAllProducts(); // Refresh stats after deletion
        }
      }
    },
    [deleteProduct, fetchProducts, fetchAllProducts]
  );

  const handleDelete = useCallback(
    async (ids) => {
      const isMultiple = ids.length > 1;
      const message = isMultiple
        ? `Delete ${ids.length} products?`
        : "Delete this product?";

      if (window.confirm(message)) {
        try {
          let success;
          if (isMultiple) {
            success = await bulkDeleteProducts(ids);
          } else {
            success = await deleteProduct(ids[0]);
          }

          if (success) {
            setSelectedProducts([]);
            fetchProducts();
            fetchAllProducts(); // Refresh stats after deletion

            if (view === "view" && ids.includes(currentProduct?.id)) {
              navigate("/admin/products");
            }
          }
        } catch (error) {
          toast.error("Some products could not be deleted");
        }
      }
    },
    [
      bulkDeleteProducts,
      deleteProduct,
      fetchProducts,
      fetchAllProducts,
      view,
      currentProduct,
      navigate,
    ]
  );

  // Selection handlers
  const handleSelectProduct = useCallback((id, selected) => {
    setSelectedProducts((prev) =>
      selected ? [...prev, id] : prev.filter((productId) => productId !== id)
    );
  }, []);

  const handleSelectAll = useCallback(
    (selected) => {
      if (selected) {
        const currentPageIds = products.map((p) => p.id);
        setSelectedProducts((prev) => [
          ...new Set([...prev, ...currentPageIds]),
        ]);
      } else {
        const currentPageIds = products.map((p) => p.id);
        setSelectedProducts((prev) =>
          prev.filter((id) => !currentPageIds.includes(id))
        );
      }
    },
    [products]
  );

  // Pagination handlers
  const handlePageChange = useCallback(
    (newPage) => {
      console.log("📄 Changing page from", page, "to", newPage);
      setPage(newPage);
    },
    [page]
  );

  const handleRowsPerPageChange = useCallback(
    (e) => {
      const newRowsPerPage = parseInt(e.target.value, 10);
      console.log(
        "📊 Changing rows per page from",
        rowsPerPage,
        "to",
        newRowsPerPage
      );
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    },
    [rowsPerPage]
  );

  // Sort handler
  const handleSortChange = useCallback((newSortConfig) => {
    setSortConfig(newSortConfig);
    setPage(0); // Reset to first page when sorting changes
  }, []);

  // Get table configuration
  const tableConfig = useMemo(
    () =>
      getProductTableConfig(
        handleViewProduct,
        handleEditProduct,
        handleDeleteProduct
      ),
    [handleViewProduct, handleEditProduct, handleDeleteProduct]
  );

  // Render product details view
  if (view === "view" && currentProduct) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <ProductDetails
          product={currentProduct}
          onBack={() => {
            setView("list");
            navigate("/admin/products");
          }}
          onEdit={() => navigate(`/admin/products/edit/${currentProduct.id}`)}
          onDelete={() => handleDelete([currentProduct.id])}
        />
      </div>
    );
  }

  // Render product list view
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header with Stats */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Products Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage all products in the system
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/products/add")}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
          >
            <i className="fas fa-plus"></i>
            <span>Add Product</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <i className="fas fa-box text-blue-600 dark:text-blue-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Products
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <i className="fas fa-check-circle text-green-600 dark:text-green-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Products
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.activeProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <i className="fas fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Out of Stock
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.outOfStockProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <i className="fas fa-rupee-sign text-purple-600 dark:text-purple-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Inventory Value
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ₹
                  {stats.totalInventoryValue.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              id="search"
              type="text"
              value={searchInput} // Use searchInput for immediate response
              onChange={handleSearchInputChange} // Use optimized handler
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Search products..."
            />
            {/* Show loading indicator when searching */}
            {searchInput !== searchQuery && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i className="fas fa-spinner fa-spin text-gray-400 text-sm"></i>
              </div>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label
            htmlFor="category-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={handleCategoryFilterChange} // Use optimized handler
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.category_name}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange} // Use optimized handler
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            <Table
              data={products}
              columns={tableConfig.columns}
              selectedItems={selectedProducts}
              onSelectItem={handleSelectProduct}
              onSelectAll={handleSelectAll}
              sortConfig={sortConfig}
              onSortChange={handleSortChange} // Use optimized handler
              isLoading={isLoading}
              emptyMessage="No products found. Start by adding your first product!"
              enableSelection={true}
              enableSorting={true}
              itemKey="id"
            />

            {/* Pagination */}
            <Pagination
              page={page}
              rowsPerPage={rowsPerPage}
              totalItems={totalProducts}
              handlePageChange={handlePageChange}
              handleRowsPerPageChange={handleRowsPerPageChange}
              entityName="products"
            />
          </>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <BulkActions
          selectedItems={selectedProducts}
          entityName="products"
          actions={[
            {
              label: "Delete",
              onClick: handleDelete,
              className:
                "bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md",
              icon: "fas fa-trash",
              title: "Delete selected products",
            },
          ]}
        />
      )}
    </div>
  );
}

export default Products;
