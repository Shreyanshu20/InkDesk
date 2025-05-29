import React, { useState } from "react";

function Banner() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim() || !email.includes('@')) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({ type: "success", text: "Thank you for subscribing!" });
      setEmail("");

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }, 1500);
  };

  return (
    <section 
      className="w-full bg-[#F8D7D5] bg-[url(/src/assets/banner.webp)] py-12 md:py-16 px-4 relative overflow-hidden" 
      aria-labelledby="discount-banner-heading"
    >
      {/* Background overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/5"></div>
      
      <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
        {/* Banner content */}
        <div className="text-center max-w-2xl bg-white/80 p-6 md:p-8 rounded-xl shadow-lg backdrop-blur-sm">
          <div className="inline-block bg-primary text-white p-2 rounded-full mb-4">
            <i className="fas fa-tags text-xl" aria-hidden="true"></i>
          </div>

          <h2 id="discount-banner-heading" className="text-3xl text-[#090708] md:text-4xl font-bold mb-3">
            Get <span className="text-[#E86A58]">10%</span> Off Your Order!
          </h2>
          
          <p className="text-gray-700 mb-6">
            Enter your email and receive a 10% discount on your next order!
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-xl w-full mx-auto"
            aria-describedby={message ? "banner-message" : undefined}
          >
            <div className="flex-grow relative">
              <label htmlFor="banner-email-input" className="sr-only">Email address</label>
              <input
                id="banner-email-input"
                type="email"
                placeholder="Your email address"
                className="w-full px-5 py-3 rounded-full border-0 text-[#090708] focus:ring-2 focus:ring-[#E86A58]/30 outline-none shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#E86A58] hover:bg-[#E65443] text-white px-6 py-3 rounded-full transition-colors flex items-center justify-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E86A58]"
              aria-label={isSubmitting ? "Subscribing..." : "Subscribe for 10% off"}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-circle-notch fa-spin mr-2" aria-hidden="true"></i>
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  Subscribe <i className="fas fa-arrow-right ml-2" aria-hidden="true"></i>
                </>
              )}
            </button>
          </form>

          {message && (
            <div
              id="banner-message"
              role="status"
              aria-live="polite"
              className={`mt-4 px-4 py-2 rounded-md ${
                message.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message.type === "error" ? (
                <i className="fas fa-exclamation-circle mr-2" aria-hidden="true"></i>
              ) : (
                <i className="fas fa-check-circle mr-2" aria-hidden="true"></i>
              )}
              {message.text}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Banner;
