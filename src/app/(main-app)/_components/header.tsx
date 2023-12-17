"use client";

import Logo from "@/components/ui/logo";
import { useUI } from "@/context/ui.context";
import AuthItem from "./auth-item";
import NavItems from "./nav-items";

export default function HeaderMain() {
  const {
    openSidebar,
  } = useUI();

  return (
    <nav className="fixed top-0 w-screen z-50 bg-background">
      <div className="container flex flex-wrap items-center justify-between mx-auto p-8">
        <div className="flex items-center space-x-4 md:space-x-8">
          <Logo size={40} />
        </div>

        <NavItems/>

        {/* Right icons */}
        <div className="flex flex-row space-x-2">
          {/* Hamburger menu - trigger nav items dropdown */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => openSidebar()}>
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          {/* Auth item */}
          <AuthItem/>
        </div>
      </div>
    </nav>
  );
}
