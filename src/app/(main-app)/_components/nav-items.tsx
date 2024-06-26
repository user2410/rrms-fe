"use client";

import { Icons } from "@/components/ui/icons";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import useRoutes from "@/hooks/use-route";
import { mapPropertyTypeToText } from "@/models/property";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

const properties: { key: string; title: string; description: string }[] = [
  {
    key: "APARTMENT",
    title: "Căn hộ",
    description: "Căn hộ chung cư, căn hộ dịch vụ, căn hộ mini, căn hộ officetel.",
  },
  {
    key: "PRIVATE",
    title: "Nhà riêng",
    description: "Nhà nguyên căn, nhà mặt phố, nhà liền kề, nhà biệt thự.",
  },
  {
    key: "ROOM",
    title: "Phòng trọ",
    description: "Phòng trọ, phòng trọ chung chủ, phòng trọ khép kín.",
  },
  {
    key: "OFFICE",
    title: "Văn phòng",
    description: "Văn phòng cho thuê, văn phòng chia sẻ",
  },
  {
    key: "STORE",
    title: "Cửa hàng",
    description: "Cửa hàng, cửa hàng kinh doanh, cửa hàng mặt phố.",
  },
  {
    key: "VILLA",
    title: "Biệt thự",
    description: "Biệt thự, biệt thự nghỉ dưỡng, biệt thự liền kề.",
  },
];

export default function NavItems() {
  const rootRoute = useRoutes();

  return (
    <div
      className="md:w-auto bg-background/95 backdrop-blur"
    >
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Nhà cho thuê</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {properties.map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={`/search/ptypes=${item.key}`}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/news" legacyBehavior passHref>
              <NavigationMenuLink className="px-4 py-2">
                Tin tức
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/guide" legacyBehavior passHref>
              <NavigationMenuLink className="px-4 py-2">
                Hướng dẫn
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(function Render({ className, title, children, ...props }, ref) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={clsx(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
