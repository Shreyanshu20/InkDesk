import React from "react";
import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      id: 1,
      title: "Notebooks & Journals",
      products: "24 products",
      image: "",
      color: "bg-amber-200",
      link: "/shop/notebooks",
    },
    {
      id: 2,
      title: "Writing Instruments",
      products: "18 products",
      image: "",
      link: "/shop/writing",
    },
    {
      id: 3,
      title: "Arts & Craft Supplies",
      products: "15 products",
      image: "",
      link: "/shop/arts-crafts",
    },
    {
      id: 4,
      title: "Desk Organizers",
      products: "12 products",
      image: "",
      link: "/shop/organizers",
    },
    {
      id: 5,
      title: "Planners & Calendars",
      products: "9 products",
      image: "",
      link: "/shop/planners",
    },
    {
      id: 6,
      title: "Premium Books",
      products: "21 products",
      image: "",
      link: "/shop/books",
    },
  ];

  return (
    <section
      className="bg-background py-8 px-4 md:px-6 lg:p-16 md:py-24"
      aria-labelledby="categories-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section title with improved contrast and hierarchy */}
        <div className="mb-8 lg:mb-12 text-center">
          <h2
            id="categories-heading"
            className="text-2xl md:text-4xl font-bold text-text mb-4"
          >
            Browse Categories
          </h2>
          <div className="h-1 w-24 bg-primary mx-auto lg:mb-6 mb-3"></div>
          <p className="text-text/70 max-w-2xl mx-auto">
            Explore our curated collection of fine stationery and office
            supplies
          </p>
        </div>

        {/* Categories grid with responsive design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              to={category.link}
              key={category.id}
              className="group relative overflow-hidden rounded-xl shadow-md h-48 md:h-[250px] transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-4"
              aria-labelledby={`category-${category.id}`}
            >
              {/* Background color */}
              <div className={`absolute inset-0 ${category.color}`}></div>

              {/* Product image with proper loading attribute */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt=""
                  className="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/5 group-hover:from-black/40 transition-all duration-300"></div>

              {/* Category info with enhanced contrast */}
              <div className="absolute bottom-0 left-0 p-6 z-10 w-full">
                <h3
                  id={`category-${category.id}`}
                  className="text-white text-xl font-bold mb-1 drop-shadow-sm"
                >
                  {category.title}
                </h3>
                <p className="text-white/90 text-sm">{category.products}</p>
              </div>

              {/* Arrow indicator (only visible on hover) */}
              <div className="flex justify-center absolute right-4 bottom-4 bg-primary rounded-full p-2 px-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <i
                  className="fas fa-arrow-right text-white"
                  aria-hidden="true"
                ></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
