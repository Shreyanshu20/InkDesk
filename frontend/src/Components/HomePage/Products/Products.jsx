import React, { useState } from "react";
import { Link } from "react-router-dom";

function Products() {
  const [activeTab, setActiveTab] = useState("featured");

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <i
            key={i}
            className="fas fa-star text-yellow-400"
            aria-hidden="true"
          ></i>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <i
            key={i}
            className="fas fa-star-half-alt text-yellow-400"
            aria-hidden="true"
          ></i>
        );
      } else {
        stars.push(
          <i
            key={i}
            className="far fa-star text-gray-300"
            aria-hidden="true"
          ></i>
        );
      }
    }

    return stars;
  };

  // Function to handle adding product to cart
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Added ${product.name} to cart`);

    // Accessibility notification
    const notification = document.createElement("div");
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "assertive");
    notification.className = "sr-only";
    notification.textContent = `${product.name} added to cart`;
    document.body.appendChild(notification);

    // Remove after announcement
    setTimeout(() => document.body.removeChild(notification), 1000);
  };

  return (
    <section
      className="py-10 lg:py-16 px-6 bg-background"
      aria-labelledby="popular-products-heading"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-center lg:mb-8 mb-4">
          <h2
            id="popular-products-heading"
            className="text-2xl md:text-3xl font-bold text-text mb-4 md:mb-0"
          >
            Popular Products
          </h2>
          <Link
            to="/products"
            className="hidden lg:block inline-block px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            View All
            <i
              className="fas fa-arrow-right ml-2 text-sm"
              aria-hidden="true"
            ></i>
          </Link>
        </div>

        {/* Category tabs with improved accessibility */}
        <div className="flex flex-wrap mb-8 border-b border-gray-200">
          {["featured", "bestsellers", "new"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-2 text-sm md:text-base border-b-2 transition-all duration-300 font-medium
                ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-text/70 hover:text-primary"
                }`}
              aria-selected={activeTab === tab ? "true" : "false"}
              aria-controls={`${tab}-panel`}
              role="tab"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Products grid with responsive layout */}
        {Object.keys(products).map((key) => (
          <div
            key={key}
            id={`${key}-panel`}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 ${
              activeTab === key ? "block" : "hidden"
            }`}
            role="tabpanel"
            aria-labelledby={`${key}-tab`}
          >
            {products[key].map((product) => (
              <div
                key={product.id}
                className="group relative border border-accent/80 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300"
              >
                <div className="relative aspect-[3/4] bg-gray-100">
                  {/* Discount badge */}
                  {product.discount && (
                    <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                      {product.discount}
                    </span>
                  )}

                  {/* New badge */}
                  {product.isNew && (
                    <span className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                      NEW
                    </span>
                  )}

                  {/* Cart icon - visible on hover or focus */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="absolute bottom-3 right-3 bg-accent text-white w-10 h-10 rounded-full flex items-center justify-center
                    opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300
                    hover:bg-primary active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary z-10"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <i className="fas fa-shopping-cart" aria-hidden="true"></i>
                  </button>

                  {/* Product image with link */}
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                </div>

                <Link
                  to={`/products/${product.id}`}
                  className="block focus:outline-none"
                >
                  <div className="p-4 border-primary group-hover:border-b-4 transition-all duration-300">
                    <h3 className="font-bold text-text group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-text/70 text-sm">{product.author}</p>

                    <div className="flex items-center mb-2 mt-2">
                      <div
                        className="flex mr-1"
                        aria-label={`Rated ${product.rating} out of 5 stars`}
                      >
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-text/60 text-xs">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-text/60 text-sm line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ))}

        {/* Mobile view - show more button */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Products;
