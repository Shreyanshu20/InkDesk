import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="bg-background">
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary/40 to-background/90">
        <div className="container mx-auto px-3 md:px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium mb-2 md:mb-3 inline-block text-sm md:text-base">
              <i className="fas fa-book-open mr-2"></i>Since 2015
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-4 md:mb-6">
              Our Story
            </h1>
            <div className="h-1 w-16 md:w-32 bg-primary mx-auto mb-6 md:mb-8"></div>
            <p className="text-base md:text-lg text-text/80 mb-6 md:mb-8 leading-relaxed px-4">
              Discover the passion and dedication behind InkDesk, where our love
              for stationery and literature has created a unique space for
              creativity and knowledge.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-3 md:px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="border-l-4 border-primary pl-3 md:pl-4 mb-2">
                <span className="text-primary/80 uppercase tracking-wider text-xs md:text-sm font-medium">
                  Who we are
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-4 md:mb-6">
                Our Mission
              </h2>
              <div className="h-1 w-16 md:w-24 bg-primary mb-6 md:mb-8"></div>
              <p className="text-text/80 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                At InkDesk, we believe that quality stationery and books are
                more than just products—they're tools for creativity,
                expression, and learning. Our mission is to provide premium
                materials that inspire and empower individuals to bring their
                ideas to life and expand their horizons.
              </p>
              <p className="text-text/80 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                We strive to curate collections that combine functionality,
                aesthetics, and sustainability, ensuring that every purchase not
                only meets your needs but also brings joy to your daily life.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center bg-primary text-white hover:bg-primary/90 px-5 md:px-7 py-2.5 md:py-3.5 rounded-full font-medium transition-colors shadow-md text-sm md:text-base"
              >
                <i className="fas fa-shopping-bag mr-2"></i>
                Explore Our Products
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1631173716529-fd1696a807b0?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Our mission"
                  className="rounded-lg shadow-xl w-full object-cover h-64 md:h-96 lg:h-[450px] border-4 border-white dark:border-[#1a1212]"
                />
                <div className="absolute -bottom-3 -left-3 md:-bottom-6 md:-left-6 w-20 h-20 md:w-40 md:h-40 bg-primary/10 rounded-lg z-[-1]"></div>
                <div className="absolute -top-3 -right-3 md:-top-6 md:-right-6 w-16 h-16 md:w-32 md:h-32 bg-secondary/20 rounded-lg z-[-1]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gradient-to-r from-background via-accent/5 to-background">
        <div className="container mx-auto px-3 md:px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
            <span className="text-primary/80 uppercase tracking-wider text-xs md:text-sm font-medium">
              <i className="fas fa-clock mr-2"></i>Our Growth
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-4 md:mb-6">
              Our Journey
            </h2>
            <div className="h-1 w-16 md:w-24 bg-primary mx-auto mb-6 md:mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <div className="bg-white dark:bg-[#1a1212] p-6 md:p-8 rounded-lg shadow-md border-t-4 border-primary hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
              <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full mb-4 md:mb-6 mx-auto">
                <span className="text-primary text-lg md:text-xl font-bold">
                  2015
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-text mb-3 md:mb-4 text-center">
                The Beginning
              </h3>
              <p className="text-text/80 text-center leading-relaxed text-sm md:text-base">
                <i className="fas fa-store text-primary/60 mr-2"></i>
                InkDesk started as a small corner shop with a passion for unique
                stationery and carefully curated book collections.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1212] p-6 md:p-8 rounded-lg shadow-md border-t-4 border-primary hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
              <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full mb-4 md:mb-6 mx-auto">
                <span className="text-primary text-lg md:text-xl font-bold">
                  2019
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-text mb-3 md:mb-4 text-center">
                Expansion
              </h3>
              <p className="text-text/80 text-center leading-relaxed text-sm md:text-base">
                <i className="fas fa-chart-line text-primary/60 mr-2"></i>
                We expanded our catalog to include premium art supplies and
                office essentials, becoming a one-stop shop for creative minds.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1212] p-6 md:p-8 rounded-lg shadow-md border-t-4 border-primary hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
              <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full mb-4 md:mb-6 mx-auto">
                <span className="text-primary text-lg md:text-xl font-bold">
                  2022
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-text mb-3 md:mb-4 text-center">
                Going Digital
              </h3>
              <p className="text-text/80 text-center leading-relaxed text-sm md:text-base">
                <i className="fas fa-globe text-primary/60 mr-2"></i>
                Launch of our online store, bringing our carefully curated
                collections to customers around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-3 md:px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
            <span className="text-primary/80 uppercase tracking-wider text-xs md:text-sm font-medium mb-2 inline-block">
              <i className="fas fa-heart mr-2"></i>What We Stand For
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-4 md:mb-6">
              Our Core Values
            </h2>
            <div className="h-1 w-16 md:w-24 bg-primary mx-auto mb-6 md:mb-8"></div>
            <p className="text-base md:text-lg text-text/80 px-4">
              These fundamental principles guide everything we do at InkDesk
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-white dark:bg-[#1a1212] p-4 md:p-8 rounded-lg shadow-md hover:shadow-lg hover:translate-y-[-3px] border-b-4 border-primary transition-all duration-300">
              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-6">
                <i className="fas fa-gem text-primary text-xl md:text-3xl"></i>
              </div>
              <h3 className="text-base md:text-xl font-bold text-text mb-2 md:mb-3 text-center">
                Quality
              </h3>
              <p className="text-text/80 text-center leading-relaxed text-xs md:text-base">
                We source only the finest materials and products that stand the
                test of time.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1212] p-4 md:p-8 rounded-lg shadow-md hover:shadow-lg hover:translate-y-[-3px] border-b-4 border-primary transition-all duration-300">
              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-6">
                <i className="fas fa-leaf text-primary text-xl md:text-3xl"></i>
              </div>
              <h3 className="text-base md:text-xl font-bold text-text mb-2 md:mb-3 text-center">
                Sustainability
              </h3>
              <p className="text-text/80 text-center leading-relaxed text-xs md:text-base">
                We're committed to eco-friendly practices and sustainable
                product sourcing.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1212] p-4 md:p-8 rounded-lg shadow-md hover:shadow-lg hover:translate-y-[-3px] border-b-4 border-primary transition-all duration-300">
              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-6">
                <i className="fas fa-award text-primary text-xl md:text-3xl"></i>
              </div>
              <h3 className="text-base md:text-xl font-bold text-text mb-2 md:mb-3 text-center">
                Excellence
              </h3>
              <p className="text-text/80 text-center leading-relaxed text-xs md:text-base">
                We strive for excellence in customer service and product
                curation.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1212] p-4 md:p-8 rounded-lg shadow-md hover:shadow-lg hover:translate-y-[-3px] border-b-4 border-primary transition-all duration-300">
              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-6">
                <i className="fas fa-users text-primary text-xl md:text-3xl"></i>
              </div>
              <h3 className="text-base md:text-xl font-bold text-text mb-2 md:mb-3 text-center">
                Community
              </h3>
              <p className="text-text/80 text-center leading-relaxed text-xs md:text-base">
                Building a community of creators, thinkers, and book lovers
                worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gradient-to-bl from-secondary/10 via-background to-accent/5">
        <div className="container mx-auto px-3 md:px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
            <span className="text-primary/80 uppercase tracking-wider text-xs md:text-sm font-medium mb-2 inline-block">
              <i className="fas fa-hands-helping mr-2"></i>Our People
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-4 md:mb-6">
              Meet Our Team
            </h2>
            <div className="h-1 w-16 md:w-24 bg-primary mx-auto mb-6 md:mb-8"></div>
            <p className="text-base md:text-lg text-text/80 px-4">
              The passionate individuals behind InkDesk who bring their
              expertise and creativity to everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            <div className="bg-white dark:bg-[#1a1212] rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover transition-transform duration-500"
                />
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-text">
                  Sarah Johnson
                </h3>
                <p className="text-primary font-medium mb-3 md:mb-4 text-sm md:text-base">
                  <i className="fas fa-briefcase mr-2 text-primary/70"></i>
                  Founder & CEO
                </p>
                <p className="text-text/80 text-xs md:text-sm leading-relaxed">
                  With a background in design and a lifelong love for books,
                  Sarah founded InkDesk to share her passion with the world.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1212] rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="David Chen"
                  className="w-full h-full object-cover transition-transform duration-500"
                />
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-text">
                  David Chen
                </h3>
                <p className="text-primary font-medium mb-3 md:mb-4 text-sm md:text-base">
                  <i className="fas fa-palette mr-2 text-primary/70"></i>
                  Creative Director
                </p>
                <p className="text-text/80 text-xs md:text-sm leading-relaxed">
                  David's eye for aesthetics and product design helps shape our
                  unique collections and visual identity.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1212] rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1 mx-auto max-w-sm md:max-w-none">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src="https://plus.unsplash.com/premium_photo-1677368597077-009727e906db?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Maya Rodriguez"
                  className="w-full h-full object-cover transition-transform duration-500"
                />
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-text">
                  Maya Rodriguez
                </h3>
                <p className="text-primary font-medium mb-3 md:mb-4 text-sm md:text-base">
                  <i className="fas fa-book mr-2 text-primary/70"></i>
                  Head of Curation
                </p>
                <p className="text-text/80 text-xs md:text-sm leading-relaxed">
                  With extensive experience in publishing, Maya brings her
                  expertise to curating our diverse book selections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-3 md:px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
            <span className="text-primary/80 uppercase tracking-wider text-xs md:text-sm font-medium mb-2 inline-block">
              <i className="fas fa-comments mr-2"></i>Testimonials
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-4 md:mb-6">
              What Our Customers Say
            </h2>
            <div className="h-1 w-16 md:w-24 bg-primary mx-auto mb-6 md:mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="bg-white dark:bg-[#1a1212] p-6 md:p-8 lg:p-10 rounded-lg shadow-md relative border-l-4 border-primary">
              <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 text-primary/80 text-4xl md:text-6xl font-serif">
                <i className="fas fa-quote-left"></i>
              </div>
              <div className="mb-6 md:mb-8">
                <div className="flex text-accent mb-3 md:mb-4 justify-center md:justify-start">
                  <i className="fas fa-star text-sm md:text-base"></i>
                  <i className="fas fa-star text-sm md:text-base"></i>
                  <i className="fas fa-star text-sm md:text-base"></i>
                  <i className="fas fa-star text-sm md:text-base"></i>
                  <i className="fas fa-star text-sm md:text-base"></i>
                </div>
                <p className="text-text/80 italic mb-4 md:mb-6 relative z-10 leading-relaxed text-sm md:text-base">
                  I've been ordering from InkDesk for over a year now, and the
                  quality of their products is consistently excellent. Their
                  notebooks have become essential to my creative process.
                </p>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden mr-3 md:mr-4 border-2 border-primary/20 bg-gray-200 flex items-center justify-center">
                  <i className="fas fa-user text-gray-400 text-lg md:text-xl"></i>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-bold text-text text-sm md:text-base">
                    Emma Thompson
                  </p>
                  <p className="text-primary/80 text-xs md:text-sm">
                    <i className="fas fa-paint-brush mr-1"></i> Graphic Designer
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1212] p-6 md:p-8 lg:p-10 rounded-lg shadow-md relative border-l-4 border-primary">
              <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 text-primary/80 text-4xl md:text-6xl font-serif">
                <i className="fas fa-quote-left"></i>
              </div>
              <div className="mb-6 md:mb-8">
                <div className="flex text-accent mb-3 md:mb-4 justify-center md:justify-start">
                  <i className="fas fa-star text-sm md:text-base"></i>
                  <i className="fas fa-star text-sm md:text-base"></i>
                  <i className="fas fa-star text-sm md:text-base"></i>
                  <i className="fas fa-star text-sm md:text-base"></i>
                  <i className="fas fa-star text-sm md:text-base"></i>
                </div>
                <p className="text-text/80 italic mb-4 md:mb-6 relative z-10 leading-relaxed text-sm md:text-base">
                  The attention to detail in packaging and the personalized note
                  made my first purchase from InkDesk special. Their customer
                  service is exceptional, and the products exceeded my
                  expectations.
                </p>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden mr-3 md:mr-4 border-2 border-primary/20 bg-gray-200 flex items-center justify-center">
                  <i className="fas fa-user text-gray-400 text-lg md:text-xl"></i>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-bold text-text text-sm md:text-base">
                    Michael Roberts
                  </p>
                  <p className="text-primary/80 text-xs md:text-sm">
                    <i className="fas fa-pen-fancy mr-1"></i> Author
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gradient-to-r from-primary via-primary/90 to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <i className="fas fa-envelope text-6xl md:text-9xl absolute top-4 md:top-10 left-4 md:left-10 transform -rotate-12"></i>
          <i className="fas fa-paper-plane text-5xl md:text-8xl absolute bottom-4 md:bottom-10 right-4 md:right-10"></i>
          <i className="fas fa-comments text-4xl md:text-7xl absolute top-1/2 left-1/4"></i>
        </div>
        <div className="container mx-auto px-3 md:px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              <i className="fas fa-envelope-open-text mr-2 md:mr-3"></i>
              We'd Love to Hear From You
            </h2>
            <p className="text-white/90 mb-6 md:mb-8 text-base md:text-lg leading-relaxed px-4">
              Have questions about our products, need assistance with an order,
              or just want to say hello? Our team is here to help.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-primary hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm md:text-base"
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
