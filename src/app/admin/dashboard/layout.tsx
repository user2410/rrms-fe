"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import Sidebar from "./_components/sidebar";
import DashboardNavbar from "./_components/dashboard_navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboardLayout({
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
    router.replace("/");
    return <p>Access Denied</p>;
  }

  if (session.status === "authenticated" && session.data.user.user.role !== "ADMIN") {
    router.replace("/admin");
    return <p>Access Denied</p>;
  }

  return (
    <div className="w-full h-full grid grid-cols-12 bg-gray-100 dark:bg-background">
      <div className="hidden xl:block xl:col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-12 xl:col-span-10">
        <div className="max-h-[88px]">
          <DashboardNavbar />
        </div>
        <ScrollArea className="h-[calc(100vh_-_88px)]">
          {children}
        </ScrollArea>
      </div>
    </div>
  );
};
