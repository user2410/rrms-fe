"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import useFcmToken from "@/hooks/use_fcm-token";
import { backendAPI } from "@/libs/axios";
import { firebaseApp } from "@/libs/firebase";
import { FCMBackgroundPayload, FCMForegroundPayload } from "@/models/fcm_token";
import { NotificationModel } from "@/models/notification";
import { useQuery } from "@tanstack/react-query";
import { formatDistance } from 'date-fns';
import { vi as vilocale } from "date-fns/locale";
import { getMessaging, onMessage } from "firebase/messaging";
import { Bell } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function NotificationDropdown() {
  const session = useSession();
  const { fcmToken } = useFcmToken(
    session.data?.user.user.id || "",
    session.data?.user.accessToken || "",
  );
  const [newNotifications, setNewNotifications] = useState<NotificationModel[]>([]);

  useEffect(() => {
    if ( typeof window === 'undefined' || !('serviceWorker' in navigator) || !fcmToken ) {
      return;
    }

    const messaging = getMessaging(firebaseApp);
    const unsubscribe = onMessage(messaging, (event) => {
      console.log('Foreground push notification received:', event);
      const payload = event as FCMForegroundPayload;
      // Handle the received push notification while the app is in the foreground
      // You can display a notification or update the UI based on the payload
      setNewNotifications(v => [...v, {
        id: 1,
        userId: session.data?.user.user.id || "",
        title: payload.notification.title,
        content: payload.notification.body,
        data: {},
        seen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
    });
    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Background message received in client:', event.data);
      const payload = event.data as FCMBackgroundPayload;
      setNewNotifications(v => [...v, {
        id: 1,
        userId: session.data?.user.user.id || "",
        title: payload.notification.title,
        content: payload.notification.body,
        data: {},
        seen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
    });

    return () => {
      unsubscribe(); // Unsubscribe from the onMessage event
    };
  }, [fcmToken, session]);

  const query = useQuery<NotificationModel[]>({
    queryKey: ["misc", "notifications", session.data?.user.accessToken],
    queryFn: async ({ queryKey }) => {
      return (await backendAPI.get<NotificationModel[]>("/api/misc/notifications", {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || [];
    },
    enabled: session.status === 'authenticated',
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });

  return session.status === 'authenticated' && (
    <DropdownMenu>
      <DropdownMenuTrigger className="">
        <div className="relative">
          <Bell className="w-6 h-6" />
          {(query.isSuccess && ((query.data?.length || 0) + newNotifications.length > 0)) && (
            <Badge variant="destructive" className="absolute -top-4 -right-4 px-1 py-0.5">{query.data?.length + newNotifications.length}</Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[24rem]">
        {(query.isLoading || query.isError) ? (
          Array.from({ length: 10 }).map((_, index) => (
            <DropdownMenuItem key={index} className="animate-pulse">
              <div className="flex-grow flex flex-row items-center p-2">
                <Bell className="mr-2 h-4 w-4" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">Loading...</h3>
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
                <DropdownMenuShortcut>
                  Loading...
                </DropdownMenuShortcut>
              </div>
            </DropdownMenuItem>
          ))
        ) : query.data.length + newNotifications.length === 0 ? (
          <DropdownMenuItem className="justify-center text-muted-foreground">
            Không có thông báo 
          </DropdownMenuItem>
        ) : (
          [...newNotifications, ...query.data].map((item, index) => (
            <DropdownMenuItem key={index}>
              <Link
                href={item.data.url || "#"}
                className="flex-grow flex flex-row items-center p-2 hover:cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-base">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.content.length > 52 ? `${item.content.slice(0, 53)}...` : item.content}</p>
                </div>
                <DropdownMenuShortcut className="text-xs">
                  {formatDistance(new Date(item.createdAt), new Date(), {
                    addSuffix: true,
                    locale: vilocale,
                  })}
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>

  );
};

function NotificationList({
  sessionData,
  newNotifications,
}: {
  sessionData: Session;
  newNotifications: NotificationModel[];
}) {
  const query = useQuery<NotificationModel[]>({
    queryKey: ["misc", "notifications", sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      return (await backendAPI.get<NotificationModel[]>("/api/misc/notifications", {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <>

    </>
  );
}
