"use client";

import ManageDashboardNavbar from "@components/page/manage/navbar";
import Sidebar from "@components/page/manage/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ManageLayout({ 
  children
} : {
  children: React.ReactNode
}) {
  const { status } = useSession()
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    router.replace("/");
    return <p>Access Denied</p>
  }


  return (
    <div className="h-full">
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <ManageDashboardNavbar />
        {children}
      </div>
    </div>
  );
}
