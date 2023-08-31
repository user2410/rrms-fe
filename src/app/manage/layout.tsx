"use client";

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
    <div className="h-full">
      <Sidebar />
      <div className="relative md:ml-64 md:w-[calc(100vw_-_18rem)]">
        <ManageDashboardNavbar />
        <div className="py-20">
          <div className="m-4 w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
