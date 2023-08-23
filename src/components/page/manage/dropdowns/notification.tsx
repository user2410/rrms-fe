"use client";

import React from "react";
import { createPopper } from "@popperjs/core";
import Link from "next/link";
import clsx from "clsx";

export default function NotificationDropdown() {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef<any>();
  const popoverDropdownRef = React.createRef<any>();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <Link
        className="text-blueGray-500 block py-1 px-3"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <i className="fas fa-bell"></i>
      </Link>
      <div
        ref={popoverDropdownRef}
        className={clsx(
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48",
          dropdownPopoverShow ? "block" : "hidden "
        )}
      >
        <Link
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => e.preventDefault()}
        >
          Action
        </Link>
        <Link
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => e.preventDefault()}
        >
          Another action
        </Link>
        <Link
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => e.preventDefault()}
        >
          Something else here
        </Link>
        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        <Link
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => e.preventDefault()}
        >
          Seprated link
        </Link>
      </div>
    </>
  );
};
