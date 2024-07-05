"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { format } from "date-fns";
import vi from "date-fns/locale/vi";
import { useSession } from "next-auth/react";
import NotificationDropdown from "./notification_dropdown";
import Sidebar from "./sidebar";

export default function ManageDashboardNavbar() {
  // const routes = useRoutes();
  const {data: session} = useSession();

  return (
    <nav className="shadow-md bg-background border-b flex justify-between items-center px-8 py-6 md:px-10">
      {/* Breadcrumb */}
      <div className="flex flex-row items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" type="button" className="flex xl:hidden">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Sidebar/>
          </SheetContent>
        </Sheet>
        <span className="text-lg capitalize font-semibold">
          {session?.user.user.role === "LANDLORD" ? "Chủ nhà" : "Người thuê nhà"}
        </span>
      </div>
      <div className="capitalize text-sm font-normal">
        {format(new Date(), "EEEE, d MMMM, yyyy", { locale: vi })}
      </div>
      {/* Form */}
      <div className="flex items-center gap-8">
        <ThemeSwitcher size={20} />
        <NotificationDropdown />
      </div>
    </nav>
  );
}
