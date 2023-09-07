"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(...registerables);

export default function WelcomeTile() {
  return (
    <Card className="w-full h-full bg-none 2xl:bg-[url('/img/house_welcome-bg.png')] 2xl:bg-no-repeat 2xl:bg-right-bottom 2xl:bg-contain">
      <CardHeader>
        <CardTitle>Welcome back, Pham Chinh</CardTitle>
        <CardDescription>This is your property portfolio report</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="my-8 flex space-x-8">
          <div className="w-32 h-32 flex items-center">
            <Chart
              type="doughnut"
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
              data={{
                labels: ["Vacant", "Occupied", "Unlisted"],
                datasets: [
                  {
                    data: [300, 50, 100],
                    backgroundColor: [
                      "rgb(249 128 128)",
                      "rgb(118 169 250)",
                      "rgb(172 148 250)",
                    ],
                    hoverOffset: 4,
                  },
                ],
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-md font-md">Property total</div>
            <div className="text-5xl font-extrabold">126</div>
          </div>
          <div className="border-l border-red-300">
            <div className="my-4 flex">
              <span className="w-1 h-6 ml-2 inline-block bg-red-400"></span>
              <span className="mx-2 font-bold">63</span>
              <span className="text-md font-md">Vacant</span>
            </div>
            <div className="my-4 flex">
              <span className="w-1 h-6 ml-2 inline-block bg-blue-400"></span>
              <span className="mx-2 font-bold">32</span>
              <span className="text-md font-md">Occupied</span>
            </div>
            <div className="my-4 flex">
              <span className="w-1 h-6 ml-2 inline-block bg-purple-400"></span>
              <span className="mx-2 font-bold">63</span>
              <span className="text-md font-md">Unlisted</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        Last update: 3 days ago
      </CardFooter>
    </Card>
  );
}
