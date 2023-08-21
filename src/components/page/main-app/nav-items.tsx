import useOnClickOutside from "@/hooks/use-click-outside";
import clsx from "clsx";
import { Dispatch, Fragment, SetStateAction, useState } from "react";

const headerItems = [
  {
    url: '/',
    title: 'Home',
  },
  {
    url: '/landlord',
    title: 'Landlord',
  },
  {
    url: '/Tenant',
    title: 'Tenant',
  },
  {
    url: '/news',
    title: 'News',
  },
  {
    url: '/contact',
    title: 'Contact',
  },
];

export default function NavItems({
  showNavItemsDropdown,
  setShowNavItemsDropdown,
  headerRef,
}: {
  showNavItemsDropdown: boolean;
  setShowNavItemsDropdown: Dispatch<SetStateAction<boolean>>;
  headerRef: React.RefObject<HTMLElement>;
}) {
  useOnClickOutside(headerRef, () => {
    setShowNavItemsDropdown(false);
  });

  return (
    <Fragment>
      {/* Nav items */}
      <div className="items-center justify-between hidden w-full md:flex md:w-auto" id="navbar-language">
        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          {headerItems.map((item, index) => (
            <li key={index}>
              <a href={item.url} className="block py-2 pl-3 pr-4 text-slate-600 hover:text-blue-700 rounded bg-transparent md:p-0">{item.title}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile menu */}
      <div className={clsx(
        "w-screen absolute top-20 left-0",
        showNavItemsDropdown ? "block" : "hidden"
      )}>
        <ul className="flex flex-col font-medium rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          {headerItems.map((item, index) => (
            <li key={index}>
              <a href={item.url} className="block py-2 pl-3 pr-4 text-slate-700 hover:text-white hover:bg-blue-700 rounded bg-transparent md:p-0">{item.title}</a>
            </li>
          ))}
          {/* <li className="border-t border-slate-400">
            <a
              href="#"
              className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                setShowSignInModal(true);
              }}>Sign in</a>
          </li> */}
        </ul>
      </div>
    </Fragment>
  );
}