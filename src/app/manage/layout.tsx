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

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "unauthenticated") {
    router.replace("/");
    return <p>Access Denied</p>;
  }

  return (
    <ManageLayout 
      user={session.data?.user} 
      updateSession={(accessToken: string, accessExp: string) => session.update({
        ...session.data,
        user: {
          ...session.data!.user,
          accessToken: accessToken,
          accessExp: accessExp,
        }
      })}
    >
      {children}
    </ManageLayout>
  );
}

function ManageLayout ({
  children,
  user,
  updateSession,
} : {
  children: React.ReactNode;
  user: any;
  updateSession: (accessToken: string, accessExp: string) => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if(new Date(user.accessExp as string) < new Date()) {
      if(new Date(user.refreshExp as string) > new Date()) {
        backendAPI.put("/api/auth/credential/refresh", {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken
        }).then((res) => {
          updateSession(res.data.accessToken, res.data.accessExp);
          setReady(true);
        }).catch((err) => {
          console.error(err);
          signOut({
            callbackUrl: '/',
          });
        });
      } else {
        signOut({
          callbackUrl: '/',
        });
      }
    } else {
      setReady(true);
    }
  }, []);

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
