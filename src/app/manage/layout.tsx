"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ManageDashboardNavbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";

export default function Layout({ 
  children
} : {
  children: React.ReactNode
}) {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "unauthenticated") {
    router.replace(`/auth/login/?redirect=${encodeURIComponent(window.location.pathname)}`);
    return <p>Access Denied</p>;
  }

  return (
    <div className="w-full h-full grid grid-cols-12 bg-gray-100 dark:bg-background">
      <div className="hidden xl:block xl:col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-12 xl:col-span-10">
        <div className="max-h-[88px]">
          <ManageDashboardNavbar />
        </div>
        <ScrollArea className="h-[calc(100vh_-_88px)]">
          {children}
        </ScrollArea>
      </div>
    </div>
  );
}
