import React from 'react';
import NavbarTop from './NavbarTop';
import NavbarBottom from './NavbarBottom';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50">
      <NavbarTop />
      <NavbarBottom />
    </header>
  );
};

export default Navbar;
