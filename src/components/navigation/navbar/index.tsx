import React from "react";
import Link from "next/link";
import Image from "next/image";
import Theme from "./theme";

const Navbar = () => {
  return (
    <nav className="z-50 fixed flex-between gap-5 shadow-light-300 dark:shadow-none p-6 sm:px-12 w-full background-light900_dark200">
      <Link href={"/"} className="flex items-center gap-1">
        <Image
          src={"/images/site-logo.svg"}
          width={23}
          height={23}
          alt="DevFlow"
        />
        <p className="max-sm:hidden font-spaceGrotesk text-dark-100 dark:text-light-900 h2-bold">
          Dev<span className="text-primary-500">Flow</span>
        </p>
      </Link>

      <p>GLobal Search</p>

      <div className="flex-between gap-5">
        <Theme />
      </div>
    </nav>
  );
};

export default Navbar;
