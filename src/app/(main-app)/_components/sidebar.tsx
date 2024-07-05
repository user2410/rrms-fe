"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useRoutes from "@/hooks/use-route";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { propertiesNavbar } from "./nav-items";
import { getSearchURL } from "../search/_components/get_searchurl";
import Link from "next/link";

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
        <Accordion type="single" collapsible>
          {[
            {
              label: 'Nhà cho thuê',
              href: '#',
              subroute: propertiesNavbar.map((item) => ({
                label: item.title,
                description: item.description,
                href: `/search/${getSearchURL({ ptypes: [item.key] })}`,
              })),
            },
            {
              label: 'Tin tức',
              href: '/news',
            },
            {
              label: 'Hướng dẫn',
              href: '/guide',
            },
          ].map((item, index) => (
            <AccordionItem value={index.toString()} key={index}>
              <AccordionTrigger>{item.label}</AccordionTrigger>
              <AccordionContent>
                {item.subroute && (
                  item.subroute.map((subitem, subindex) => (
                    <div key={subindex} className="py-2">
                      <Link href={subitem.href} className="px-2 py-3 font-semibold">
                        {subitem.label} 
                      </Link>
                    </div>
                  ))
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SheetContent>
    </Sheet>
  );
};
