import React from 'react';

const PaymentWalletForm = ({ paymentDetails, handleWalletSelection }) => {
  const wallets = [
    { id: "paytm", name: "Paytm", image: "https://placehold.co/60x30?text=Paytm" },
    { id: "phonepe", name: "PhonePe", image: "https://placehold.co/60x30?text=PhonePe" },
    { id: "amazonpay", name: "Amazon Pay", image: "https://placehold.co/60x30?text=AmazonPay" },
    { id: "freecharge", name: "Freecharge", image: "https://placehold.co/60x30?text=Freecharge" }
  ];

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 md:p-6 bg-background">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
        {wallets.map(wallet => (
          <button
            key={wallet.id}
            type="button"
            onClick={() => handleWalletSelection(wallet.id)}
            className={`group p-3 md:p-4 border ${
              paymentDetails.selectedWallet === wallet.id
                ? "border-gray-400 bg-primary/5"
                : "border-gray-300 dark:border-gray-500 hover:border-gray-400"
            } rounded-lg hover:bg-secondary/10 transition-all duration-300 flex flex-col items-center`}
          >
            <img
              src={wallet.image}
              alt={wallet.name}
              className="h-6 md:h-8 mb-1 md:mb-2"
            />
            <span className={`text-xs md:text-sm ${
              paymentDetails.selectedWallet === wallet.id
                ? "text-text font-medium"
                : "text-text/50 group-hover:text-text"
            }`}>
              {wallet.name}
            </span>
          </button>
        ))}
      </div>

      <p className="text-center text-xs md:text-sm text-text/70 mt-2">
        {paymentDetails.selectedWallet 
          ? `You will be redirected to ${wallets.find(w => w.id === paymentDetails.selectedWallet)?.name} for payment` 
          : "Please select a wallet to continue"}
      </p>
    </div>
  );
};

export default PaymentWalletForm;