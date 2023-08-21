"use client"

import { format } from "date-fns";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(...registerables);

export default function RevenueTile() {
  return (
    <>
      <div className="p-7">
        <div className="text-xl font-bold">Revenue Overview</div>
        <div className="text-lg font-normal">
          Your property finance report from {format(new Date(), "MMMM,d")} -{" "}
          {format(new Date(), "MMMM,d")}
        </div>
      </div>
      <hr className="mb-4 md:min-w-full" />
      <div className="flex flex-row">
        <div className="p-7 flex-[3] ">
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
        <div className="p-7 flex-[2] border-l border-gray-300">
          <div className="mb-4">
            <div className="text-xl font-extrabold">
              ₫<span className="text-3xl">120,000,000</span>
            </div>
            <div className="text-lg font-light">Total income</div>
          </div>
          <div className="my-4 flex space-x-4">
            <div className="flex shrink-0 grow-0 items-center justify-center">
              <div className="p-2 rounded-full bg-green-200 text-gray-900">
                <FiTrendingUp size={25} />
              </div>
            </div>
            <div>
              <div className="text-md font-semibold my-2">₫60,000,000</div>
              <div className="text-sm font-light my-2">Total income</div>
            </div>
          </div>
          <div className="my-4 flex space-x-4">
            <div className="flex shrink-0 grow-0 items-center justify-center">
              <div className="p-2 rounded-full bg-red-200 text-gray-900">
                <FiTrendingDown size={25} />
              </div>
            </div>
            <div>
              <div className="text-md font-semibold my-2">₫20,000,000</div>
              <div className="text-sm font-light my-2">Total expenses</div>
            </div>
          </div>
          <div className="w-full">
            <div className="mx-auto w-fit">
              <button className="bg-red-200 hover:bg-red-500 text-orange-600 hover:text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <svg
                  className="fill-current w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
