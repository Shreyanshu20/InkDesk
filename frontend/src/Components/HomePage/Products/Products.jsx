import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Products() {
  const [activeTab, setActiveTab] = useState("featured");
  const [products, setProducts] = useState({
    featured: [],
    bestsellers: [],
    new: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [featuredRes, bestsellersRes, newRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products?featured=true&limit=8`),
          fetch(
            `${API_BASE_URL}/products?sortBy=product_rating&order=desc&limit=8`
          ),
          fetch(`${API_BASE_URL}/products?sortBy=createdAt&order=desc&limit=8`),
        ]);

        const [featuredData, bestsellersData, newData] = await Promise.all([
          featuredRes.json(),
          bestsellersRes.json(),
          newRes.json(),
        ]);

        setProducts({
          featured:
            featuredData.success && Array.isArray(featuredData.products)
              ? featuredData.products.map(sanitizeProduct)
              : [],
          bestsellers:
            bestsellersData.success && Array.isArray(bestsellersData.products)
              ? bestsellersData.products.map(sanitizeProduct)
              : [],
          new:
            newData.success && Array.isArray(newData.products)
              ? newData.products.map(sanitizeProduct)
              : [],
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setProducts({
          featured: getSampleProducts(),
          bestsellers: getSampleProducts(),
          new: getSampleProducts(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getSampleProducts = () => [
    {
      _id: "1",
      product_name: "Premium Notebook Set",
      product_description: "High-quality leather-bound notebooks",
      product_price: 24.99,
      product_image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&w=400",
      product_category: "stationery",
      product_rating: 4.5,
      product_stock: 10,
      product_brand: "Premium Brand",
    },
  ];

  const sanitizeProduct = (product) => {
    return {
      ...product,
      name: product.product_name || "Unnamed Product",
      description: product.product_description || "",
      price:
        typeof product.product_price === "number" ? product.product_price : 0,
      rating:
        typeof product.product_rating === "number" ? product.product_rating : 0,
      inStock: product.product_stock > 0,
      category: product.product_category || "stationery",
      image:
        product.product_image ||
        "https://via.placeholder.com/400x500?text=No+Image",
    };
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <i key={i} className="fas fa-star-half-alt text-yellow-400"></i>
        );
      } else {
        stars.push(<i key={i} className="far fa-star text-gray-300"></i>);
      }
    }
    return stars;
  };

  if (isLoading) {
    return (
      <section className="py-10 lg:py-16 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 lg:py-16 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-center lg:mb-8 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">
              Popular Products
            </h2>
            <p className="text-gray-600">Discover our best-selling items</p>
          </div>
          <Link
            to="/shop"
            className="hidden lg:block inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
          >
            View All Products
            <i className="fas fa-arrow-right ml-2 text-sm"></i>
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex flex-wrap mb-8 border-b border-gray-200">
          {["featured", "bestsellers", "new"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-3 text-sm md:text-base border-b-2 transition-all duration-300 font-medium whitespace-nowrap ${
                activeTab === tab
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-gray-600 hover:text-primary hover:border-primary/50"
              }`}
            >
              {tab === "new"
                ? "New Arrivals"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                {products[tab].length}
              </span>
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="relative">
          {Object.keys(products).map((key) => (
            <div
              key={key}
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${
                activeTab === key ? "block" : "hidden"
              }`}
            >
              {products[key].length > 0 ? (
                products[key].map((product) => (
                  <div key={product._id} className="group relative h-full">
                    <Link
                      to={`/shop/product/${product._id}`}
                      className="block h-full"
                    >
                      <div className="bg-gray-50 dark:bg-gray-800 text-text rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.01] h-full flex flex-col border-b-4 border-transparent hover:border-primary">
                        {/* Product Image */}
                        <div className="relative aspect-square bg-gray-50 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            loading="lazy"
                          />

                          {/* Out of Stock Overlay */}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between min-h-[140px]">
                          <div className="flex-1">
                            {/* Product Name */}
                            <h3 className="font-medium mb-2 line-clamp-2 h-12 overflow-hidden leading-6">
                              {product.name}
                            </h3>

                            {/* Rating */}
                            <div className="mb-3 h-4">
                              <div className="flex items-center">
                                <div className="flex mr-2">
                                  {renderStars(product.rating)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="mt-auto">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg text-primary">
                                ₹
                                {product.price
                                  ? product.price.toFixed(2)
                                  : "0.00"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <i className="fas fa-box-open text-4xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500">
                    Check back later for new products in this category.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile view button */}
        <div className="mt-12 text-center lg:hidden">
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
          >
            View All Products
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Products;
