"use client";

import Logo from "@/components/ui/logo";
import { useRef } from "react";
import AuthItem from "./auth-item";
import LangSelector from "./lang-selector";
import NavItems from "./nav-items";

export default function HeaderMain() {
  const headerRef = useRef<HTMLElement>(null);
  const navDropdownRef = useRef<HTMLDivElement>(null);

  const handleNavDropdown = () => {
    if (navDropdownRef.current !== null) {
      navDropdownRef.current.classList.toggle("block");
      navDropdownRef.current.classList.toggle("hidden");
    }
  }

  return (
    <nav
      ref={headerRef}
      className="fixed top-0 w-screen z-10 bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-8">
        <div className="flex space-x-4 md:space-x-8">
          <div className="flex items-center">
            <Logo size={40} />
          </div>
        </div>

        <NavItems
          ref={navDropdownRef}
          headerRef={headerRef}
        />

        {/* Right icons */}
        <div className="flex flex-row space-x-2">
          {/* Hamburger menu - trigger nav items dropdown */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={handleNavDropdown}>
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          {/* Lang selector */}
          <LangSelector headerRef={headerRef} />
          {/* Auth item */}
          <AuthItem headerRef={headerRef}/>
        </div>

      </div>
    </nav>
  );
}
