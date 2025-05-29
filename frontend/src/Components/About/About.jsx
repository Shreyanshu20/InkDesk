import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="bg-background">
      {/* Hero Section with improved styling */}
      <section className="relative py-24 bg-gradient-to-b from-accent/40 to-background/90">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium mb-3 inline-block">
              <i className="fas fa-book-open mr-2"></i>Since 2015
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
              Our Story
            </h1>
            <div className="h-1 w-32 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-text/80 mb-8 leading-relaxed">
              Discover the passion and dedication behind InkDesk, where our love
              for stationery and literature has created a unique space for
              creativity and knowledge.
            </p>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-24 bg-background"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}
        ></div>
      </section>

      {/* Our Mission with enhanced visuals */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="border-l-4 border-primary pl-4 mb-2">
                <span className="text-primary/80 uppercase tracking-wider text-sm font-medium">
                  Who we are
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
                Our Mission
              </h2>
              <div className="h-1 w-24 bg-primary mb-8"></div>
              <p className="text-text/80 mb-6 leading-relaxed">
                At InkDesk, we believe that quality stationery and books are
                more than just products—they're tools for creativity,
                expression, and learning. Our mission is to provide premium
                materials that inspire and empower individuals to bring their
                ideas to life and expand their horizons.
              </p>
              <p className="text-text/80 mb-8 leading-relaxed">
                We strive to curate collections that combine functionality,
                aesthetics, and sustainability, ensuring that every purchase not
                only meets your needs but also brings joy to your daily life.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center bg-primary text-white hover:bg-primary/90 px-7 py-3.5 rounded-full font-medium transition-colors shadow-md"
              >
                <i className="fas fa-shopping-bag mr-2"></i>
                Explore Our Products
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <img
                  src="/src/assets/about-mission.jpg"
                  alt="Our mission"
                  className="rounded-lg shadow-xl w-full object-cover h-[450px] border-4 border-white dark:border-[#1a1212]"
                />
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/10 rounded-lg z-[-1]"></div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/20 rounded-lg z-[-1]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey with timeline styling */}
      <section className="py-20 bg-gradient-to-b from-background to-[#f8f5e6] to-90%">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-primary/80 uppercase tracking-wider text-sm font-medium">
              <i className="fas fa-clock mr-2"></i>Our Growth
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
              Our Journey
            </h2>
            <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-background dark:bg-[#1a1212] p-8 rounded-lg shadow-md border-t-4 border-primary hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6 mx-auto">
                <span className="text-primary text-xl font-bold">2015</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                The Beginning
              </h3>
              <p className="text-white/80 text-center leading-relaxed">
                <i className="fas fa-store text-primary/60 mr-2"></i>
                InkDesk started as a small corner shop with a passion for unique
                stationery and carefully curated book collections.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1212] p-8 rounded-lg shadow-md border-t-4 border-primary hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6 mx-auto">
                <span className="text-primary text-xl font-bold">2019</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                Expansion
              </h3>
              <p className="text-white/80 text-center leading-relaxed">
                <i className="fas fa-chart-line text-primary/60 mr-2"></i>
                We expanded our catalog to include premium art supplies and
                office essentials, becoming a one-stop shop for creative minds.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1212] p-8 rounded-lg shadow-md border-t-4 border-primary hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6 mx-auto">
                <span className="text-primary text-xl font-bold">2022</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                Going Digital
              </h3>
              <p className="text-white/80 text-center leading-relaxed">
                <i className="fas fa-globe text-primary/60 mr-2"></i>
                Launch of our online store, bringing our carefully curated
                collections to customers around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values with improved cards */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-primary/80 uppercase tracking-wider text-sm font-medium mb-2 inline-block">
              <i className="fas fa-heart mr-2"></i>What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
              Our Core Values
            </h2>
            <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-text/80">
              These fundamental principles guide everything we do at InkDesk
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-[#1a1212] p-8 rounded-lg shadow-md hover:shadow-lg hover:translate-y-[-5px] border-b-4 border-primary transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-gem text-primary text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">
                Quality
              </h3>
              <p className="text-white/80 text-center leading-relaxed">
                We source only the finest materials and products that stand the
                test of time.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1212] p-8 rounded-lg shadow-md hover:shadow-lg hover:translate-y-[-5px] border-b-4 border-primary transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-leaf text-primary text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">
                Sustainability
              </h3>
              <p className="text-white/80 text-center leading-relaxed">
                We're committed to eco-friendly practices and sustainable
                product sourcing.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1212] p-8 rounded-lg shadow-md hover:shadow-lg hover:translate-y-[-5px] border-b-4 border-primary transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-award text-primary text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">
                Excellence
              </h3>
              <p className="text-white/80 text-center leading-relaxed">
                We strive for excellence in customer service and product
                curation.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1212] p-8 rounded-lg shadow-md hover:shadow-lg hover:translate-y-[-5px] border-b-4 border-primary transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-users text-primary text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">
                Community
              </h3>
              <p className="text-white/80 text-center leading-relaxed">
                Building a community of creators, thinkers, and book lovers
                worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section with improved cards */}
      <section className="py-20 bg-gradient-to-b from-background to-[#f8f5e6] to-90%">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-primary/80 uppercase tracking-wider text-sm font-medium mb-2 inline-block">
              <i className="fas fa-hands-helping mr-2"></i>Our People
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
              Meet Our Team
            </h2>
            <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-text/80">
              The passionate individuals behind InkDesk who bring their
              expertise and creativity to everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-[#1a1212] rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src="/src/assets/team-1.jpg"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-center gap-4">
                    <a
                      href="#"
                      className="text-white hover:text-primary transition-colors"
                    >
                      <i className="fab fa-linkedin text-lg"></i>
                    </a>
                    <a
                      href="#"
                      className="text-white hover:text-primary transition-colors"
                    >
                      <i className="fab fa-twitter text-lg"></i>
                    </a>
                    <a
                      href="#"
                      className="text-white hover:text-primary transition-colors"
                    >
                      <i className="fab fa-instagram text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-text">Sarah Johnson</h3>
                <p className="text-primary font-medium mb-4">
                  <i className="fas fa-briefcase mr-2 text-primary/70"></i>
                  Founder & CEO
                </p>
                <p className="text-white/80 text-sm leading-relaxed">
                  With a background in design and a lifelong love for books,
                  Sarah founded InkDesk to share her passion with the world.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1212] rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src="/src/assets/team-2.jpg"
                  alt="David Chen"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-center gap-4">
                    <a
                      href="#"
                      className="text-white hover:text-primary transition-colors"
                    >
                      <i className="fab fa-linkedin text-lg"></i>
                    </a>
                    <a
                      href="#"
                      className="text-white hover:text-primary transition-colors"
                    >
                      <i className="fab fa-twitter text-lg"></i>
                    </a>
                    <a
                      href="#"
                      className="text-white hover:text-primary transition-colors"
                    >
                      <i className="fab fa-instagram text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-text">David Chen</h3>
                <p className="text-primary font-medium mb-4">
                  <i className="fas fa-palette mr-2 text-primary/70"></i>
                  Creative Director
                </p>
                <p className="text-white/80 text-sm leading-relaxed">
                  David's eye for aesthetics and product design helps shape our
                  unique collections and visual identity.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1212] rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src="/src/assets/team-3.jpg"
                  alt="Maya Rodriguez"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-center gap-4">
                    <a
                      href="#"
                      className="text-white hover:text-primary transition-colors"
                    >
                      <i className="fab fa-linkedin text-lg"></i>
                    </a>
                    <a
                      href="#"
                      className="text-white hover:text-primary transition-colors"
                    >
                      <i className="fab fa-twitter text-lg"></i>
                    </a>
                    <a
                      href="#"
                      className="text-white hover:text-primary transition-colors"
                    >
                      <i className="fab fa-instagram text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-text">Maya Rodriguez</h3>
                <p className="text-primary font-medium mb-4">
                  <i className="fas fa-books mr-2 text-primary/70"></i>
                  Head of Curation
                </p>
                <p className="text-white/80 text-sm leading-relaxed">
                  With extensive experience in publishing, Maya brings her
                  expertise to curating our diverse book selections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section with improved styling */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-primary/80 uppercase tracking-wider text-sm font-medium mb-2 inline-block">
              <i className="fas fa-comments mr-2"></i>Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
              What Our Customers Say
            </h2>
            <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white dark:bg-[#1a1212] p-8 md:p-10 rounded-lg shadow-md relative border-l-4 border-primary">
              <div className="absolute -top-4 -left-4 text-primary/80 text-6xl font-serif">
                <i className="fas fa-quote-left"></i>
              </div>
              <div className="mb-8">
                <div className="flex text-accent mb-4">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="text-white/80 italic mb-6 relative z-10 leading-relaxed">
                  I've been ordering from InkDesk for over a year now, and the
                  quality of their products is consistently excellent. Their
                  notebooks have become essential to my creative process.
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-primary/20">
                  <img
                    src="/src/assets/testimonial-1.jpg"
                    alt="Customer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-white">Emma Thompson</p>
                  <p className="text-primary/80 text-sm">
                    <i className="fas fa-paint-brush mr-1"></i> Graphic Designer
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1212] p-8 md:p-10 rounded-lg shadow-md relative border-l-4 border-primary">
              <div className="absolute -top-4 -left-4 text-primary/80 text-6xl font-serif">
                <i className="fas fa-quote-left"></i>
              </div>
              <div className="mb-8">
                <div className="flex text-accent mb-4">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="text-white/80 italic mb-6 relative z-10 leading-relaxed">
                  The attention to detail in packaging and the personalized note
                  made my first purchase from InkDesk special. Their customer
                  service is exceptional, and the products exceeded my
                  expectations.
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-primary/20">
                  <img
                    src="/src/assets/testimonial-2.jpg"
                    alt="Customer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-white">Michael Roberts</p>
                  <p className="text-primary/80 text-sm">
                    <i className="fas fa-pen-fancy mr-1"></i> Author
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA with enhanced styling */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <i className="fas fa-envelope text-9xl absolute top-10 left-10 transform -rotate-12"></i>
          <i className="fas fa-paper-plane text-8xl absolute bottom-10 right-10"></i>
          <i className="fas fa-comments text-7xl absolute top-1/2 left-1/4"></i>
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <i className="fas fa-envelope-open-text mr-3"></i>
              We'd Love to Hear From You
            </h2>
            <p className="text-white/90 mb-8 text-lg leading-relaxed">
              Have questions about our products, need assistance with an order,
              or just want to say hello? Our team is here to help.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
