import React from "react";
import PaymentCardForm from "./PaymentCardForm";
import PaymentUpiForm from "./PaymentUpiForm";
import PaymentWalletForm from "./PaymentWalletForm";
import PaymentCodForm from "./PaymentCodForm";

const PaymentForm = ({
  paymentMethod,
  setPaymentMethod,
  paymentDetails,
  handlePaymentInput,
  handleCardHolderInput,
  handleCardNumberInput,
  handleExpiryDateInput,
  handleCVVInput,
  handlePaymentSubmit,
  loading,
  setStep,
  step,
  handleUpiInput,
  handleWalletSelection,
  isPaymentFormValid,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg md:text-xl font-bold text-text flex items-center">
          <i className="fas fa-credit-card text-primary mr-2 md:mr-3"></i>
          Payment Method
        </h2>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`group p-3 md:p-4 flex flex-col items-center justify-center rounded-lg border hover:text-secondary ${
              paymentMethod === "card"
                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-gray-300 dark:border-gray-600 bg-background hover:bg-secondary/10 hover:border-gray-400"
            } transition-all duration-300`}
          >
            <i
              className={`far fa-credit-card text-lg md:text-2xl mb-1 md:mb-2 ${
                paymentMethod === "card" ? "text-primary" : "text-text/80 group-hover:text-text"
              }`}
            ></i>
            <span
              className={`text-xs md:text-sm ${
                paymentMethod === "card"
                  ? "text-primary font-medium"
                  : "text-text/80 group-hover:text-text"
              }`}
            >
              Credit/Debit
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("upi")}
            className={`group p-3 md:p-4 flex flex-col items-center justify-center rounded-lg border ${
              paymentMethod === "upi"
                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-gray-300 dark:border-gray-600 bg-background hover:bg-secondary/10 hover:border-gray-400"
            } transition-all duration-300`}
          >
            <i
              className={`fas fa-mobile-alt text-lg md:text-2xl mb-1 md:mb-2 ${
                paymentMethod === "upi" ? "text-primary" : "text-text/80 group-hover:text-text"
              }`}
            ></i>
            <span
              className={`text-xs md:text-sm ${
                paymentMethod === "upi"
                   ? "text-primary font-medium"
                  : "text-text/80 group-hover:text-text"
              }`}
            >
              UPI
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("wallet")}
            className={`group p-3 md:p-4 flex flex-col items-center justify-center rounded-lg border ${
              paymentMethod === "wallet"
               ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-gray-300 dark:border-gray-600 bg-background hover:bg-secondary/10 hover:border-gray-400"
            } transition-all duration-300`}
          >
            <i
              className={`fas fa-wallet text-lg md:text-2xl mb-1 md:mb-2 ${
                paymentMethod === "wallet" ? "text-primary" : "text-text/80 group-hover:text-text"
              }`}
            ></i>
            <span
              className={`text-xs md:text-sm ${
                paymentMethod === "wallet"
                   ? "text-primary font-medium"
                  : "text-text/80 group-hover:text-text"
              }`}
            >
              Wallet
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("cod")}
            className={`group p-3 md:p-4 flex flex-col items-center justify-center rounded-lg border ${
              paymentMethod === "cod"
                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-gray-300 dark:border-gray-600 bg-background hover:bg-secondary/10 hover:border-gray-400"
            } transition-all duration-300`}
          >
            <i
              className={`fas fa-money-bill-wave text-lg md:text-2xl mb-1 md:mb-2 ${
                paymentMethod === "cod" ? "text-primary" : "text-text/80 group-hover:text-text"
              }`}
            ></i>
            <span
              className={`text-xs md:text-sm ${
                paymentMethod === "cod"
                   ? "text-primary font-medium"
                  : "text-text/80 group-hover:text-text"
              }`}
            >
              Cash on Delivery
            </span>
          </button>
        </div>

        <form onSubmit={handlePaymentSubmit}>
          {paymentMethod === "card" && (
            <PaymentCardForm
              paymentDetails={paymentDetails}
              handlePaymentInput={handlePaymentInput}
              handleCardHolderInput={handleCardHolderInput}
              handleCardNumberInput={handleCardNumberInput}
              handleExpiryDateInput={handleExpiryDateInput}
              handleCVVInput={handleCVVInput}
            />
          )}

          {paymentMethod === "upi" && (
            <PaymentUpiForm
              paymentDetails={paymentDetails}
              handleUpiInput={handleUpiInput}
            />
          )}

          {paymentMethod === "wallet" && (
            <PaymentWalletForm
              paymentDetails={paymentDetails}
              handleWalletSelection={handleWalletSelection}
            />
          )}

          {paymentMethod === "cod" && <PaymentCodForm />}

          <div className="mt-6 md:mt-8 flex flex-col-reverse md:flex-row justify-between gap-2 md:gap-0">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full md:w-auto bg-background hover:bg-accent/10 border border-gray-300 dark:border-gray-600 hover:border-gray-400 text-text/80 font-medium rounded-md px-4 md:px-6 py-2 md:py-3 transition-all duration-300 flex items-center justify-center text-sm md:text-base"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Shipping
            </button>

            {isPaymentFormValid() ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-medium rounded-md px-6 md:px-8 py-2 md:py-3 transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg text-sm md:text-base"
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
                    Processing...
                  </span>
                ) : (
                  <>
                    Continue to Review
                    <i className="fas fa-arrow-right ml-2"></i>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full md:w-auto bg-gray-300 text-gray-500 font-medium rounded-md px-6 md:px-8 py-2 md:py-3 cursor-not-allowed flex items-center justify-center text-sm md:text-base"
              >
                Complete Payment Details
                <i className="fas fa-lock ml-2"></i>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
