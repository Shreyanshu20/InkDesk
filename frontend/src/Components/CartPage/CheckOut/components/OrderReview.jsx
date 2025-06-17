import React from "react";

const OrderReview = ({
  shippingDetails,
  paymentMethod,
  paymentDetails,
  cartItems,
  formatPrice,
  handleConfirmOrder,
  loading,
  setStep,
  giftMessage,
  showGiftMessageForm,
  handleGiftMessageChange,
  toggleGiftMessageForm,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg md:text-xl font-bold text-text flex items-center">
          <i className="fas fa-clipboard-check text-primary mr-2 md:mr-3"></i>
          Review Your Order
        </h2>
        <p className="text-xs md:text-sm text-text/60 mt-1">
          Please review your order details before placing your order
        </p>
      </div>

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2 md:mb-3">
            <h3 className="font-semibold text-text flex items-center text-sm md:text-base">
              <i className="fas fa-truck text-primary/70 mr-2"></i>
              Shipping Address
            </h3>
            <button
              onClick={() => setStep(1)}
              className="text-xs md:text-sm text-primary hover:text-primary/80 flex items-center transition-colors duration-200"
            >
              <i className="fas fa-pen mr-1"></i> Edit
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 md:p-4 rounded-lg">
            <div className="space-y-1">
              <p className="font-medium text-text text-sm md:text-base">
                {shippingDetails.firstName} {shippingDetails.lastName}
              </p>
              <p className="text-text/70 text-xs md:text-sm">{shippingDetails.address}</p>
              <p className="text-text/70 text-xs md:text-sm">
                {shippingDetails.city}, {shippingDetails.state}{" "}
                {shippingDetails.pincode}
              </p>
              <p className="text-text/70 text-xs md:text-sm">{shippingDetails.country}</p>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                <p className="text-text/70 text-xs md:text-sm">
                  <span className="font-medium">Phone:</span> {shippingDetails.phone}
                </p>
                <p className="text-text/70 text-xs md:text-sm">
                  <span className="font-medium">Email:</span> {shippingDetails.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 md:mb-3">
            <h3 className="font-semibold text-text flex items-center text-sm md:text-base">
              <i className="fas fa-credit-card text-primary/70 mr-2"></i>
              Payment Method
            </h3>
            <button
              onClick={() => setStep(2)}
              className="text-xs md:text-sm text-primary hover:text-primary/80 flex items-center transition-colors duration-200"
            >
              <i className="fas fa-pen mr-1"></i> Edit
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 md:p-4 rounded-lg">
            {paymentMethod === "card" && (
              <div className="flex items-center gap-2">
                <i className="far fa-credit-card text-primary text-lg md:text-xl mr-2 md:mr-3"></i>
                <div>
                  <p className="font-medium text-text pb-1 text-sm md:text-base">Credit/Debit Card</p>
                  <p className="text-text/70 text-xs md:text-sm pb-1">
                    {paymentDetails.cardNumber &&
                      `**** **** **** ${paymentDetails.cardNumber.replace(/\s/g, '').slice(-4)}`}
                  </p>
                  <p className="text-text/70 text-xs md:text-sm pb-1">{paymentDetails.cardHolderName}</p>
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="flex items-center gap-2">
                <i className="fas fa-mobile-alt text-primary text-lg md:text-xl mr-2 md:mr-3"></i>
                <div>
                  <p className="font-medium text-text pb-1 text-sm md:text-base">UPI Payment</p>
                  <p className="text-text/70 text-xs md:text-sm pb-1">{paymentDetails.upiId}</p>
                </div>
              </div>
            )}

            {paymentMethod === "wallet" && (
              <div className="flex items-center gap-2">
                <i className="fas fa-wallet text-primary text-lg md:text-xl mr-2 md:mr-3"></i>
                <div>
                  <p className="font-medium text-text pb-1 text-sm md:text-base">Digital Wallet</p>
                  <p className="text-text/70 text-xs md:text-sm pb-1">
                    {paymentDetails.selectedWallet === "paytm" && "Paytm Wallet"}
                    {paymentDetails.selectedWallet === "phonepe" && "PhonePe"}
                    {paymentDetails.selectedWallet === "amazonpay" && "Amazon Pay"}
                    {paymentDetails.selectedWallet === "googlepay" && "Google Pay"}
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="flex items-center gap-2">
                <i className="fas fa-money-bill-wave text-primary text-lg md:text-xl mr-2 md:mr-3"></i>
                <div>
                  <p className="font-medium text-text pb-1 text-sm md:text-base">Cash on Delivery</p>
                  <p className="text-text/70 text-xs md:text-sm pb-1">
                    Pay when you receive your order
                  </p>
                  <p className="text-orange-600 text-xs md:text-sm font-medium pb-1">
                    Additional ₹40 COD fee will be charged
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-text flex items-center mb-2 md:mb-3 text-sm md:text-base">
            <i className="fas fa-shopping-bag text-primary/70 mr-2"></i>
            Order Items ({cartItems.length}{" "}
            {cartItems.length === 1 ? 'item' : 'items'})
          </h3>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="hidden md:block">
              <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm text-gray-600 dark:text-gray-400">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-3 text-center">Total</div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {cartItems.map((item) => (
                <div key={item.id} className="p-3 md:p-4">
                  <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <div className="col-span-5 flex items-center">
                      <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 mr-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/120x160?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text line-clamp-2 text-base">
                          {item.name}
                        </h4>
                        <p className="text-sm text-text/60 mt-1 truncate">
                          {item.brand || item.author}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <span className="font-medium text-text">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <div className="col-span-2 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-8 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <span className="font-medium text-text text-sm">
                          {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-3 text-center">
                      <span className="font-semibold text-primary text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <div className="md:hidden flex items-start space-x-3">
                    <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/120x160?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text line-clamp-2 text-sm mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-text/60 mb-2">{item.brand || item.author}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-text/70">
                            {formatPrice(item.price)} × {item.quantity}
                          </span>
                        </div>
                        <span className="font-semibold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-3 md:py-4 px-3 md:px-20">
              <div className="flex justify-between items-center">
                <span className="font-medium text-text text-sm md:text-base">
                  Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
                <span className="font-bold text-primary text-base md:text-lg">
                  Subtotal: {formatPrice(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-3 md:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center">
              <i className="fas fa-gift text-blue-500 mr-2 md:mr-3"></i>
              <div>
                <p className="font-medium text-text text-sm md:text-base">
                  {giftMessage ? "Gift message added" : "Add a gift message"}
                </p>
                <p className="text-xs md:text-sm text-text/70">
                  {giftMessage
                    ? "Your personalized message will be included"
                    : "Include a personalized message with your order"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleGiftMessageForm}
              className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200 text-sm md:text-base"
            >
              {giftMessage ? "Edit" : "Add"}
            </button>
          </div>

          {giftMessage && !showGiftMessageForm && (
            <div className="mt-2 md:mt-3 pt-2 md:pt-3">
              <p className="text-xs md:text-sm text-text/80 italic">"{giftMessage}"</p>
            </div>
          )}

          {showGiftMessageForm && (
            <div className="mt-2 md:mt-3 pt-2 md:pt-3">
              <textarea
                value={giftMessage}
                onChange={handleGiftMessageChange}
                placeholder="Enter your gift message here..."
                className="bg-gray-50 dark:bg-gray-900 w-full p-2 md:p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white text-text resize-none text-sm md:text-base"
                rows="3"
                maxLength="200"
              ></textarea>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-text/60">
                  {giftMessage.length}/200 characters
                </span>
                <div className="space-x-2">
                  <button
                    onClick={toggleGiftMessageForm}
                    className="text-xs md:text-sm text-gray-600 hover:text-gray-700 px-2 md:px-3 py-1 rounded transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={toggleGiftMessageForm}
                    className="text-xs md:text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 md:px-4 py-1 rounded transition-colors duration-200"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-2 md:gap-0">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full md:w-auto bg-gray-50 dark:bg-gray-900 hover:bg-gray-50 hover:dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-gray-400 text-text/80 font-medium rounded-md px-4 md:px-6 py-2 md:py-3 transition-all duration-300 flex items-center justify-center text-sm md:text-base"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Payment
            </button>

            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={loading}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white font-medium rounded-md px-6 md:px-8 py-2 md:py-3 transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg text-sm md:text-base"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing Order...
                </span>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
