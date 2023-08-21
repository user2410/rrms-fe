import useOnClickOutside from "@/hooks/use-click-outside";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

export default function AuthItem({
  setShowSignInModal,
  headerRef,
} : {
  setShowSignInModal: React.Dispatch<React.SetStateAction<boolean>>;
  headerRef: React.RefObject<HTMLElement>;
}) {
  const [showAuthDropdown, setShowAuthDropdown] = useState<boolean>(false);
  const [signedIn, setSignedIn] = useState<boolean>(false);

  useOnClickOutside(headerRef, () => {
    setShowAuthDropdown(false);
  });

  return (
    <div className="relative flex">
      <button
        className="block px-4 py-2 text-white bg-transparent"
        onClick={() => {
          if (signedIn) {
            setShowAuthDropdown(!showAuthDropdown);
          } else {
            setShowSignInModal(true);
          }
        }}>
        {signedIn
          ? <Image src="/img/avatar_placeholder.png" width={32} height={32} className="w-8 h-8 rounded-full" alt="User" />
          : <span className="text-slate-800 hover:text-blue-700 md:p-0">Sign in</span>
        }
      </button>
      {/* Auth Dropdown */}
      <div className={clsx(
        "absolute right-0 top-9 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600",
        showAuthDropdown ? "block" : "hidden")}>
        <div className="px-4 py-3">
          <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
          <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
        </div>
        <ul className="py-2">
          <li>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
          </li>
        </ul>
      </div>
    </div>
  );
}