import React from "react";

const PaymentUpiForm = ({
  paymentDetails,
  handlePaymentInput,
  handleUpiInput,
}) => {
  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 md:p-6">
      <div className="mb-3 md:mb-4">
        <label
          htmlFor="upiId"
          className="block text-xs md:text-sm font-medium text-text/70 mb-1"
        >
          Enter UPI ID *
        </label>
        <div className="relative">
          <input
            type="text"
            id="upiId"
            name="upiId"
            value={paymentDetails.upiId}
            onChange={handleUpiInput}
            required
            placeholder="yourname@upi"
            className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-text transition-all duration-300 text-sm md:text-base"
          />
        </div>
        <p className="text-xs text-text/60 mt-1">
          Example: yourname@okicici, yourname@ybl, etc.
        </p>
      </div>
    </div>
  );
};

export default PaymentUpiForm;
