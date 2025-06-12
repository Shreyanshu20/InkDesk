import React, { useState, useEffect, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../Context/AppContent.jsx";
import { useCategories } from "../../Context/CategoryContext.jsx";
import SearchBar from "../Common/SearchBar";
import FilterMenu from "./components/FilterMenu";
import Sorting from "./components/Sorting";
import Products from "./components/Products";
import NoProduct from "./components/NoProduct";
import Pagination from "../Common/Pagination";
import PageHeader from "../Common/PageHeader";
import Newsletter from "../HomePage/Newsletter/Newsletter";

const ProductsPage = () => {
  // Update the useParams to get subcategory
  const { category, subcategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { backendUrl } = useContext(AppContent);
  const { categories } = useCategories();

  // States
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  // Available brands state
  const [availableBrands, setAvailableBrands] = useState([]);

  // Fetch products from the backend
  const fetchProducts = async () => {
    setIsLoading(true);

    try {
      console.log("🔍 Fetching products...");
      console.log("Backend URL:", backendUrl);

      const url = `${backendUrl}/products`;
      const params = new URLSearchParams();

      // Existing parameters
      params.append("page", currentPage);
      params.append("limit", productsPerPage);

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (category && category !== "all") {
        params.append("category", category);
      }

      // ADD THIS: Add subcategory from URL params
      if (subcategory && subcategory !== "all") {
        const subcategoryName = subcategory.replace(/-/g, " ");
        params.append("subcategory", subcategoryName);
        console.log("🎯 Adding subcategory to query:", subcategoryName);
      }

      // Add selected categories filter
      if (selectedCategories.length > 0) {
        selectedCategories.forEach((catId) => {
          params.append("selectedCategories", catId);
        });
      }

      // Add selected brands filter
      if (selectedBrands.length > 0) {
        selectedBrands.forEach((brand) => {
          params.append("brand", brand);
        });
      }

      // Price range filter
      if (priceRange[1] < 5000) {
        params.append("maxPrice", priceRange[1]);
      }

      // Stock filter
      if (inStockOnly) {
        params.append("inStock", "true");
      }

      // Add sorting
      if (sortOption !== "relevance") {
        const [field, order] = sortOption.split("-");

        // Map frontend sort options to backend field names
        let backendField = field;
        if (field === "price") {
          backendField = "product_price";
        } else if (field === "product_rating") {
          backendField = "product_rating";
        } else if (field === "product_name") {
          backendField = "product_name";
        } else if (field === "createdAt") {
          backendField = "createdAt";
        }

        params.append("sortBy", backendField);
        params.append("order", order || "asc");

        console.log(`🔧 Sorting by: ${backendField} (${order})`);
      }

      console.log("🔍 Final API Parameters:", params.toString());

      const response = await axios.get(`${url}?${params.toString()}`);

      if (response.data.success) {
        const productsData = response.data.products;
        setProducts(productsData);
        setFilteredProducts(productsData);
        setTotalProducts(
          response.data.pagination?.totalProducts || productsData.length
        );
        setTotalPages(response.data.pagination?.totalPages || 1);

        console.log("✅ Products loaded successfully:", productsData.length);
      } else {
        console.error("❌ API returned success: false", response.data);
        toast.error(response.data.message || "Failed to load products");
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);

      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(`Server error: ${error.response.status}`);
      } else if (error.request) {
        console.error("Network error - no response received");
        toast.error(
          "Cannot connect to server. Please check if backend is running on port 5000."
        );
      } else {
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all brands for filter
  const fetchBrands = async () => {
    try {
      const url = `${backendUrl}/products/brands`;
      console.log("Fetching ALL brands from:", url);

      const response = await axios.get(url);
      console.log("Brands response:", response.data);

      if (response.data.success) {
        const allBrands = response.data.brands || [];
        setAvailableBrands(allBrands);
        console.log("✅ Loaded all available brands:", allBrands);
      } else {
        console.error("Failed to fetch brands:", response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      if (error.response) {
        console.error("Brands error response:", error.response.data);
      }
    }
  };

  // 1. Initial setup - runs once
  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    setSearchTerm(searchQuery);

    const sortParam = searchParams.get("sort");
    if (sortParam) {
      setSortOption(sortParam);
    }

    // Load all brands once
    fetchBrands();
  }, []);

  // 2. Handle URL category changes
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    // Reset filters when category changes in URL
    setSelectedCategories([]);
    setCurrentPage(1);

    // Handle category selection
    if (category && category !== "all") {
      const categoryObj = categories.find(
        (c) => c.category_name.toLowerCase().replace(/\s+/g, "-") === category
      );

      if (categoryObj) {
        setSelectedCategories([categoryObj._id]);
        console.log(
          "🎯 Auto-selected category from URL:",
          categoryObj.category_name
        );
      }
    }
  }, [category, subcategory, categories]);

  // 3. Main fetch effect - fetch products when filters change
  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [
    categories,
    searchTerm,
    category,
    subcategory,
    selectedCategories,
    priceRange,
    selectedBrands,
    inStockOnly,
    sortOption,
    currentPage,
    searchParams,
  ]);

  // 4. Reset page when parameters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, subcategory, searchTerm]);

  // Toggle brand in selected brands
  const handleBrandToggle = (brand) => {
    console.log("Brand toggle called with:", brand);
    console.log("Current selected brands:", selectedBrands);

    setSelectedBrands((prev) => {
      const newSelection = prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand];

      console.log("New brand selection:", newSelection);
      return newSelection;
    });

    setCurrentPage(1);
  };

  // Toggle category in selected categories
  const handleCategoryToggle = (categoryId) => {
    console.log("Category toggle called with ID:", categoryId);

    const categoryObj = categories.find((c) => c._id === categoryId);

    setSelectedCategories((prev) => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [categoryId];

      console.log("New category selection:", newSelection);

      // Update URL properly
      if (newSelection.length === 1 && categoryObj) {
        const categorySlug = categoryObj.category_name
          .toLowerCase()
          .replace(/\s+/g, "-");

        window.history.replaceState(null, "", `/shop/category/${categorySlug}`);
      } else if (newSelection.length === 0) {
        window.history.replaceState(null, "", "/shop");
      }

      return newSelection;
    });

    setCurrentPage(1);
  };

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Update URL params
    setSearchParams((params) => {
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      return params;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setInStockOnly(false);
    setSortOption("relevance");
    setSearchTerm("");
    setSearchParams({});
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Construct breadcrumbs
  const breadcrumbs = [{ label: "Shop", link: "/shop" }];

  // Check for Browse All query parameters
  const featuredParam = searchParams.get("featured");
  const discountParam = searchParams.get("discount");
  const sortParam = searchParams.get("sort");

  // Handle Browse All breadcrumbs
  if (featuredParam === "true") {
    breadcrumbs.push({ label: "Best Sellers" });
  } else if (discountParam === "true") {
    breadcrumbs.push({ label: "Sale Items" });
  } else if (sortParam === "newest-desc") {
    breadcrumbs.push({ label: "New Arrivals" });
  } else if (searchTerm) {
    breadcrumbs.push({ label: `Search: "${searchTerm}"` });
  } else if (category && category !== "all") {
    // Regular category/subcategory breadcrumbs
    const categoryObj = categories.find(
      (c) => c.category_name.toLowerCase().replace(/\s+/g, "-") === category
    );
    if (categoryObj) {
      breadcrumbs.push({
        label: categoryObj.category_name,
        link: `/shop/category/${category}`,
      });

      if (subcategory) {
        const subcategoryObj = categoryObj.subcategories?.find(
          (s) =>
            s.subcategory_name.toLowerCase().replace(/\s+/g, "-") ===
            subcategory
        );

        if (subcategoryObj) {
          breadcrumbs.push({
            label: subcategoryObj.subcategory_name,
          });
        }
      }
    }
  } else if (category === "all") {
    breadcrumbs.push({ label: "All Products" });
  }

  // Get title for the page
  const getPageTitle = () => {
    // Check for Browse All query parameters first
    const featuredParam = searchParams.get("featured");
    const discountParam = searchParams.get("discount");
    const sortParam = searchParams.get("sort");

    // Handle Browse All special pages
    if (featuredParam === "true") {
      return "Best Sellers";
    }

    if (discountParam === "true") {
      return "Sale Items";
    }

    if (sortParam === "newest-desc") {
      return "New Arrivals";
    }

    // Handle search results
    if (searchTerm) {
      return `Search Results for "${searchTerm}"`;
    }

    // Handle subcategory pages
    if (subcategory) {
      const categoryObj = categories.find(
        (c) => c.category_name.toLowerCase().replace(/\s+/g, "-") === category
      );

      if (categoryObj) {
        const subcategoryObj = categoryObj.subcategories?.find(
          (s) =>
            s.subcategory_name.toLowerCase().replace(/\s+/g, "-") ===
            subcategory
        );

        if (subcategoryObj) {
          return subcategoryObj.subcategory_name;
        }
      }
    }

    // Handle category pages
    if (category && category !== "all") {
      const categoryObj = categories.find(
        (c) => c.category_name.toLowerCase().replace(/\s+/g, "-") === category
      );

      if (categoryObj) {
        return categoryObj.category_name;
      }
    }

    // Default fallback
    return "All Products";
  };

  // Sync filter menu with current URL category
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    if (category && category !== "all") {
      const categoryObj = categories.find(
        (c) => c.category_name.toLowerCase().replace(/\s+/g, "-") === category
      );

      if (categoryObj) {
        // Only update if not already selected
        if (!selectedCategories.includes(categoryObj._id)) {
          setSelectedCategories([categoryObj._id]);
          console.log(
            "🎯 Synced filter with URL category:",
            categoryObj.category_name
          );
        }
      }
    } else {
      // Clear selection if on all products page
      if (selectedCategories.length > 0) {
        setSelectedCategories([]);
        console.log("🔄 Cleared category filter for all products");
      }
    }
  }, [category, categories]);

  return (
    <div className="bg-background text-text">
      <PageHeader title={getPageTitle()} breadcrumbs={breadcrumbs} />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 mb-10">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-center mb-6">
          <SearchBar
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            placeholder="Search products..."
            className="w-full md:w-auto md:min-w-[500px]"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          <FilterMenu
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryToggle={handleCategoryToggle}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            availableBrands={availableBrands}
            selectedBrands={selectedBrands}
            handleBrandToggle={handleBrandToggle}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            clearFilters={clearFilters}
            formatPrice={formatPrice}
          />

          <div className="flex-1 min-w-0">
            <Sorting
              totalProducts={totalProducts}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />

            {isLoading ? (
              <div className="h-96 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <NoProduct clearFilters={clearFilters} />
            ) : (
              <>
                <Products
                  products={filteredProducts}
                  formatPrice={formatPrice}
                />

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
};

export default ProductsPage;
