import React from "react";

const PaymentCodForm = () => {
  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-background">
      <div className="flex items-start">
        <i className="fas fa-info-circle mt-1 mr-3"></i>
        <div>
          <p className="text-text/80">
            Pay with cash upon delivery. Please have the exact amount ready.
          </p>
          <p className="text-sm text-text/60 mt-1">
            Note: An additional charge of ₹40 will be applied for Cash on
            Delivery orders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCodForm;
