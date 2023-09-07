"use client";

import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import useRoutes from "@/hooks/use-route";
import { format } from "date-fns";
import Link from "next/link";
import { IoMdMail, IoMdNotifications } from "react-icons/io";

const ICON_SIZE = 24;

export default function ManageDashboardNavbar() {
  const routes = useRoutes();

  return (
    <nav className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100vw_-_16rem)] z-10 shadow-sm bg-background">
      <div className="flex items-center p-4 md:py-6 md:flex-row md:flex-nowrap md:justify-start">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Breadcrumb */}
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
            <div className="flex items-center gap-8">
              <ThemeSwitcher size={20}/>
              <div className="relative">
                <IoMdMail size={ICON_SIZE} />
                <Badge variant="destructive" className="absolute -top-4 -right-4">12</Badge>
              </div>
              <div className="relative">
                <IoMdNotifications size={ICON_SIZE} />
                <Badge variant="destructive" className="absolute -top-4 -right-4">12</Badge>
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
  );
}
