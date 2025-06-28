function OrderServices() {
  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 md:p-6 rounded-b-lg md:rounded-b-xl">
        <div className="space-y-2">
          <div className="flex items-end space-x-2">
            <i className="fas fa-shipping-fast text-primary mt-1"></i>
            <p className="text-xs text-text/70">
              <span className="font-medium text-text">Free delivery</span> on
              orders over ₹499
            </p>
          </div>
          <div className="flex items-end space-x-2">
            <i className="fas fa-exchange-alt text-primary mt-1"></i>
            <p className="text-xs text-text/70">
              <span className="font-medium text-text">10-day returns</span> on
              all products
            </p>
          </div>
          <div className="flex items-end space-x-2">
            <i className="fas fa-shield-alt text-primary mt-1"></i>
            <p className="text-xs text-text/70">
              <span className="font-medium text-text">Secure payment</span> with
              encryption
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderServices;
