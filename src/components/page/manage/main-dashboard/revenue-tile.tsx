"use client";

import { format } from "date-fns";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

ChartJS.register(...registerables);

export default function RevenueTile() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Your property finance report from {format(new Date(), "MMMM,d")} - {format(new Date(), "MMMM,d")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
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
                labels: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                datasets: [
                  {
                    label: "Income",
                    data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
                    backgroundColor: "rgba(0, 99, 132, 0.6)",
                    borderColor: "rgba(0, 99, 132, 1)",
                    borderWidth: 1,
                  },
                  {
                    label: "Expense",
                    data: [62, 58, 78, 79, 54, 53, 38, 62, 58, 78, 79, 54],
                    backgroundColor: "rgba(99, 132, 0, 0.6)",
                    borderColor: "rgba(99, 132, 0, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
          <div className="">
            <Card className="border-none">
              <CardHeader>
                <CardTitle>đ120,000,000</CardTitle>
                <CardDescription>Total balance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-1">
                  <div className="flex shrink-0 grow-0 items-center justify-center">
                    <div className="p-2 rounded-full bg-red-400">
                      <FiTrendingUp size={25} />
                    </div>
                  </div>
                  <CardHeader className="p-0 2xl:p-3">
                    <CardTitle className="break-words">₫20,000,000</CardTitle>
                    <CardDescription>Total income</CardDescription>
                  </CardHeader>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex shrink-0 grow-0 items-center justify-center">
                    <div className="p-2 rounded-full bg-green-400">
                      <FiTrendingDown size={25} />
                    </div>
                  </div>
                  <CardHeader className="p-0 2xl:p-3">
                    <CardTitle className="break-words">₫20,000,000</CardTitle>
                    <CardDescription>Total expenses</CardDescription>
                  </CardHeader>
                </div>
              </CardContent>
              <CardFooter className="justify-center border-none">
                <Button variant="default">
                  <i className="fa-solid fa-file-arrow-down mr-2 h-4 w-4" />
                  Download report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
