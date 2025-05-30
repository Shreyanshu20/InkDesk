import React, { useState } from "react";

function Contact() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here

    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with gradient styling */}
      <section className="relative py-20 bg-gradient-to-b from-secondary/20 to-background/80">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium mb-3 inline-block">
              <i className="fas fa-paper-plane mr-2"></i>We're here to help
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
              <span className="text-primary">Get in</span> Touch
            </h1>
            <div className="h-1 w-32 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-text/80 mb-8 leading-relaxed">
              Have questions about our products or services? We're here to help.
              Fill out the form below and our team will get back to you shortly.
            </p>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-24 bg-background"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}
        ></div>
      </section>
      <section className="bg-gradient-to-b from-background to-[#f8f5e6] to-100%">
        <div className="container mx-auto px-4 py-16 max-w-4xl -mt-8 ">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Contact Form */}
            <div className="bg-background/50 h-full p-8 rounded-2xl shadow-lg border border-primary/10">
              <h2 className="text-2xl font-bold mb-6 text-text flex items-center">
                <i className="fas fa-envelope-open-text text-primary mr-3"></i>
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary/60">
                      <i className="fas fa-user"></i>
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text transition"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary/60">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text transition"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-text mb-1"
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary/60">
                      <i className="fas fa-tag"></i>
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text transition"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-text mb-1"
                  >
                    Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 flex items-center pl-3 pointer-events-none text-primary/60">
                      <i className="fas fa-comment-dots"></i>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 pl-10 rounded-lg border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text transition"
                      placeholder="Tell us how we can assist you..."
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-5 py-3.5 transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  Send Message
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="bg-background/50 h-full p-8 rounded-2xl shadow-lg border border-primary/10">
              <h2 className="text-2xl font-bold mb-6 text-text flex items-center">
                <i className="fas fa-address-card text-primary mr-3"></i>
                Contact Information
              </h2>

              <div className="space-y-12">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text">Email</h3>
                    <p className="text-text/70">hello@inkdesk.com</p>
                    <p className="text-text/70">support@inkdesk.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text">Phone</h3>
                    <p className="text-text/70">+1 (555) 123-4567</p>
                    <p className="text-text/70">
                      <i className="far fa-clock text-primary/60 mr-2"></i>
                      Mon-Fri, 9am-6pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text">Address</h3>
                    <p className="text-text/70">123 Stationery Street</p>
                    <p className="text-text/70">New York, NY 10001</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10 mt-20">
                <h3 className="text-lg font-semibold mb-4 text-text flex items-center">
                  <i className="fas fa-share-alt text-primary mr-2"></i> Follow
                  Us
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href="#"
                    className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href="#"
                    className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href="#"
                    className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-text text-center flex items-center justify-center">
              <i className="fas fa-map-marked-alt text-primary mr-3"></i>
              Find <span className="text-primary ml-1">Us</span>
            </h2>
            <div className="bg-background/50 p-2 rounded-2xl shadow-lg border border-primary/10 h-96 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96708.34194156103!2d-74.03927096041242!3d40.75904032942872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sManhattan%2C%20New%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1673887847264!5m2!1sen!2s"
                className="w-full h-full rounded-xl"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="InkDesk Office Location"
              ></iframe>
            </div>
          </div>

          {/* FAQ Section with gradient background */}
          <div className="mt-16 py-16 px-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-8 text-text text-center flex items-center justify-center">
              <i className="fas fa-question-circle text-primary mr-3"></i>
              Frequently Asked{" "}
              <span className="text-primary ml-1">Questions</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#1a1212] p-6 rounded-xl shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-bold text-lg text-text mb-2 flex items-center">
                  <i className="fas fa-shipping-fast text-primary/70 mr-2"></i>
                  What are your shipping times?
                </h3>
                <p className="text-text/70 pl-6">
                  We offer 2-5 business day shipping on all orders within the
                  continental US. International shipping typically takes 7-14
                  business days.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1212] p-6 rounded-xl shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-bold text-lg text-text mb-2 flex items-center">
                  <i className="fas fa-undo-alt text-primary/70 mr-2"></i>
                  Do you offer returns?
                </h3>
                <p className="text-text/70 pl-6">
                  Yes, we offer a 30-day money-back guarantee on all our
                  products. Items must be unused and in original packaging.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1212] p-6 rounded-xl shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-bold text-lg text-text mb-2 flex items-center">
                  <i className="fas fa-truck text-primary/70 mr-2"></i>
                  How can I track my order?
                </h3>
                <p className="text-text/70 pl-6">
                  Once your order ships, you'll receive a confirmation email
                  with tracking information that allows you to monitor your
                  package's journey.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1212] p-6 rounded-xl shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-bold text-lg text-text mb-2 flex items-center">
                  <i className="fas fa-globe-americas text-primary/70 mr-2"></i>
                  Do you ship internationally?
                </h3>
                <p className="text-text/70 pl-6">
                  Yes, we ship worldwide! International shipping rates and
                  delivery times vary by location.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 py-12 px-8 rounded-3xl bg-gradient-to-r from-primary to-accent text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <i className="fas fa-pen text-9xl absolute top-10 left-10 transform -rotate-12"></i>
              <i className="fas fa-book text-8xl absolute bottom-10 right-10"></i>
              <i className="fas fa-bookmark text-7xl absolute top-1/2 left-1/4"></i>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Our customer service team is available to answer any questions
                you might have. Feel free to reach out and we'll get back to you
                as soon as possible.
              </p>
              <button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg">
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
