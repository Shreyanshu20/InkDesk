import React from 'react';
import { Link } from 'react-router-dom';

const RelatedProducts = ({ formatPrice }) => {
  const products = [
    {
      id: 4,
      name: "The Frost Kingdom",
      author: "Karla Newman",
      image: "https://placehold.co/200x250?text=Book+1",
      price: 1199,
    },
    {
      id: 5,
      name: "Silver Thaw",
      author: "Karla Newman",
      image: "https://placehold.co/200x250?text=Book+2",
      price: 1299,
    },
    {
      id: 6,
      name: "Winter's Edge",
      author: "Karla Newman",
      image: "https://placehold.co/200x250?text=Prequel",
      price: 999,
    },
    {
      id: 7,
      name: "Art Supplies Bundle",
      author: "InkDesk Collection",
      image: "https://placehold.co/200x250?text=Art+Bundle",
      price: 2499,
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-text">
            <i className="fas fa-thumbs-up text-primary/70 mr-3"></i>
            You May Also Like
          </h2>
          <div className="">
            <Link
              to="/shop"
              className="flex items-center gap-2 bg-primary/10 p-3 px-4 rounded-full text-primary hover:text-primary/80 hover:bg-primary/20 transition-all duration-300"
            >
              View All
              <i className="fas fa-arrow-right text-primary/70"></i>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group border-b-4 border-transparent hover:border-primary"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-text line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-text/60 mb-2">
                  {product.author}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  <button className="text-primary hover:text-primary/80">
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;