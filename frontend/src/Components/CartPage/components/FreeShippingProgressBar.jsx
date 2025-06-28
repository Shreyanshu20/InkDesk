const FreeShippingProgressBar = ({ amountForFreeShipping, freeShippingProgress, formatPrice }) => {
  if (amountForFreeShipping <= 0) return null;
  
  return (
    <div className="mb-4 md:mb-6 bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-2">
        <i className="fas fa-truck text-primary mr-2"></i>
        <p className="text-xs md:text-sm text-text">
          Add{" "}
          <span className="font-bold text-primary">
            {formatPrice(amountForFreeShipping)}
          </span>{" "}
          more to qualify for{" "}
          <span className="font-bold text-green-600">
            FREE shipping
          </span>
        </p>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${freeShippingProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FreeShippingProgressBar;