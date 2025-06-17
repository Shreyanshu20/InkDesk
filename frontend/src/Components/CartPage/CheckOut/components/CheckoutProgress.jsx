import React from "react";

const CheckoutProgress = ({ step }) => {
  // Define the steps for the checkout process
  const steps = [
    { number: 1, title: "Shipping", icon: "fas fa-truck" },
    { number: 2, title: "Payment", icon: "fas fa-credit-card" },
    { number: 3, title: "Review", icon: "fas fa-check-circle" },
  ];

  return (
    <div className="max-w-4xl mx-auto mb-4 md:mb-8">
      <div className="flex items-center justify-between">
        <div className="w-full flex justify-between relative">
          {/* Background line - Mobile version */}
          <div
            className="md:hidden absolute h-0.5 bg-gray-200 dark:bg-gray-500"
            style={{ top: "20px", left: "20px", right: "20px" }}
          ></div>

          {/* Progress overlay - Mobile version */}
          <div
            className="md:hidden absolute h-1 bg-primary transition-all duration-500 ease-out"
            style={{
              top: "20px",
              left: "20px",
              width:
                step === 1
                  ? "0%"
                  : step === 2
                  ? "calc(50% - 20px)"
                  : "calc(100% - 40px)",
            }}
          ></div>

          {/* Background line - Desktop version */}
          <div
            className="hidden md:block absolute h-0.5 bg-gray-200 dark:bg-gray-500"
            style={{ top: "28px", left: "28px", right: "28px" }}
          ></div>

          {/* Progress overlay - Desktop version */}
          <div
            className="hidden md:block absolute h-1.5 bg-primary transition-all duration-500 ease-out"
            style={{
              top: "28px",
              left: "28px",
              width:
                step === 1
                  ? "0%"
                  : step === 2
                  ? "calc(50% - 28px)"
                  : "calc(100% - 56px)",
            }}
          ></div>

          <div className="flex justify-between w-full">
            {/* Map through the steps to create each step indicator */}
            {steps.map((s, index) => (
              <div key={s.number} className="relative flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center
                  ${
                    step >= s.number
                      ? "bg-primary border-primary text-white"
                      : "bg-background border-gray-300 dark:border-gray-500 text-gray-400"
                  }`}
                >
                  <i className={`${s.icon} text-sm md:text-xl`}></i>
                </div>
                <p
                  className={`mt-1 md:mt-2 text-xs font-medium
                  ${step >= s.number ? "text-primary" : "text-text/50"}`}
                >
                  {s.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;
