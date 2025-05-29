import React from "react";
import { Link } from "react-router-dom";

function Blogs() {
  // Sample blog data - replace with your actual data
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Books To Make It A Great Year",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi...",
      image: "/src/assets/hero.jpg",
      date: "July 26, 2023",
      author: "Apollo Theme",
      authorImage: "/src/assets/hero.jpg",
      category: "Books",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Top 10 Books To Make It A Great Year",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi...",
      image: "/src/assets/hero.jpg",
      date: "July 26, 2023",
      author: "Apollo Theme",
      authorImage: "/src/assets/hero.jpg",
      category: "Books",
      readTime: "7 min read",
    },
    {
      id: 3,
      title: "Top 5 Tarot Decks For The Tarot World Summit",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi...",
      image: "/src/assets/hero.jpg",
      date: "July 26, 2023",
      author: "Apollo Theme",
      authorImage: "/src/assets/hero.jpg",
      category: "Tarot",
      readTime: "8 min read",
    },
  ];

  return (
    <section
      className="mt-8 lg:py-12 px-6 md:p-16 lg:mt-10 bg-background"
      aria-labelledby="blog-section-heading"
    >
      <div className="container mx-auto">
        {/* Section header with View All button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2
              id="blog-section-heading"
              className="text-3xl font-bold text-text mb-3"
            >
              Latest from Our Blog
            </h2>
            <p className="text-text/70 max-w-xl">
              Discover insights, tutorials, and inspiration about books,
              stationery, and creative pursuits
            </p>
          </div>

          <Link
            to="/blog"
            className="hidden lg:block mt-4 md:mt-0 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            View All
            <i
              className="fas fa-arrow-right ml-2 text-sm"
              aria-hidden="true"
            ></i>
          </Link>
        </div>

        {/* Blog grid - responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-background rounded-lg overflow-hidden border border-accent/80 shadow hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full"
            >
              {/* Blog image */}
              <div className="relative w-full aspect-[3/2]">
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-primary/80 text-white text-xs font-medium px-2 py-1 rounded">
                  {post.category}
                </span>
                <span className="absolute top-3 right-3 bg-white/80 text-gray-700 text-xs font-medium px-2 py-1 rounded flex items-center">
                  <i className="far fa-clock mr-1" aria-hidden="true"></i>{" "}
                  {post.readTime}
                </span>
              </div>

              {/* Blog content */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center text-text/60 text-sm mb-3">
                    <time dateTime="2023-07-26">{post.date}</time>
                    <span className="mx-2" aria-hidden="true">
                      •
                    </span>
                    <span>By {post.author}</span>
                  </div>

                  <h3 className="font-bold text-lg md:text-xl text-text mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    <Link
                      to={`/blog/${post.id}`}
                      className="focus:outline-none focus:underline"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-text/70 mb-4 line-clamp-3 text-sm">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  to={`/blog/${post.id}`}
                  className="text-primary text-sm hover:underline focus:outline-none focus:underline flex items-center font-medium"
                >
                  Read More
                  <i className="fas fa-arrow-right ml-2" aria-hidden="true"></i>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile view - show more button */}
        <div className="mt-8 mb-5 text-center md:hidden">
          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Read More Articles
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Blogs;
