import React from "react";
import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      id: 1,
      title: "Stationery",
      products: "120+ products",
      image: "stationery.jpg",
      icon: "fas fa-pen",
      color: "bg-blue-200",
      description: "Notebooks, pens, pencils & writing essentials",
      link: "/shop/category/stationery",
    },
    {
      id: 2,
      title: "Office Supplies",
      products: "85+ products",
      image: "officesupplies.webp", // Office desk with supplies
      icon: "fas fa-briefcase",
      color: "bg-green-200",
      description: "Organizers, folders, desk accessories & more",
      link: "/shop/category/office-supplies",
    },
    {
      id: 3,
      title: "Art Supplies",
      products: "95+ products",
      image:
        "art.jpg", // Art brushes and paints
      icon: "fas fa-palette",
      color: "bg-purple-200",
      description: "Paints, brushes, canvases & artistic tools",
      link: "/shop/category/art-supplies",
    },
    {
      id: 4,
      title: "Craft Materials",
      products: "75+ products",
      image:
        "craft.jpg", // Craft supplies and materials
      icon: "fas fa-cut",
      color: "bg-pink-200",
      description: "Paper, glue, scissors & DIY craft essentials",
      link: "/shop/category/craft-materials",
    },
  ];

  return (
    <section className="bg-background text-text py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Discover our comprehensive collection organized into four main
            categories
          </p>
        </div>

        {/* 4 Categories Grid - Perfect Squares */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              to={category.link}
              key={category.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Square Container */}
              <div className="aspect-square relative">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent group-hover:from-black/80 transition-all duration-300"></div>

                {/* Icon in Top Corner */}
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-primary/50 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-102 transition-transform duration-300">
                    <i className={`${category.icon} text-xl text-white`}></i>
                  </div>
                </div>

                {/* Content at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-2">
                    {category.products}
                  </p>
                  <p className="text-white/80 text-xs mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Shop Now Button */}
                  <div className="flex items-center text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    <span className="mr-2">Explore</span>
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-2xl transition-all duration-300"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-102"
          >
            <i className="fas fa-shopping-bag mr-3"></i>
            Shop All Products
            <i className="fas fa-arrow-right ml-3"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Categories;
