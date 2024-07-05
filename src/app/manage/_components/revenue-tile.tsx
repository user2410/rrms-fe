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
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

ChartJS.register(...registerables);

type RetrievedRentalPayment = {
  startTime: string;
  endTime: string;
  amount: number;
};

type RentalPaymentItem = {
  startTime: Date;
  endTime: Date;
  income: number;
  expense: number;
};

type Data = RentalPaymentItem[];

export default function RevenueTile({
  sessionData
}: {
  sessionData: Session;
}) {
  const [startTime, setStartTime] = useState<Date>(addMonths(new Date(), -6));
  const [endTime, setEndTime] = useState<Date>(new Date());

  const paymentQuery = useQuery<Data>({
    queryKey: ["manage", "statistic", "income", startTime, endTime, sessionData!.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const incomes = (await backendAPI.get<RetrievedRentalPayment[]>("/api/statistics/manager/rentals/payments/incomes", {
        params: {
          startTime: queryKey.at(3), // startTime
          endTime: queryKey.at(4), // endTime
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ([]);
      const expenses = (await backendAPI.get<RetrievedRentalPayment[]>("/api/statistics/manager/payments", {
        params: {
          startTime: queryKey.at(3), // startTime
          endTime: queryKey.at(4), // endTime
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ([]);
      // group 2 sets by startTime and endTime
      const data = incomes.map((item) => ({
        ...item,
        income: item.amount,
        expense: expenses.find((e) => e.startTime === item.startTime && e.endTime === item.endTime)?.amount ?? 0,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
      }) as RentalPaymentItem);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  const allTimePaymentQuery = useQuery<Data>({
    queryKey: ["manage", "statistic", "income", sessionData!.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const incomes = (await backendAPI.get<RetrievedRentalPayment[]>("/api/statistics/manager/rentals/payments/incomes", {
        params: {
          startTime: new Date(sessionData.user.user.createdAt),
          endTime: new Date(),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ([]);
      const expenses = (await backendAPI.get<RetrievedRentalPayment[]>("/api/statistics/manager/payments", {
        params: {
          startTime: new Date(sessionData.user.user.createdAt), // startTime
          endTime: queryKey.at(4), // endTime
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ([]);
      // group 2 sets by startTime and endTime
      const data = incomes.map((item) => ({
        ...item,
        income: item.amount,
        expense: expenses.find((e) => e.startTime === item.startTime && e.endTime === item.endTime)?.amount ?? 0,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
      }) as RentalPaymentItem);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  const totalExpense = useMemo(() => {
    if (allTimePaymentQuery.status === "success") {
      return paymentQuery.data?.reduce((acc, cur) => acc + cur.expense, 0) ?? 0;
    }
    return 0;
  }, [allTimePaymentQuery.status]);

  const totalIncome = useMemo(() => {
    if (allTimePaymentQuery.status === "success") {
      return paymentQuery.data?.reduce((acc, cur) => acc + cur.income, 0) ?? 0;
    }
    return 0;
  }, [allTimePaymentQuery.status]);

  // by default, min time = 12 months ago
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-lg">Thu nhập</CardTitle>
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
        {paymentQuery.isLoading ? (
          <Spinner size={32} />
        ) : paymentQuery.isError ? (
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
                labels: paymentQuery.data.map((item) => `T${item.startTime.getMonth() + 1}-${item.startTime.getFullYear()}`),
                datasets: [
                  {
                    label: "Thu nhập",
                    data: paymentQuery.data.map((item) => item.income),
                    backgroundColor: "rgba(0, 99, 132, 0.6)",
                    borderColor: "rgba(0, 99, 132, 1)",
                    borderWidth: 1,
                  },
                  {
                    label: "Chi phí",
                    data: paymentQuery.data.map((item) => item.expense),
                    backgroundColor: "rgb(235, 146, 52)",
                    borderColor: "rgba(0, 99, 132, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </>
        )}
        <div className="flex flex-row justify-center">
          <table>
            <tbody>
              <tr>
                <th className="font-semibold text-left" style={{color: "rgba(0, 99, 132, 0.6)"}}>Tổng thu nhập:</th>
                <th className="text-right">{allTimePaymentQuery.status === "success" ? (totalIncome.toLocaleString("vi-VN", { style: "currency", currency: "VND"})) : (<Spinner size={16}/>) }</th>
              </tr>
              <tr>
                <th className="font-semibold text-left" style={{color: "rgb(235, 146, 52)"}}>Tổng chi phí:</th>
                <th className="text-right">{allTimePaymentQuery.status === "success" ? (totalExpense.toLocaleString("vi-VN", { style: "currency", currency: "VND"})) : (<Spinner size={16}/>) }</th>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
