"use client";

import { addMonths, format } from "date-fns";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { useQuery } from "@tanstack/react-query";
import { backendAPI } from "@/libs/axios";
import Spinner from "@/components/ui/spinner";
import { useState } from "react";
import { Input } from "@/components/ui/input";

ChartJS.register(...registerables);

type RentalPaymentIncomeItem = {
  startTime: Date;
  endTime: Date;
  amount: number;
};

type Data = RentalPaymentIncomeItem[];

export default function RevenueTile({
  sessionData
}: {
  sessionData: Session;
}) {
  const [startTime, setStartTime] = useState<Date>(addMonths(new Date(), -6));
  const [endTime, setEndTime] = useState<Date>(new Date());

  const query = useQuery<Data>({
    queryKey: ["manage", "statistic", "income", startTime, endTime, sessionData!.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const res = (await backendAPI.get<Data>("/api/statistics/manager/rentals/payments/incomes", {
        params: {
          startTime: queryKey.at(3), // startTime
          endTime: queryKey.at(4), // endTime
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ([]);
      return res.map((item) => ({
        ...item,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
      }));
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  // by default, min time = 12 months ago
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Thu nhập</CardTitle>
        <div className="flex flex-row justify-start items-center gap-2">
          <CardDescription>Báo cáo từ</CardDescription>
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
      <CardContent className="flex flex-col items-center gap-4">
        {query.isLoading ? (
          <Spinner size={32} />
        ) : query.isError ? (
          <div className="text-red-500">Lỗi khi tải dữ liệu</div>
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
                    label: "Thu nhập",
                    data: query.data.map((item) => item.amount),
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
