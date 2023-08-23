"use client";

import React from "react";
import Link from "next/link";
// import { useRouter } from "next/router";

import NotificationDropdown from "./dropdowns/notification";
import UserDropdown from "./dropdowns/user";
import clsx from "clsx";
import Image from "next/image";

const sections = [
  {
    heading: 'Property management',
    subsections: [
      {
        title: 'My properties',
        link: '/manage/properties',
        icon: 'fa-solid fa-building',
      },
    ]
  },
  {
    heading: 'Rental management',
    subsections: [
      {
        title: 'Tenants',
        link: '/manage/tenants',
        icon: 'fas fa-users',
      },
      {
        title: 'Services',
        link: '/manage/services',
        icon: 'fas fa-user-gear',
      },
      {
        title: 'Leases',
        link: '/manage/leases',
        icon: 'fas fa-file-contract',
      },
      {
        title: 'Payments',
        link: '/manage/payments',
        icon: 'fas fa-money-check-alt',
      },
      {
        title: 'Invoices',
        link: '/manage/invoices',
        icon: 'fas fa-file-invoice-dollar',
      },
      {
        title: 'Maintenance',
        link: '/manage/maintenance',
        icon: 'fas fa-tools',
      },
      {
        title: 'Reports',
        link: '/manage/reports',
        icon: 'fas fa-file-alt',
      },
    ]
  },
  {
    heading: 'Listings',
    subsections: [
      {
        title: 'All listings',
        link: '/manage/listings',
        icon: 'fas fa-fingerprint',
      },
      {
        title: 'Create new listings',
        link: '/manage/listings/new',
        icon: 'fas fa-clipboard-list',
      },
      {
        title: 'Drafts',
        link: '/manage/listing/drafts',
        icon: 'fas fa-clipboard-list',
      },
    ]
  },
]
export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  // const router = useRouter();
  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
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
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
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
            <div className="w-full">
              {/* Collapse header */}
              <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
                <div className="flex flex-wrap">
                  <div className="w-6/12">
                    <Link
                      href="/"
                      className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-lg uppercase font-bold p-4 px-0"
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
              <form className="mt-6 mb-4 md:hidden">
                <div className="mb-3 pt-0">
                  <input
                    type="text"
                    placeholder="Search"
                    className="px-3 py-2 h-12 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                  />
                </div>
              </form>
              {/* User */}
              <div className="hidden md:block mt-6">
                <hr className="my-4 md:min-w-full" />
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      className="w-8 h-8 rounded-full"
                      src="/img/avatar_placeholder.png"
                      alt="Neil image"
                      width={32}
                      height={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Neil Sims
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      email@windster.com
                    </p>
                  </div>
                </div>
                <hr className="my-4 md:min-w-full" />
              </div>

              <div className="overflow-hidden hover:overflow-y-auto hover:scrollbar h-[60vh] mt-6">
                {sections.map((section, idx1) => (
                  <div key={idx1}>
                    {/* Divider */}
                    {idx1 > 0 ? (<hr className="my-4 md:min-w-full" />) : null}
                    {/* Heading */}
                    <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                      {section.heading}
                    </h6>
                    {/* Navigation */}
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                      {section.subsections.map((item, idx2) => (
                        <li className="items-center" key={idx2}>
                          <Link
                            href={item.link}
                            className={
                              "text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                              // + (router.pathname.indexOf("/admin/dashboard") !== -1
                              //   ? "text-lightBlue-500 hover:text-lightBlue-600"
                              //   : "text-blueGray-700 hover:text-blueGray-500")
                            }
                          >
                            <i
                              className={clsx(
                                "w-4 mr-2 text-sm",
                                item.icon
                              )
                                // + (router.pathname.indexOf("/admin/dashboard") !== -1
                                //   ? "opacity-75"
                                //   : "text-blueGray-300")
                              }
                            ></i>{" "}
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full">
              <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                <li className="items-center">
                  <Link
                    href='/'
                    className={
                      "text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                      // + (router.pathname.indexOf("/admin/dashboard") !== -1
                      //   ? "text-lightBlue-500 hover:text-lightBlue-600"
                      //   : "text-blueGray-700 hover:text-blueGray-500")
                    }
                  >
                    <i
                      className={clsx(
                        "w-4 mr-2 text-sm",
                        'fas fa-gear'
                      )
                        // + (router.pathname.indexOf("/admin/dashboard") !== -1
                        //   ? "opacity-75"
                        //   : "text-blueGray-300")
                      }
                    ></i>{" "}
                    Settings
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    href='/'
                    className={
                      "text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                      // + (router.pathname.indexOf("/admin/dashboard") !== -1
                      //   ? "text-lightBlue-500 hover:text-lightBlue-600"
                      //   : "text-blueGray-700 hover:text-blueGray-500")
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
    </>
  );
}
