import React from "react";
import { Link } from "react-router-dom";

function Blogs() {
  // Sample blog data
  const blogPosts = [
    {
      id: 1,
      title: "The Importance of Quality Stationery",
      excerpt:
        "Discover how quality stationery can enhance your productivity and creativity.",
      image: "https://placehold.co/600x400?text=Stationery+Blog",
      date: "May 10, 2025",
      author: "Emma Johnson",
      category: "Stationery",
      authorImage: "https://placehold.co/100x100?text=Emma",
    },
    {
      id: 2,
      title: "Office Organization Tips for Professionals",
      excerpt:
        "Learn how to organize your workspace for maximum efficiency and focus.",
      image: "https://placehold.co/600x400?text=Office+Organization",
      date: "May 5, 2025",
      author: "Michael Smith",
      category: "Office Tips",
      authorImage: "https://placehold.co/100x100?text=Michael",
    },
    {
      id: 3,
      title: "Best Art Supplies for Beginners",
      excerpt:
        "Starting your art journey? Here are the essential supplies every beginner needs.",
      image: "https://placehold.co/600x400?text=Art+Supplies",
      date: "April 28, 2025",
      author: "Sarah Williams",
      category: "Art Supplies",
      authorImage: "https://placehold.co/100x100?text=Sarah",
    },
    {
      id: 4,
      title: "The Perfect Notebook for Different Writing Styles",
      excerpt:
        "Find the ideal notebook that matches your writing style and needs.",
      image: "https://placehold.co/600x400?text=Notebook+Guide",
      date: "April 20, 2025",
      author: "David Chen",
      category: "Notebooks",
      authorImage: "https://placehold.co/100x100?text=David",
    },
    {
      id: 5,
      title: "How to Choose the Right Pen for Your Writing",
      excerpt:
        "Different pens serve different purposes. Learn how to select the perfect one.",
      image: "https://placehold.co/600x400?text=Pen+Guide",
      date: "April 15, 2025",
      author: "Emma Johnson",
      category: "Writing Tools",
      authorImage: "https://placehold.co/100x100?text=Emma",
    },
    {
      id: 6,
      title: "Creative Journaling Ideas to Inspire You",
      excerpt:
        "Explore these journaling techniques to boost your creativity and mindfulness.",
      image: "https://placehold.co/600x400?text=Journaling",
      date: "April 10, 2025",
      author: "Maya Rodriguez",
      category: "Creativity",
      authorImage: "https://placehold.co/100x100?text=Maya",
    },
  ];

  // Array of featured categories
  const categories = [
    "All",
    "Stationery",
    "Office Tips",
    "Art Supplies",
    "Writing Tools",
    "Creativity",
  ];

  return (
    <div className="bg-background text-text">
      {/* Hero Section with gradient styling inspired by About page */}
      <section className="relative py-24 bg-gradient-to-b from-secondary/20 to-background/80">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium mb-3 inline-block">
              <i className="fas fa-pen-fancy mr-2"></i>InkDesk Insights
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
              Our Blog
            </h1>
            <div className="h-1 w-32 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-text/80 mb-8 leading-relaxed">
              Explore articles, tips, and insights about stationery,
              productivity, creativity, and office essentials from our team of
              experts.
            </p>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-24 bg-background"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0% 100%)" }}
        ></div>
      </section>

      {/* Categories Bar */}
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                index === 0
                  ? "bg-primary text-white shadow-md"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      <section className="py-12 container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 bg-white dark:bg-[#1a1212] rounded-lg overflow-hidden shadow-lg group">
            <div className="relative h-80 overflow-hidden">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                  Featured
                </span>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-primary bg-primary/10 rounded-full px-3 py-1">
                  <i className="fas fa-tag mr-1"></i> {blogPosts[0].category}
                </span>
                <span className="text-sm text-text/60">
                  <i className="far fa-calendar-alt mr-1"></i>{" "}
                  {blogPosts[0].date}
                </span>
              </div>
              <h2 className="font-bold text-2xl mb-3 text-text group-hover:text-primary transition-colors">
                {blogPosts[0].title}
              </h2>
              <p className="text-text/70 mb-6 leading-relaxed">
                {blogPosts[0].excerpt} Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed euismod nisi vel finibus fermentum. Sed
                blandit vitae nunc a tincidunt.
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <img
                    src={blogPosts[0].authorImage}
                    alt={blogPosts[0].author}
                    className="w-10 h-10 rounded-full mr-3 border border-primary/20"
                  />
                  <span className="text-sm font-medium text-text">
                    By {blogPosts[0].author}
                  </span>
                </div>
                <Link
                  to={`/blog/${blogPosts[0].id}`}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                >
                  Read Article <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-rows-2 gap-8">
            {blogPosts.slice(1, 3).map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-[#1a1212] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="sm:w-1/3 h-40 sm:h-auto overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="sm:w-2/3 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-1">
                          {post.category}
                        </span>
                        <span className="text-xs text-text/60">
                          {post.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-text group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-text/70 text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs text-text/60">
                        By {post.author}
                      </span>
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        Read More{" "}
                        <i className="fas fa-chevron-right text-xs ml-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gradient-to-b from-background to-[#f8f5e6] to-90%">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-text">
              <i className="fas fa-newspaper text-primary/70 mr-3"></i>
              Latest Articles
            </h2>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(3).map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-[#1a1212] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group border-b-4 border-transparent hover:border-primary"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <Link
                      to={`/blog/${post.id}`}
                      className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <i className="fas fa-eye mr-2"></i> Read Article
                    </Link>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1">
                      {post.category}
                    </span>
                    <span className="text-xs text-text/60">{post.date}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-text group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-text/70 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="flex items-center">
                      <img
                        src={post.authorImage}
                        alt={post.author}
                        className="w-8 h-8 rounded-full mr-2 border border-primary/20"
                      />
                      <span className="text-sm text-text/60">
                        By {post.author}
                      </span>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center"
                    >
                      Read <i className="fas fa-arrow-right ml-2 text-xs"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <i className="fas fa-envelope text-9xl absolute top-10 left-10 transform -rotate-12"></i>
          <i className="fas fa-paper-plane text-8xl absolute bottom-10 right-10"></i>
          <i className="fas fa-bell text-7xl absolute top-1/2 left-1/4"></i>
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <i className="fas fa-envelope-open-text mr-3"></i>
              Subscribe to Our Blog
            </h2>
            <p className="text-white/90 mb-8 text-lg leading-relaxed">
              Get the latest articles, tips, and insights about stationery,
              productivity, and creativity delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 py-3 px-4 rounded-full focus:outline-none text-text"
              />
              <button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg">
                <i className="fas fa-paper-plane mr-2"></i>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Blogs;
