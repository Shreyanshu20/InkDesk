import React from "react";

const CartItems = ({
  cartItems,
  handleQuantityChange,
  handleInputChange,
  removeItem,
  formatPrice,
}) => {
  const handleProductNavigation = (productId) => {
    window.location.href = `/shop/product/${productId}`;
  };

  const handleShopNavigation = () => {
    window.location.href = '/shop';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-base md:text-lg font-bold text-text flex items-center">
          <i className="fas fa-shopping-bag text-primary mr-2"></i>
          <span className="hidden md:inline">Cart Items ({cartItems.length})</span>
          <span className="md:hidden">Cart ({cartItems.length})</span>
        </h2>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 text-text/70 text-sm">
            <tr>
              <th className="py-3 px-4 md:py-4 md:px-6 text-left">Product</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-center">Price</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-center">Quantity</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-center">Total</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {cartItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-4 px-4 md:py-6 md:px-6">
                  <div className="flex items-center">
                    <div className="w-12 h-16 md:w-16 md:h-20 flex-shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/150x200?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="ml-3 md:ml-4">
                      <button
                        onClick={() => handleProductNavigation(item.productId)}
                        className="text-sm md:text-base font-medium text-text hover:text-primary transition-colors text-left line-clamp-2"
                      >
                        {item.name}
                      </button>
                      <p className="text-xs md:text-sm text-text/60 mt-1">{item.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 md:py-6 md:px-6 text-center font-medium text-sm md:text-base">
                  {formatPrice(item.price)}
                </td>
                <td className="py-4 px-4 md:py-6 md:px-6">
                  <div className="flex justify-center">
                    <button
                      className="w-7 h-7 md:w-8 md:h-8 bg-background border border-gray-300 dark:border-gray-600 flex items-center justify-center rounded-l hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <i className="fas fa-minus text-xs text-text/70"></i>
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(item.id, e.target.value)}
                      className="w-8 h-7 md:w-10 md:h-8 border-t border-b border-gray-300 dark:border-gray-600 text-center focus:outline-none focus:border-primary text-text bg-background/80 text-xs md:text-sm"
                    />
                    <button
                      className="w-7 h-7 md:w-8 md:h-8 bg-background border border-gray-300 dark:border-gray-600 flex items-center justify-center rounded-r hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleQuantityChange(item.id, 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <i className="fas fa-plus text-xs text-text/70"></i>
                    </button>
                  </div>
                  {item.stock < 10 && (
                    <div className="text-xs text-orange-600 mt-1 text-center font-medium">
                      Only {item.stock} left!
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 md:py-6 md:px-6 text-center font-medium text-primary text-sm md:text-base">
                  {formatPrice(item.totalPrice || (item.price * item.quantity))}
                </td>
                <td className="py-4 px-4 md:py-6 md:px-6 text-center">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                    aria-label="Remove item"
                  >
                    <i className="fas fa-trash-alt text-sm"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {cartItems.map((item) => (
            <div key={item.id} className="p-3">
              <div className="flex items-start space-x-3">
                {/* Product Image */}
                <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/150x200?text=No+Image";
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => handleProductNavigation(item.productId)}
                    className="text-sm font-medium text-text hover:text-primary transition-colors text-left line-clamp-2 mb-1"
                  >
                    {item.name}
                  </button>
                  <p className="text-xs text-text/60 mb-2">{item.brand}</p>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-sm font-medium text-text">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-xs text-text/60 ml-1">each</span>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {formatPrice(item.totalPrice || (item.price * item.quantity))}
                    </div>
                  </div>

                  {/* Stock Warning */}
                  {item.stock < 10 && (
                    <div className="text-xs text-orange-600 mb-2 font-medium">
                      Only {item.stock} left!
                    </div>
                  )}

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        className="w-7 h-7 bg-background border border-gray-300 dark:border-gray-600 flex items-center justify-center rounded-l hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <i className="fas fa-minus text-xs text-text/70"></i>
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(item.id, e.target.value)}
                        className="w-10 h-7 border-t border-b border-gray-300 dark:border-gray-600 text-center focus:outline-none focus:border-primary text-text bg-background/80 text-xs"
                      />
                      <button
                        className="w-7 h-7 bg-background border border-gray-300 dark:border-gray-600 flex items-center justify-center rounded-r hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <i className="fas fa-plus text-xs text-text/70"></i>
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <i className="fas fa-trash-alt text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 md:p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleShopNavigation}
          className="inline-flex items-center text-text hover:text-primary px-3 py-2 rounded-md transition-colors duration-300 text-sm"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CartItems;
