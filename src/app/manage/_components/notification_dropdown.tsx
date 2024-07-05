"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import useFcmToken from "@/hooks/use_fcm-token";
import { backendAPI } from "@/libs/axios";
import { firebaseApp } from "@/libs/firebase";
import { FCMBackgroundPayload, FCMForegroundPayload } from "@/models/fcm_token";
import { getNotificationActionLink, NotificationModel } from "@/models/notification";
import { useQuery } from "@tanstack/react-query";
import { formatDistance } from 'date-fns';
import { vi as vilocale } from "date-fns/locale";
import { getMessaging, onMessage } from "firebase/messaging";
import { Bell } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function NotificationDropdown() {
  const session = useSession();
  const { fcmToken } = useFcmToken(
    session.data?.user.user.id || "",
    session.data?.user.accessToken || "",
  );
  const [newNotifications, setNewNotifications] = useState<NotificationModel[]>([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !fcmToken) {
      return;
    }

    const messaging = getMessaging(firebaseApp);
    const unsubscribe = onMessage(messaging, (event) => {
      console.log('Foreground push notification received:', event);
      const payload = event as FCMForegroundPayload;
      // Handle the received push notification while the app is in the foreground
      // You can display a notification or update the UI based on the payload

      // notifications records in database
      const ns = JSON.parse(event.data?.notifications || "[]") as NotificationModel[];
      const n = ns.find((n) => (n.userId === session.data?.user.user.id));

      if (n && newNotifications.findIndex((nn) => nn.id === n.id) === -1) {
        const newNotification = {
          id: n.id,
          userId: n.userId,
          title: payload.notification.title,
          content: payload.notification.body,
          data: {
            ...event.data,
            notificationType: JSON.parse(event.data?.notificationType || ""),
          },
          seen: false,
          target: n.target,
          channel: n.channel,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt),
        };
        setNewNotifications(v => [...v, newNotification]);
        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <Link href={getNotificationActionLink(newNotification)} className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {payload.notification.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {payload.notification.body}
              </p>
            </Link>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                OK
              </button>
            </div>
          </div>
        ), {
          position: "top-right",
        });
      }
    });
    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Background message received in client:', event.data);
      const payload = event.data as FCMBackgroundPayload;

      // notifications records in database
      const ns = JSON.parse(payload.data.notification || "[]") as NotificationModel[];
      const n = ns.find((n) => (n.userId === session.data?.user.user.id));

      if (n && newNotifications.findIndex((nn) => nn.id === n.id) === -1) {
        setNewNotifications(v => [...v, {
          id: n.id,
          userId: n.userId,
          title: payload.notification.title,
          content: payload.notification.body,
          data: {
            ...payload.data,
            notificationType: JSON.parse(payload.data?.notificationType || ""),
          },
          seen: false,
          target: n.target,
          channel: n.channel,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt),
        }]);
      }
    });

    return () => {
      unsubscribe(); // Unsubscribe from the onMessage event
    };
  }, [fcmToken, session]);

  const query = useQuery<NotificationModel[]>({
    queryKey: ["misc", "notifications", limit, offset, session.data?.user.accessToken],
    queryFn: async ({ queryKey }) => {
      return ((await backendAPI.get<NotificationModel[]>("/api/misc/notifications", {
        params: {
          limit: queryKey[2],
          offset: queryKey[3],
          channel: "PUSH",
          token: fcmToken,
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || []).map((n) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      } as NotificationModel));
    },
    enabled: session.status === 'authenticated',
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });

  async function handleClickNotification(id: number) {
    try {
      await backendAPI.patch(`/api/misc/notifications/notification/${id}/seend`, undefined, {
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`,
        }
      });
      query.refetch();
    } catch (e) {
      console.error(e);
    }
  }

  return session.status === 'authenticated' && (
    <DropdownMenu>
      <DropdownMenuTrigger className="">
        <div className="relative">
          <Bell className="w-6 h-6" />
          {(query.isSuccess && ((query.data?.length || 0) + newNotifications.length > 0)) && (
            <Badge variant="destructive" className="absolute -top-4 -right-4 px-1 py-0.5">{[...query.data, ...newNotifications].filter((n) => !n.seen).length}</Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ScrollArea className="min-w-[24rem] max-w-[36rem] h-[40vh]">
          {(query.isLoading || query.isError) ? (
            Array.from({ length: 10 }).map((_, index) => (
              <DropdownMenuItem key={index} className="animate-pulse">
                <div className="flex-grow flex flex-row items-center p-2">
                  <Bell className="mr-2 h-4 w-4" />
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg"></h3>
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
            (Object.values([...newNotifications, ...query.data].reduce((accumulator: any, current: any) => (accumulator[current.id] = current, accumulator), {})) as NotificationModel[])
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((item, index) => (
                <DropdownMenuItem key={index}>
                  <Link
                    href={getNotificationActionLink(item)}
                    className="flex-grow flex flex-row items-center p-2 hover:cursor-pointer"
                    onClick={() => handleClickNotification(item.id)}
                  >
                    {!item.seen ? (
                      <span className="relative mr-3">
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-sm bg-blue-600" />
                      </span>
                    ) : (
                      <span className="mr-3">
                        <Bell className="h-4 w-4" />
                      </span>
                    )}

                    <div className="space-y-1">
                      <h3 className="font-semibold text-base text-ellipsis">{item.title}</h3>
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
        </ScrollArea>
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
