import React from "react";
import { Link } from "react-router-dom";

function OfficeSupplies() {
  const officeSuppliesItems = [
    {
      id: 1,
      name: "Calculators",
      image: "/Office Supplies/calculators.webp",
      link: "/shop/category/office-supplies/calculators",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      name: "Cutters",
      image: "/Office Supplies/cutters.webp",
      link: "/shop/category/office-supplies/cutters",
      bgColor: "bg-pink-50",
    },
    {
      id: 3,
      name: "Folders and Filing",
      image: "/Office Supplies/folders.webp",
      link: "/shop/category/office-supplies/folders-and-filing",
      bgColor: "bg-cyan-50",
    },
    {
      id: 4,
      name: "Glue and Adhesives",
      image: "/Office Supplies/glue-adhesives.webp",
      link: "/shop/category/office-supplies/glue-and-adhesives",
      bgColor: "bg-purple-50",
    },
    {
      id: 5,
      name: "Organizers",
      image: "/Office Supplies/organizers.webp",
      link: "/shop/category/office-supplies/organizers",
      bgColor: "bg-orange-50",
    },
    {
      id: 6,
      name: "Paperclips and Rubber Bands",
      image: "/Office Supplies/paperclips.webp",
      link: "/shop/category/office-supplies/paperclips-and-rubber-bands",
      bgColor: "bg-green-50",
    },
    {
      id: 7,
      name: "Punches",
      image: "/Office Supplies/punches.webp",
      link: "/shop/category/office-supplies/punches",
      bgColor: "bg-indigo-50",
    },
    {
      id: 8,
      name: "Scissors and Paper Trimmers",
      image: "/Office Supplies/scissors.webp",
      link: "/shop/category/office-supplies/scissors-and-paper-trimmers",
      bgColor: "bg-red-50",
    },
    {
      id: 9,
      name: "Staplers and Pins",
      image: "/Office Supplies/stapler.webp",
      link: "/shop/category/office-supplies/staplers-and-pins",
      bgColor: "bg-teal-50",
    },
    {
      id: 10,
      name: "Whiteboards and Markers",
      image: "/Office Supplies/markers.webp",
      link: "/shop/category/office-supplies/whiteboards-and-markers",
      bgColor: "bg-violet-50",
    },
  ];

  return (
    <section className="py-10 px-4 md:px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-3 md:mb-4">
            Complete Your Office with Essential Supplies
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
          {officeSuppliesItems.map((item) => (
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
            to="/shop/category/office-supplies"
            className="inline-flex items-center px-4 md:px-6 py-2 md:py-2.5 lg:py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors duration-300 text-sm md:text-base"
          >
            View All Office Supplies
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div> */}
      </div>
    </section>
  );
}

export default OfficeSupplies;