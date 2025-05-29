import React, { useState } from "react";

function Newsletter() {
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
      className="w-full bg-primary/10 py-12 md:py-16 px-6 relative overflow-hidden" 
      aria-labelledby="newsletter-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <i className="fas fa-envelope-open text-8xl absolute top-10 left-10 transform -rotate-12" aria-hidden="true"></i>
        <i className="fas fa-paper-plane text-7xl absolute bottom-10 right-10" aria-hidden="true"></i>
      </div>
      
      <div className="max-w-6xl mx-auto flex flex-col items-center relative">
        {/* Newsletter content */}
        <div className="text-center max-w-2xl">
          <i className="fas fa-envelope-open-text text-primary text-2xl lg:text-3xl mb-4" aria-hidden="true"></i>

          <h2 id="newsletter-heading" className="text-2xl lg:text-3xl md:text-3xl font-bold mb-3 text-text">
            Subscribe to Our Newsletter
          </h2>

          <p className="text-text/70 mb-6 px-4 text-sm md:text-md">
            Stay updated with our latest releases, articles, and exclusive
            offers. Be the first to know about new products and promotions.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-xl w-full mx-auto"
            aria-describedby={message ? "newsletter-message" : undefined}
          >
            <div className="flex-grow relative">
              <label htmlFor="email-input" className="sr-only">Email address</label>
              <input
                id="email-input"
                type="email"
                placeholder="Your email address"
                className="w-full px-5 py-3 rounded-lg border border-gray-300 text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center whitespace-nowrap font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-label={isSubmitting ? "Subscribing..." : "Subscribe to newsletter"}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-circle-notch fa-spin mr-2" aria-hidden="true"></i>
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  Subscribe <i className="fas fa-paper-plane ml-2" aria-hidden="true"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-sm text-text/60">
            We respect your privacy. Unsubscribe at any time.
          </div>

          {message && (
            <div
              id="newsletter-message"
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

export default Newsletter;
