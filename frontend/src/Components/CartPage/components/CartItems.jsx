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
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden border border-gray-300 dark:border-gray-600">
      <div className="p-6 border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-xl font-bold text-text flex items-center">
          <i className="fas fa-shopping-bag text-primary mr-3"></i>
          Cart Items ({cartItems.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200 dark:bg-gray-700 text-text/70 text-sm">
            <tr>
              <th className="py-4 px-6 text-left">Product</th>
              <th className="py-4 px-6 text-center">Price</th>
              <th className="py-4 px-6 text-center">Quantity</th>
              <th className="py-4 px-6 text-center">Total</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-600">
            {cartItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-700/20">
                <td className="py-6 px-6">
                  <div className="flex items-center">
                    <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/150x200?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handleProductNavigation(item.productId)}
                        className="text-base font-medium text-text hover:text-primary transition-colors text-left"
                      >
                        {item.name}
                      </button>
                      <p className="text-sm text-text/60 mt-1">{item.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-6 text-center font-medium">
                  {/* Display per unit price */}
                  {formatPrice(item.price)}
                </td>
                <td className="py-6 px-6">
                  <div className="flex justify-center">
                    <button
                      className="w-8 h-8 bg-background border border-gray-300 dark:border-gray-600 flex items-center justify-center rounded-l hover:bg-gray-100 hover:dark:bg-gray-700 transition-colors"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <i className="fas fa-minus text-xs text-text/70"></i>
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(item.id, e.target.value)}
                      className="w-10 h-8 border-t border-b border-gray-300 dark:border-gray-600 text-center focus:outline-none focus:border-primary text-text bg-background/80"
                    />
                    <button
                      className="w-8 h-8 bg-background border border-gray-300 dark:border-gray-600 flex items-center justify-center rounded-r hover:bg-gray-100 hover:dark:bg-gray-700 transition-colors"
                      onClick={() => handleQuantityChange(item.id, 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <i className="fas fa-plus text-xs text-text/70"></i>
                    </button>
                  </div>
                  {/* Show stock count only if low stock (less than 10) */}
                  {item.stock < 10 && (
                    <div className="text-xs text-orange-600 mt-1 text-center font-medium">
                      Only {item.stock} left!
                    </div>
                  )}
                </td>
                <td className="py-6 px-6 text-center font-medium text-primary">
                  {/* Display total price for this item */}
                  {formatPrice(item.totalPrice || (item.price * item.quantity))}
                </td>
                <td className="py-6 px-6 text-center">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Remove item"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 flex justify-between items-center bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-600">
        <button
          onClick={handleShopNavigation}
          className="inline-flex items-center bg-gray-50 dark:bg-gray-800 text-text hover:bg-gray-200/30 hover:dark:gray-700/20 px-4 py-2 rounded-md transition-colors duration-300"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CartItems;
