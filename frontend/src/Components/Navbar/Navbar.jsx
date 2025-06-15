import React from 'react';
import NavbarTop from './NavbarTop';
import NavbarBottom from './NavbarBottom';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-20">
      <NavbarTop />
      <NavbarBottom />
    </header>
  );
};

export default Navbar;
