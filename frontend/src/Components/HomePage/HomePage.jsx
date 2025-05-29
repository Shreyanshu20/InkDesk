import React from "react";
import Hero from "./Hero/Hero";
import Badges from "./Badges/Badges";
import Categories from "./Categories/Categories";
import Products from "./Products/Products";
import Blogs from "./Blogs/Blogs";
import Banner from "./Banner/Banner";
import Newsletter from "./Newsletter/Newsletter";
import GetInTouch from "./GetInTouch/GetInTouch";

function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <Categories />
      <Badges />
      <Products />
      <Banner />
      <Blogs />
      <Newsletter />
    </main>
  );
}

export default HomePage;
