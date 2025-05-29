import React from "react";

function OrderServices() {
  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 px-6 pb-6 rounded-b-2xl">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <i className="fas fa-shipping-fast text-primary mt-1"></i>
            <p className="text-sm text-text/70">
              <span className="font-medium text-text">Free delivery</span> on
              orders over ₹499{" "}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <i className="fas fa-exchange-alt text-primary mt-1"></i>
            <p className="text-sm text-text/70">
              <span className="font-medium text-text">30-day returns</span> on
              all products
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <i className="fas fa-shield-alt text-primary mt-1"></i>
            <p className="text-sm text-text/70">
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
