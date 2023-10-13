"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import ManageDashboardNavbar from "@components/page/manage/navbar";
import Sidebar from "@components/page/manage/sidebar";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

export default function ManageLayout({ 
  children
} : {
  children: React.ReactNode
}) {
  // const { status } = useSession()
  // const router = useRouter();

  // if (status === "loading") {
  //   return <p>Loading...</p>
  // }

  // if (status === "unauthenticated") {
  //   router.replace("/");
  //   return <p>Access Denied</p>
  // }

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
