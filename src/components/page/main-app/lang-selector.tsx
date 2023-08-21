import USFlag from "@/assets/svg/USFlag";
import VIFlag from "@/assets/svg/VIFlag";
import useOnClickOutside from "@/hooks/use-click-outside";
import clsx from "clsx";
import { useState } from "react";

const languages = [
  {
    id: 'vi',
    name: 'Tiếng Việt',
    value: 'vi',
    icon: <VIFlag />
  },
  {
    id: 'en',
    name: 'English (US)',
    value: 'en',
    icon: <USFlag />
  }
];

export default function LangSelector({
  headerRef,
}: {
  headerRef: React.RefObject<HTMLElement>
}) {
  const [selectedLang, setSelectedLang] = useState<number>(0);
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);

  useOnClickOutside(headerRef, () => {
    setShowLangDropdown(false);
  })
  return (
    <div className="relative flex">
      <button
        className="inline-flex items-center font-medium justify-center px-2 py-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
        type="button"
        onClick={() => setShowLangDropdown(!showLangDropdown)}
      >
        <span className="w-5 h-5 mr-0 md:mr-2 rounded-full">{languages[selectedLang].icon}</span>
        <span className="hidden md:inline">{languages[selectedLang].name}</span>
      </button>
      {/* Dropdown */}
      <div className={clsx(
        "absolute top-9 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700",
        showLangDropdown ? "block" : "hidden"
      )} id="language-dropdown-menu">
        <ul className="py-2 font-medium" role="none">
          {languages.map((item, index) => (
            <li key={index} onClick={() => setSelectedLang(index)}>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                <div className="inline-flex items-center">
                  <span className="w-5 h-5 mr-2">{item.icon}</span>
                  {item.name}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}