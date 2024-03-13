"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import ManageDashboardNavbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { backendAPI } from "@/libs/axios";

export default function Layout({ 
  children
} : {
  children: React.ReactNode
}) {
  const session = useSession();
  const router = useRouter();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (session.status !== "authenticated" || ready) return;
    const user = session.data.user;
    const now = new Date();
    console.log(new Date(user.accessExp as string), new Date(user.accessExp as string) < now);
    console.log(new Date(user.refreshExp as string), new Date(user.refreshExp as string) > now);
    if(new Date(user.accessExp as string) < now) {
      if(new Date(user.refreshExp as string) > now) {
        backendAPI.put("/api/auth/credential/refresh", {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken
        }).then((res) => {
          session.update(({
            accessToken: res.data.accessToken,
            accessExp: res.data.accessExp,
          }));
          setReady(true);
        }).catch((err) => {
          console.error(err);
          signOut({
            callbackUrl: '/',
          });
        });
      } else {
        console.error("Session expired");
        signOut({
          callbackUrl: '/',
        });
      }
    } else {
      setReady(true);
    }
  }, [session.status]);

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "unauthenticated") {
    router.replace("/");
    return <p>Access Denied</p>;
  }

  return ready && (
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
