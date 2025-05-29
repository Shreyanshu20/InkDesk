import React from "react";

function QuantitySelector({ quantity, onChange, min = 1, max = 100 }) {
  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || min;
    if (value >= min && value <= max) {
      onChange(value);
    }
  };

  return (
    <div className="flex shadow-sm">
      <button
        className="w-10 h-10 bg-background border border-gray-300 dark:border-gray-600 flex items-center justify-center rounded-l hover:bg-gray-100 hover:dark:bg-gray-600 transition-colors"
        onClick={handleDecrement}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        <i className="fas fa-minus text-xs text-text/70"></i>
      </button>

      <input
        type="text"
        value={quantity}
        onChange={handleInputChange}
        className="w-14 h-10 border-t border-b border-gray-300 dark:border-gray-600 text-center focus:outline-none focus:border-primary bg-background text-text"
        aria-label="Quantity"
      />

      <button
        className="w-10 h-10 bg-background border border-gray-300 dark:border-gray-600 flex items-center justify-center rounded-r hover:bg-gray-100 hover:dark:bg-gray-600 transition-colors"
        onClick={handleIncrement}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        <i className="fas fa-plus text-xs text-text/70"></i>
      </button>
    </div>
  );
}

export default QuantitySelector;
