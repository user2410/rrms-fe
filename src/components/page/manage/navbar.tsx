"use client";

import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { format } from "date-fns";
import Link from "next/link";
import { IoMdMail, IoMdNotifications } from "react-icons/io";

const ICON_SIZE = 24;

export default function ManageDashboardNavbar() {
  // const routes = useRoutes();

  return (
    <nav className="shadow-md bg-background border-b flex justify-between items-center px-8 py-6 md:px-10">
      {/* Breadcrumb */}
      <Link
        className="text-lg capitalize font-semibold"
        href="#pablo"
        onClick={(e) => e.preventDefault()}
      >
        Dashboard
      </Link>
      <div className="capitalize text-sm font-normal">
        {format(new Date(), "EEEE, MMMM d, yyyy")}
      </div>
      {/* Form */}
      <div className="flex items-center gap-8">
        <ThemeSwitcher size={20} />
        <div className="relative">
          <IoMdMail size={ICON_SIZE} />
          <Badge variant="destructive" className="absolute -top-4 -right-4">12</Badge>
        </div>
        <div className="relative">
          <IoMdNotifications size={ICON_SIZE} />
          <Badge variant="destructive" className="absolute -top-4 -right-4">12</Badge>
        </div>
      </div>
    </nav>
  );
}
