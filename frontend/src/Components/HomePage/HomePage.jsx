import React from "react";
import Hero from "./Hero/Hero";
import Badges from "./Badges/Badges";
import Categories from "./Categories/Categories";
import Products from "./Products/Products";
import Blogs from "./Blogs/Blogs";
import Banner from "./Banner/Banner";
import Advertisement from "./Advertisement/Advertisement";
import Newsletter from "./Newsletter/Newsletter";

function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <Categories />
      <Badges />
      <Products />
      <Banner />
      <Advertisement />
      <Blogs />
      <Newsletter />
    </main>
  );
}

export default HomePage;
