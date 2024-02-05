"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useRoutes from "@/hooks/use-route";

export default function Sidebar() {
  const rootRoute = useRoutes();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent>
        {/* Mobile menu */}
        <ul className="flex flex-col gap-2 font-medium rounded-lg">
          {rootRoute.subroutes?.map((item, index) => (
            <li key={index}>
              <a href={item.href} className="block py-2 pl-3 pr-4 text-foreground/60 hover:text-foreground/80 rounded bg-transparent">{item.label}</a>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
};
