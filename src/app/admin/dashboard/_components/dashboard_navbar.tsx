import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { format } from "date-fns";
import vi from "date-fns/locale/vi";
import Sidebar from "./sidebar";
import NotificationDropdown from "@/app/manage/_components/notification_dropdown";

export default function DashboardNavbar() {
  
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
            {/* Mobile menu */}
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
      <div className="capitalize text-sm font-normal">
        {format(new Date(), "EEEE, d MMMM, yyyy", { locale: vi })}
      </div>
      {/* Form */}
      <div className="flex items-center gap-8">
        <NotificationDropdown />
      </div>
    </nav>
  );
};
