import React from 'react';

const CheckoutHeader = () => {
  return (
    <section className="py-8 bg-gradient-to-b from-secondary/20 to-background/80">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">
            <span className="text-primary">Checkout</span>
          </h1>
          <div className="h-1 w-16 bg-primary mx-auto"></div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutHeader;