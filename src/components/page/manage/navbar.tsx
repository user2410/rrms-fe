"use client";

import React from "react";

import UserDropdown from "./dropdowns/user";
import Link from "next/link";
import { format } from "date-fns";
import { IoMdSearch, IoMdMail, IoMdNotifications } from "react-icons/io";

const ICON_SIZE = 24;

export default function ManageDashboardNavbar() {
  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100vw_-_16rem)] z-10 bg-white shadow-sm">
        <div className="flex items-center p-4 md:py-6 md:flex-row md:flex-nowrap md:justify-start">
          <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
            {/* Breadcumb */}
            <div>
              <Link
                className="text-lg capitalize hidden lg:inline-block font-semibold"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                Dashboard
              </Link>
            </div>
            <div className="capitalize text-sm font-normal">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </div>
            {/* Form */}
            <div>
              <div className="flex gap-8">
                <div className="relative">
                  <IoMdSearch size={ICON_SIZE} />
                </div>
                <div className="relative">
                  <IoMdMail size={ICON_SIZE} />
                  <span className="absolute block rounded-full bg-red-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
                </div>
                <div className="relative">
                  <IoMdNotifications size={ICON_SIZE} />
                </div>
              </div>
              {/* <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
                <div className="relative flex w-full flex-wrap items-stretch">
                  <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                  />
                </div>
              </form> */}
            </div>
          </div>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
