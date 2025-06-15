import React from "react";
import { Link } from "react-router-dom";

function Stationery() {
  const stationeryItems = [
    {
      id: 1,
      name: "Pens",
      image: "/stationery/pen.jpg",
      link: "/shop/category/stationery/pens",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      name: "Pencils",
      image: "/stationery/penscils.webp",
      link: "/shop/category/stationery/pencils",
      bgColor: "bg-pink-50",
    },
    {
      id: 3,
      name: "Notebooks",
      image: "/stationery/notebook.webp",
      link: "/shop/category/stationery/notebooks",
      bgColor: "bg-cyan-50",
    },
    {
      id: 4,
      name: "Highlighters",
      image: "/stationery/highligters.webp",
      link: "/shop/category/stationery/highlighters",
      bgColor: "bg-purple-50",
    },
    {
      id: 5,
      name: "Journals",
      image: "/stationery/journels.webp",
      link: "/shop/category/stationery/journals",
      bgColor: "bg-yellow-50",
    },
    {
      id: 6,
      name: "Planners",
      image: "/stationery/planners.webp",
      link: "/shop/category/stationery/planners",
      bgColor: "bg-orange-50",
    },
    {
      id: 7,
      name: "To-Do Lists",
      image: "/stationery/todo.webp",
      link: "/shop/category/stationery/to-do-lists",
      bgColor: "bg-green-50",
    },
    {
      id: 8,
      name: "Sticky Notes",
      image: "/stationery/stickynotes.webp",
      link: "/shop/category/stationery/sticky-notes",
      bgColor: "bg-indigo-50",
    },
    {
      id: 9,
      name: "Erasers",
      image: "/stationery/eraser.jpg",
      link: "/shop/category/stationery/erasers",
      bgColor: "bg-red-50",
    },
    {
      id: 10,
      name: "Sharpeners",
      image: "/stationery/spraners.webp",
      link: "/shop/category/stationery/sharpeners",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <section className="py-10 px-4 md:px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-3 md:mb-4">
            Elevate Your Workspace with Premium Stationery
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
          {stationeryItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div
                className={`${item.bgColor} dark:bg-gray-700 aspect-square flex items-center justify-center p-2 md:p-3 lg:p-4`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-103 transition-all duration-300"
                />
              </div>
              <div className="p-3 md:p-4 text-center">
                <h3 className="text-sm md:text-base lg:text-lg font-medium text-text group-hover:text-primary transition-colors duration-300">
                  {item.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        {/* <div className="text-center mt-8 md:mt-12">
          <Link
            to="/shop/category/stationery"
            className="inline-flex items-center px-4 md:px-6 py-2 md:py-2.5 lg:py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors duration-300 text-sm md:text-base"
          >
            View All Stationery
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div> */}
      </div>
    </section>
  );
}

export default Stationery;
