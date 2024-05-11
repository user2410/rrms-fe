import Link from "next/link";
import { FaHome } from "react-icons/fa";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

const ICON_SIZE = 16;

type Route = {
  label: string;
  href: string;
  icon: React.ReactNode;
  subroutes?: Route[];
};

export default function SidebarNavigation({
  routes,
} : {
  routes: Route[];
}) { 
  return (
    <ScrollArea className="h-[60vh] border-none">
      <Link href="/manage" className="group py-4 mb-2 flex flex-row gap-4">
        <span className="inline-block text-sm w-4"><FaHome size={ICON_SIZE*1.5} /></span>
        <span className="text-xl font-semibold group-hover:underline">Thống kê</span>
      </Link>
      <Accordion type="single" collapsible className="w-full">
        {routes.map((route, idx1) =>
          (!route.subroutes ||
             route.subroutes.length === 0)
            ? (
              <AccordionItem value={(idx1).toString()} key={idx1}>
                <Link href={route.href} className="group flex flex-row gap-4 flex-1 items-center justify-start py-4 font-medium">
                  <span className="inline-block text-sm w-4">{route.icon}</span>
                  <span className="text-xs uppercase group-hover:underline">{route.label}</span>
                </Link>
              </AccordionItem>
            ) : (
              <AccordionItem value={(idx1).toString()} key={idx1}>
                {/* Heading */}
                <AccordionTrigger>
                  <span className="space-x-2 overflow-hidden !no-underline">
                    <span className="inline-block text-sm w-4 mr-2">{route.icon}</span>
                    <Link href={route.href} className="text-xs uppercase !no-underline">{route.label}</Link>
                  </span>
                </AccordionTrigger>
                {/* Navigation */}
                <AccordionContent>
                  <ul className="min-w-full flex flex-col list-none pl-1 md:pl-2">
                    {route?.subroutes?.map((item, idx2) => (
                      <li className="items-center" key={idx2}>
                        <Link
                          href={item.href}
                          className="py-1 md:py-2 text-slate-500 hover:text-slate-300  text-xs uppercase font-bold block"
                        >
                          <span className="inline-block text-sm w-4 mr-2">{item.icon}</span>{" "}
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
      </Accordion>
    </ScrollArea>
  );
}
