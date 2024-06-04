import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { RentalComplaint } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck, CircleDot, CirclePause } from "lucide-react";
import { Session } from "next-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ComplaintItem from "../rentals/rental-complaints/_components/complaint_item";

type Statistic = {
  pending: number;
  resolved: number;
  closed: number;
};

type Data = {
  complaints: RentalComplaint[];
  statistic: Statistic;
};

export default function RentalComplaints({
  className,
  sessionData
}: {
  className?: string;
  sessionData: Session;
}) {
  const [status, setStatus] = useState<"PENDING" | "RESOLVED" | "CLOSED">("PENDING");

  const query = useQuery<Data>({
    queryKey: ["manage", "statistics", "rentals", "complaints", status, sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const statistic = (await backendAPI.get<Statistic>("/api/statistics/tenant/maintenances", {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data;
      const complaints = (await backendAPI.get<RentalComplaint[]>("/api/rental-complaints", {
        params: {
          status: queryKey.at(4),
          limit: 5,
          offset: 0,
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        },
      })).data || ([] as RentalComplaint[]);
      return {
        statistic,
        complaints: complaints.map(r => ({
          ...r,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
          occurredAt: new Date(r.occurredAt),
        })),
      };
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  const List = ({ items }: { items: RentalComplaint[] }) => (
    <ScrollArea className="w-full h-40 space-y-2">
      {items.map((item, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <div className="flex flex-row items-center gap-1 border px-2 py-1 hover:cursor-pointer">
              {item.status === "PENDING"
                ? (<CircleDot className="w-4 h-4 text-green-600" />)
                : item.status === "RESOLVED"
                  ? (<CircleCheck className="w-4 h-4 text-purple-600" />)
                  : item.status === "CLOSED"
                  && (<CirclePause className="w-4 h-4 text-slate-600" />)}
              <span>{item.title}</span>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[40vw]">
            <DialogHeader/>
            <ComplaintItem sessionData={sessionData} item={item}/>
          </DialogContent>
        </Dialog>
      ))}
    </ScrollArea>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Báo cáo</CardTitle>
      </CardHeader>
      <CardContent>
        {query.isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner size={32} />
          </div>
        ) : query.isError ? (
          <div className="flex items-center justify-center">
            Lỗi khi tải dữ liệu
          </div>
        ) : (
          <Tabs
            value={status}
            onValueChange={(value) => setStatus(value as any)}
          >
            <TabsList>
              <TabsTrigger value="PENDING" className="space-x-1">
                <CircleDot className="w-4 h-4 text-green-600" />
                <p className="text-sm">Đang chờ xử lý: {query.data.statistic.pending}</p>
              </TabsTrigger>
              <TabsTrigger value="RESOLVED" className="space-x-1">
                <CircleCheck className="w-4 h-4 text-purple-600" />
                <p className="text-sm">Đã xử lý: {query.data.statistic.resolved}</p>
              </TabsTrigger>
              <TabsTrigger value="CLOSED" className="space-x-1">
                <CirclePause className="w-4 h-4 text-slate-600" />
                <p className="text-sm">Đã đóng: {query.data.statistic.closed}</p>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="PENDING"><List items={query.data.complaints} /></TabsContent>
            <TabsContent value="RESOLVED"><List items={query.data.complaints} /></TabsContent>
            <TabsContent value="CLOSED"><List items={query.data.complaints} /></TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
