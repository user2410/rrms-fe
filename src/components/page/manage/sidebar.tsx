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

export default function Sidebar() {
  const routeTree = useRoutes();
  const manageRoute = routeTree.subroutes?.find(r => r.href === '/manage');
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  
  return (
    <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6 border-r">
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
          <div className="flex items-center gap-2">
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
            {/* Search Form */}
            <form className="md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="px-3 py-2 h-12 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-slate-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>
            {/* User */}
            <div className="hidden md:block">
              <hr className="my-4 md:min-w-full" />
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    className="w-12 h-12 rounded-full"
                    src="/img/avatar_placeholder.png"
                    alt="Neil image"
                    width={32}
                    height={32} />
                </div>
                <CardHeader className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium truncate">Pham Chinh</CardTitle>
                  <CardDescription className="text-sm">
                    email@pc.com
                  </CardDescription>
                </CardHeader>
              </div>
              <hr className="my-4 md:min-w-full" />
            </div>
            {/* Navigation */}
            <ScrollArea className="h-[60vh] border-none">
              <Accordion type="single" collapsible className="w-full">
                {manageRoute?.subroutes?.map((subroute, idx1) => (
                  <AccordionItem value={idx1.toString()} key={idx1}>
                    {/* Heading */}
                    <AccordionTrigger>
                      <span className="space-x-2 overflow-hidden">
                        <span className="inline-block text-sm w-4 mr-2">{subroute.icon}</span>
                        <span className="text-xs uppercase !no-underline">{subroute.label}</span>
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
          </div>

          <div className="w-full">
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link
                  href='/'
                  className="text-slate-500 hover:text-slate-400 text-xs uppercase py-3 font-bold block"
                >
                  <i
                    className={clsx(
                      "w-4 mr-2 text-sm",
                      'fas fa-gear'
                    )
                      // + (router.pathname.indexOf("/admin/dashboard") !== -1
                      //   ? "opacity-75"
                      //   : "text-slate-300")
                    }
                  ></i>{" "}
                  Settings
                </Link>
              </li>
              <li className="items-center">
                <Link
                  href='/'
                  className={
                    "text-slate-500 hover:text-slate-400 text-xs uppercase py-3 font-bold block"
                    // + (router.pathname.indexOf("/admin/dashboard") !== -1
                    //   ? "text-lightBlue-500 hover:text-lightBlue-600"
                    //   : "text-slate-500 hover:text-slate-500")
                  }
                >
                  <i className="w-4 mr-2 text-sm fas fa-right-from-bracket"></i>{" "}
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
