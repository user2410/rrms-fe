import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { Chart as ChartJS, registerables } from "chart.js";
import { addMonths, format } from "date-fns";
import { Session } from "next-auth";
import Link from "next/link";
import { useState } from "react";
import { Chart } from "react-chartjs-2";

ChartJS.register(...registerables);

type ExpenditureItem = {
  startTime: Date;
  endTime: Date;
  expenditure: number;
};


export default function Expenditure({
  className,
  sessionData
}: {
  className?: string;
  sessionData: Session;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl">Chi tiêu</CardTitle>
        <Link href="/manage/rentals" className="hover:underline">Xem tất cả</Link>
      </CardHeader>
      <CardContent>
        <Graph sessionData={sessionData} />
      </CardContent>
    </Card>
  );
};

function Graph({
  sessionData
}: {
  sessionData: Session;
}) {
  const [startTime, setStartTime] = useState<Date>(addMonths(new Date(), -6));
  const [endTime, setEndTime] = useState<Date>(new Date());

  const query = useQuery<ExpenditureItem[]>({
    queryKey: ["manage", "statistic", "expenditures", startTime, endTime, sessionData!.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const res = (await backendAPI.get<ExpenditureItem[]>("/api/statistics/tenant/expenditures", {
        params: {
          startTime: queryKey.at(3),
          endTime: queryKey.at(4),
          limit: 100,
          offset: 0,
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        },
      })).data || ([] as ExpenditureItem[]);
      return res.map((item) => ({
        ...item,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
      }));
    },
  });

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-base">Biểu đồ chi tiêu</CardTitle>
        <div className="flex flex-row justify-start items-center gap-2">
          <Input
            className="w-min"
            type="date"
            value={format(startTime, "yyyy-MM-dd")}
            onChange={(e) => {
              if (e.currentTarget.valueAsDate) {
                setStartTime(e.currentTarget.valueAsDate);
              }
            }}
          />
          <Input
            className="w-min"
            type="date"
            value={format(endTime, "yyyy-MM-dd")}
            onChange={(e) => {
              if (e.currentTarget.valueAsDate) {
                setEndTime(e.currentTarget.valueAsDate);
              }
            }}
          />
        </div>
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
          <>
            <Chart
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
              type="bar"
              data={{
                labels: query.data.map((item) => `T${item.startTime.getMonth() + 1}-${item.startTime.getFullYear()}`),
                datasets: [
                  {
                    label: "Chi tiêu",
                    data: query.data.map((item) => item.expenditure),
                    backgroundColor: "rgba(0, 99, 132, 0.6)",
                    borderColor: "rgba(0, 99, 132, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
            {/* <Button className="flex flex-row items-center gap-2">
                <i className="fa-solid fa-file-arrow-down h-4 w-4" />
                Tải báo cáo
              </Button> */}
          </>
        )}
      </CardContent>
    </Card>
  );
}
