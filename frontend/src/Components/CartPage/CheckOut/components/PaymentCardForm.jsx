import React from "react";

const PaymentCardForm = ({
  paymentDetails,
  handlePaymentInput,
  handleCardHolderInput,
  handleCardNumberInput,
  handleExpiryDateInput,
  handleCVVInput,
}) => {
  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-6">
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <i className="fab fa-cc-visa text-2xl text-text/90"></i>
          <i className="fab fa-cc-mastercard text-2xl text-text/90"></i>
          <i className="fab fa-cc-amex text-2xl text-text/90"></i>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="cardHolder"
          className="block text-sm font-medium text-text/70 mb-1"
        >
          Card Holder Name *
        </label>
        <input
          type="text"
          id="cardHolder"
          name="cardHolder"
          value={paymentDetails.cardHolder}
          onChange={handleCardHolderInput}
          required
          placeholder="John Smith"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-text transition-all duration-300"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="cardNumber"
          className="block text-sm font-medium text-text/70 mb-1"
        >
          Card Number *
        </label>
        <div className="relative">
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={handleCardNumberInput}
            required
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-text transition-all duration-300"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <i className="far fa-credit-card text-text/40"></i>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="expiry"
            className="block text-sm font-medium text-text/70 mb-1"
          >
            Expiry Date *
          </label>
          <input
            type="text"
            name="expiryDate"
            value={paymentDetails.expiryDate || ""}
            onChange={handleExpiryDateInput}
            placeholder="MM/YY"
            maxLength="5"
            inputMode="numeric" // This helps mobile keyboards show numbers
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-text transition-all duration-300"
          />
        </div>

        <div>
          <label
            htmlFor="cvv"
            className="block text-sm font-medium text-text/70 mb-1"
          >
            CVV *
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={paymentDetails.cvv}
            onChange={handleCVVInput}
            required
            placeholder="123"
            maxLength="4"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-text transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentCardForm;
