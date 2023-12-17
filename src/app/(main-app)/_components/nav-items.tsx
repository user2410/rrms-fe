import { Fragment, useEffect } from "react";
import { Drawer } from "@/components/ui/drawer/drawer";
import motionProps from '@components/ui/drawer/motion';
import { useUI } from "@/context/ui.context";
import useRoutes from "@/hooks/use-route";
import { IoClose } from "react-icons/io5";

export default function NavItems() {
  const rootRoute = useRoutes();
  const {
    displaySidebar,
    closeSidebar,
  } = useUI();

  useEffect(() => { console.log(displaySidebar)} , [displaySidebar]);

  return (
    <Fragment>
      <div className="items-center justify-between hidden w-full md:flex md:w-auto bg-background/95 backdrop-blur" id="navbar-language">
        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 ">
          {rootRoute.subroutes?.map((item, index) => (
            <li key={index}>
              <a href={item.href} className="block py-2 pl-3 pr-4 text-foreground/60 hover:text-primary rounded bg-transparent md:p-0">{item.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <Drawer
        className="w-[375px]"
        placement="right"
        open={displaySidebar}
        onClose={closeSidebar}
        // @ts-ignore
        level={null}
        {...motionProps}
      >
        {/* Mobile menu */}
        <div className="p-4">
          <span onClick={closeSidebar}><IoClose size={24}/></span>
          <ul className="flex flex-col space-y-2 font-medium rounded-lg">
            {rootRoute.subroutes?.map((item, index) => (
              <li key={index}>
                <a href={item.href} className="block py-2 pl-3 pr-4 text-foreground/60 hover:text-foreground/80 rounded bg-transparent">{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </Drawer>
    </Fragment>
  );
};
