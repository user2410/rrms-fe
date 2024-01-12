"use client";

import Link from "next/link";
import React from "react";

import clsx from "clsx";
import Image from "next/image";
import NotificationDropdown from "./dropdowns/notification";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import useRoutes from "@/hooks/use-route";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";

function UserCard() {
  const { data, status } = useSession();

  return status === 'loading' ? (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    </div>
  ) : (
    <CardHeader className="flex-1 p-0">
      <CardTitle className="text-sm font-medium truncate">Pham Chinh</CardTitle>
      <CardDescription className="text-sm">
        {data?.user.user.email}
      </CardDescription>
    </CardHeader>
  );
}

function SidebarNavigation() {
  const routeTree = useRoutes();
  const manageRoute = routeTree.subroutes?.find(r => r.href === '/manage');

  return (
    <ScrollArea className="h-[60vh] border-none">
      <Link href="/manage" className="group py-4 mb-2 flex flex-row gap-4">
        <span className="inline-block text-sm w-4">{manageRoute?.icon}</span>
        <span className="text-xl font-semibold group-hover:underline">Main dashboard</span>
      </Link>
      <Accordion type="single" collapsible className="w-full">
        {manageRoute?.subroutes?.map((subroute, idx1) =>
          (!subroute.subroutes ||
             subroute.subroutes.length === 0)
            ? (
              <AccordionItem value={(idx1).toString()} key={idx1}>
                <Link href={subroute.href} className="group flex flex-row gap-4 flex-1 items-center justify-start py-4 font-medium">
                  <span className="inline-block text-sm w-4">{subroute.icon}</span>
                  <span className="text-xs uppercase group-hover:underline">{subroute.label}</span>
                </Link>
              </AccordionItem>
            ) : (
              <AccordionItem value={(idx1).toString()} key={idx1}>
                {/* Heading */}
                <AccordionTrigger>
                  <span className="space-x-2 overflow-hidden !no-underline">
                    <span className="inline-block text-sm w-4 mr-2">{subroute.icon}</span>
                    <Link href={subroute.href} className="text-xs uppercase !no-underline">{subroute.label}</Link>
                  </span>
                </AccordionTrigger>
                {/* Navigation */}
                <AccordionContent>
                  <ul className="min-w-full flex flex-col list-none pl-1 md:pl-2">
                    {subroute?.subroutes?.map((item, idx2) => (
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

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");

  const handleSignout = async () => {
    try {
      await signOut({
        callbackUrl: '/',
      });
      toast.success("Signed out successfully");
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <nav className="
      h-screen bg-background
      flex flex-wrap md:flex-row md:flex-nowrap items-center justify-between
      overflow-hidden z-10 py-4 px-6 border-r
    ">
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        {/* Toggler */}
        <button
          className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
          type="button"
          onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
        >
          <i className="fas fa-bars"></i>
        </button>
        <Link
          href="/"
          className="md:block text-left md:pb-2 text-foreground mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
        >
          <div className="flex items-center justify-center gap-2">
            <Image
              className="float-left"
              src="/logo.png"
              alt="RRMS"
              width={48}
              height={48}
            />
            <div className="float-left text-xl">RRMS</div>
          </div>
        </Link>
        {/* User */}
        <ul className="md:hidden items-center flex flex-wrap list-none">
          <li className="inline-block relative">
            <NotificationDropdown />
          </li>

        </ul>
        {/* Collapse */}
        <div
          className={clsx(
            "md:flex md:flex-col md:justify-between md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ",
            collapseShow
          )}
        >
          <div className="w-full space-y-6">
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    href="/"
                    className="md:block text-left md:pb-2 text-slate-600 mr-0 inline-block whitespace-nowrap text-lg uppercase font-bold p-4 px-0"
                  >
                    RRMS
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Navigation */}
            <SidebarNavigation />
          </div>

          <div className="w-full">
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Button
                  variant="link"
                  className="text-slate-500 hover:text-slate-400 text-xs uppercase py-3 font-bold block"
                >
                  <i className="w-4 mr-2 text-sm fas fa-right-from-bracket"></i>{" "}
                  Settings
                </Button>
              </li>
              <li className="items-center">
                <Button
                  variant="link"
                  className="text-slate-500 hover:text-slate-400 text-xs uppercase py-3 font-bold block"
                  onClick={handleSignout}
                >
                  <i className="w-4 mr-2 text-sm fas fa-right-from-bracket"></i>{" "}
                  Sign out
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
