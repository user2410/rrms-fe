"use client"

import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(...registerables);

export default function WelcomeTile() {
  return (
    <div className="w-full h-full">
      <div className="text-xl font-bold">Welcome back, Pham Chinh</div>
      <div className="text-lg font-normal">
        This is your property portfolio report
      </div>
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
      <div className="m-4 text-sm font-light text-slate-500">
        Last update: 3 days ago
      </div>
    </div>
  );
}
