import React from 'react';
import { Link } from 'react-router-dom';

const NavButton = ({ linkTo, name }) => {
  return (
    <Link
      to={linkTo}
      className="flex mb-[6px] pt-[8px] px-6 align-center justify-center mx-0 whitespace-nowrap text-gray-700 h-full group"
    >
      <span className="relative text-nm">
        {name}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
      </span>
    </Link>
  );
};

export default NavButton;
