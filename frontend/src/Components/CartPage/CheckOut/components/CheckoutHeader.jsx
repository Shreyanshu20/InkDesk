const CheckoutHeader = () => {
  return (
    <section className="py-4 md:py-8 bg-gradient-to-b from-secondary/20 to-background/80">
      <div className="container mx-auto px-3 md:px-4 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-text mb-2">
            <span className="text-primary">Checkout</span>
          </h1>
          <div className="h-1 w-12 md:w-16 bg-primary mx-auto"></div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutHeader;