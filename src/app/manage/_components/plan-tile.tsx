import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addDays } from "date-fns";
import DarkCalendarStripe from "./date-stripe";
import { Reminder } from "@/models/reminder";
import { useQuery } from "@tanstack/react-query";
import { backendAPI } from "@/libs/axios";
import { Session } from "next-auth";
import { useState } from "react";
import Spinner from "@/components/ui/spinner";
import { cn } from "@/libs/utils";

type DataItem = {
  day: Date;
  reminders: Reminder[];
};

export default function PlanTile({
  className,
  sessionData
}: {
  className?: string;
  sessionData: Session;
}) {
  const [date] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<number>(0);

  const query = useQuery<DataItem[]>({
    queryKey: ["manage", "reminders", date, sessionData.user.accessToken],
    queryFn: async ({queryKey}) => {
      const days = [...Array(7).keys()].map((i) => addDays(new Date(queryKey.at(2) as any), i));
      const res : DataItem[] = [];
      for(const day of days) {
        const minStartAt = new Date(day);
        const maxStartAt = new Date(day);
        minStartAt.setHours(0, 0, 0, 0);
        maxStartAt.setHours(23, 59, 59, 999);
        const r = (await backendAPI.get<Reminder[]>("/api/reminders", {
          params: {
            minStartAt,
            maxStartAt,
          },
          headers: {
            Authorization: `Bearer ${queryKey.at(-1)}`,
          },
        })).data || ([] as Reminder[]);
        res.push({
          day: new Date(day),
          reminders: r.map((item) => ({
            ...item, 
            startAt: new Date(item.startAt),
            endAt: new Date(item.endAt),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          })),
        });
      }
      return res;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });
  return (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl">Kế hoạch</CardTitle>
      </CardHeader>
      {query.isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Spinner size={32}/>
        </div>
      ) : query.isError ? (
        <div className="flex items-center justify-center h-32">
          Lỗi khi tải dữ liệu
        </div>
      ) : (
        <CardContent className="space-y-4 px-2">
          <DarkCalendarStripe
            dates={query.data.map((item, index) => ({
              date: item.day,
              isHighlighted: index === selectedDate,
              hasEvent: item.reminders.length > 0,
            }))}
            onClick={(index) => setSelectedDate(index)}
          />
          <ScrollArea className="space-y-4 max-h-[260px]">
            {query.data[selectedDate].reminders.length === 0 ? (
              <div className="w-full flex flex-row justify-center">
                Không có lịch hẹn vào ngày hôm nay
              </div>
            ) : query.data[selectedDate].reminders.map((item, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.title}&nbsp;({item.startAt.toLocaleTimeString("vi-VN")} - {item.endAt.toLocaleTimeString("vi-VN")})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
