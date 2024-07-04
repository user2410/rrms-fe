"use client";

// import { useAlarms } from "@/hooks/use-alarm";
// import { backendAPI } from "@/libs/axios";
// import { Reminder } from "@/models/reminder";
// import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// const notificationLeadTime = 30; // 30 minutes
// const SEENREMINDER_LC_KEY = "seen_reminders";

export default function ReminderComponent() {
  // const session = useSession();
  // const [accessToken, setAccessToken] = useState<string | null>(null);

  // useEffect(() => {
  //   console.log("new session status", session.status, session.data);
  //   if (session.status === "authenticated" && session.data?.user?.accessToken) {
  //     setAccessToken(session.data.user.accessToken);
  //   }
  // }, [session.status, session]);

  // const {data: reminders} = useQuery<Reminder[]>({
  //   queryKey: ["reminders", accessToken],
  //   queryFn: async ({queryKey}) => {
  //     const minStartAt = new Date();
  //     const maxStartAt = new Date();
  //     maxStartAt.setHours(23, 59, 59, 999);
  //     return (await backendAPI.get<Reminder[]>("/api/reminders", {
  //       params: {
  //         minStartAt,
  //         maxStartAt,
  //       },
  //       headers: {
  //         Authorization: `Bearer ${queryKey.at(-1)}`,
  //       },
  //       validateStatus: (status) => status < 500,
  //     })).data || ([] as Reminder[]);
  //   },
  //   enabled: !!accessToken,
  //   refetchInterval: 1000 * 60 * 10, // 10 minute
  // });

  // useAlarms(
  //   // exclude all seen reminders
  //   reminders?.filter((r) => !JSON.parse(localStorage.getItem(SEENREMINDER_LC_KEY) || "[]").includes(r.id)) || [],
  //   notificationLeadTime,
  //   (r) => {
  //     toast.custom((t) => (
  //       <div
  //         className={`${
  //           t.visible ? 'animate-enter' : 'animate-leave'
  //         } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
  //       >
  //         <div className="flex-1 w-0 p-4">
  //           <div className="flex items-start">
  //             <div className="ml-3 flex-1">
  //               <p className="text-sm font-medium text-gray-900">
  //                 Bạn có lịch hẹn từ {new Date(r.startAt).toLocaleTimeString("vi-VN")} đến {new Date(r.endAt).toLocaleTimeString("vi-VN")} tại {r.location}
  //               </p>
  //               <p className="mt-1 text-sm text-gray-500">
  //                 {r.title}
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="flex border-l border-gray-200">
  //           <button
  //             onClick={() => toast.dismiss(t.id)}
  //             className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
  //           >
  //             OK
  //           </button>
  //         </div>
  //       </div>
  //     ), {
  //       position: "top-right",
  //       duration: 1000 * 20, // 20 seconds
  //     });      
  //     const seenReminders = JSON.parse(localStorage.getItem(SEENREMINDER_LC_KEY) || "[]");
  //     if (!seenReminders.includes(r.id)) {
  //       seenReminders.push(r.id);
  //       localStorage.setItem(SEENREMINDER_LC_KEY, JSON.stringify(seenReminders));
  //     }
  //   },
  // );

  return (<></>);
};
