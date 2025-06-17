import React, { useContext, useState } from "react";
import { AppContent } from "../../Context/AppContent.jsx";
import { toast } from "react-toastify";

function Contact() {
  const { backendUrl } = useContext(AppContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${backendUrl}/contact/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with responsive gradient styling */}
      <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-b from-secondary/20 to-background/80">
        <div className="container mx-auto px-3 md:px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium mb-2 md:mb-3 inline-block text-sm md:text-base">
              <i className="fas fa-paper-plane mr-2"></i>We're here to help
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-4 md:mb-6">
              <span className="text-primary">Get in</span> Touch
            </h1>
            <div className="h-1 w-16 md:w-32 bg-primary mx-auto mb-6 md:mb-8"></div>
            <p className="text-base md:text-lg text-text/80 mb-6 md:mb-8 leading-relaxed px-4">
              Have questions about our products or services? We're here to help.
              Fill out the form below and our team will get back to you shortly.
            </p>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-12 md:h-24 bg-background"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}
        ></div>
      </section>

      <section className="bg-background">
        <div className="container mx-auto px-3 md:px-4 py-8 md:py-12 lg:py-16 max-w-6xl -mt-4 md:-mt-8">
          {/* Contact Form and Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
            {/* Contact Form */}
            <div className="bg-gray-50 dark:bg-gray-900 h-full p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-lg border border-primary/10">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-text flex items-center">
                <i className="fas fa-envelope-open-text text-primary mr-2 md:mr-3 text-lg md:text-xl"></i>
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs md:text-sm font-medium text-text mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary/60">
                      <i className="fas fa-user text-sm md:text-base"></i>
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 md:px-4 md:py-3 pl-8 md:pl-10 rounded-lg border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text transition text-sm md:text-base"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs md:text-sm font-medium text-text mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary/60">
                      <i className="fas fa-envelope text-sm md:text-base"></i>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 md:px-4 md:py-3 pl-8 md:pl-10 rounded-lg border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text transition text-sm md:text-base"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs md:text-sm font-medium text-text mb-1"
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary/60">
                      <i className="fas fa-tag text-sm md:text-base"></i>
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 md:px-4 md:py-3 pl-8 md:pl-10 rounded-lg border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text transition text-sm md:text-base"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs md:text-sm font-medium text-text mb-1"
                  >
                    Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 md:top-3 left-0 flex items-center pl-3 pointer-events-none text-primary/60">
                      <i className="fas fa-comment-dots text-sm md:text-base"></i>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-3 py-2.5 md:px-4 md:py-3 pl-8 md:pl-10 rounded-lg border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text transition text-sm md:text-base resize-none"
                      placeholder="Tell us how we can assist you..."
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-4 py-3 md:px-5 md:py-3.5 transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 text-sm md:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <i className="fas fa-arrow-right ml-2"></i>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 dark:bg-gray-900 h-full p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-lg border border-primary/10">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-text flex items-center">
                <i className="fas fa-address-card text-primary mr-2 md:mr-3 text-lg md:text-xl"></i>
                Contact Information
              </h2>

              <div className="space-y-6 md:space-y-8 lg:space-y-12">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-full text-primary flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                    <i className="fas fa-envelope text-sm md:text-base"></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-text">
                      Email
                    </h3>
                    <p className="text-text/70 text-sm md:text-base">
                      support@inkdesk.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-full text-primary flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                    <i className="fas fa-phone-alt text-sm md:text-base"></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-text">
                      Phone
                    </h3>
                    <p className="text-text/70 text-sm md:text-base">
                      +91 1234567890
                    </p>
                    <p className="text-text/70 text-xs md:text-sm">
                      <i className="far fa-clock text-primary/60 mr-1 md:mr-2"></i>
                      Mon-Fri, 9am-6pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-full text-primary flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                    <i className="fas fa-map-marker-alt text-sm md:text-base"></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-text">
                      Address
                    </h3>
                    <p className="text-text/70 text-sm md:text-base">
                      221B, InkDesk Street, Stationery City, IN
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-8 lg:mt-20 p-4 md:p-6 bg-primary/5 rounded-xl border border-primary/10">
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-text flex items-center">
                  <i className="fas fa-share-alt text-primary mr-2 text-sm md:text-base"></i>
                  Follow Us
                </h3>
                <div className="flex space-x-3 md:space-x-4">
                  <a
                    href="#"
                    className="bg-primary/10 p-2 md:p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
                  >
                    <i className="fab fa-facebook-f text-sm md:text-base"></i>
                  </a>
                  <a
                    href="#"
                    className="bg-primary/10 p-2 md:p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
                  >
                    <i className="fab fa-instagram text-sm md:text-base"></i>
                  </a>
                  <a
                    href="#"
                    className="bg-primary/10 p-2 md:p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
                  >
                    <i className="fab fa-twitter text-sm md:text-base"></i>
                  </a>
                  <a
                    href="#"
                    className="bg-primary/10 p-2 md:p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
                  >
                    <i className="fab fa-linkedin-in text-sm md:text-base"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-8 md:mt-12 lg:mt-16">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-text text-center flex items-center justify-center">
              <i className="fas fa-map-marked-alt text-primary mr-2 md:mr-3 text-lg md:text-xl"></i>
              Find <span className="text-primary ml-1">Us</span>
            </h2>
            <div className="bg-background/50 p-1 md:p-2 rounded-xl md:rounded-2xl shadow-lg border border-primary/10 h-64 md:h-80 lg:h-96 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60329.27902482037!2d72.74109995!3d19.0821978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2s!4v1703847264582!5m2!1sen!2s"
                className="w-full h-full rounded-lg md:rounded-xl"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="InkDesk Office Location"
              ></iframe>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8 md:mt-12 lg:mt-16 py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8 rounded-2xl md:rounded-3xl">
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-text text-center flex flex-col md:flex-row items-center justify-center">
              <i className="fas fa-question-circle text-primary mr-0 md:mr-3 mb-2 md:mb-0 text-lg md:text-xl"></i>
              <span>
                Frequently Asked <span className="text-primary">Questions</span>
              </span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white dark:bg-[#1a1212] p-4 md:p-6 rounded-xl shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-bold text-base md:text-lg text-text mb-2 flex items-start">
                  <i className="fas fa-shipping-fast text-primary/70 mr-2 mt-1 text-sm md:text-base flex-shrink-0"></i>
                  <span>What are your shipping times?</span>
                </h3>
                <p className="text-text/70 pl-5 md:pl-6 text-sm md:text-base">
                  We offer 2-5 business day shipping on all orders within the
                  continental US. International shipping typically takes 7-14
                  business days.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1212] p-4 md:p-6 rounded-xl shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-bold text-base md:text-lg text-text mb-2 flex items-start">
                  <i className="fas fa-undo-alt text-primary/70 mr-2 mt-1 text-sm md:text-base flex-shrink-0"></i>
                  <span>Do you offer returns?</span>
                </h3>
                <p className="text-text/70 pl-5 md:pl-6 text-sm md:text-base">
                  Yes, we offer a 30-day money-back guarantee on all our
                  products. Items must be unused and in original packaging.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1212] p-4 md:p-6 rounded-xl shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-bold text-base md:text-lg text-text mb-2 flex items-start">
                  <i className="fas fa-truck text-primary/70 mr-2 mt-1 text-sm md:text-base flex-shrink-0"></i>
                  <span>How can I track my order?</span>
                </h3>
                <p className="text-text/70 pl-5 md:pl-6 text-sm md:text-base">
                  Once your order ships, you'll receive a confirmation email
                  with tracking information that allows you to monitor your
                  package's journey.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1212] p-4 md:p-6 rounded-xl shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-bold text-base md:text-lg text-text mb-2 flex items-start">
                  <i className="fas fa-globe-americas text-primary/70 mr-2 mt-1 text-sm md:text-base flex-shrink-0"></i>
                  <span>Do you ship internationally?</span>
                </h3>
                <p className="text-text/70 pl-5 md:pl-6 text-sm md:text-base">
                  Yes, we ship worldwide! International shipping rates and
                  delivery times vary by location.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 md:mt-12 lg:mt-16 py-8 md:py-10 lg:py-12 px-4 md:px-6 lg:px-8 rounded-2xl md:rounded-3xl bg-gradient-to-r from-primary to-accent text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <i className="fas fa-pen text-4xl md:text-6xl lg:text-9xl absolute top-4 md:top-6 lg:top-10 left-4 md:left-6 lg:left-10 transform -rotate-12"></i>
              <i className="fas fa-book text-3xl md:text-5xl lg:text-8xl absolute bottom-4 md:bottom-6 lg:bottom-10 right-4 md:right-6 lg:right-10"></i>
              <i className="fas fa-bookmark text-2xl md:text-4xl lg:text-7xl absolute top-1/2 left-1/4"></i>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-white/90 mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
                Our customer service team is available to answer any questions
                you might have. Feel free to reach out and we'll get back to you
                as soon as possible.
              </p>
              <button className="bg-white text-primary hover:bg-gray-100 px-4 py-2.5 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm md:text-base">
                <i className="fas fa-headset mr-2"></i>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
