"use client";

import BillTile from "@/components/page/manage/main-dashboard/bill-tile";
import PlanTile from "@/components/page/manage/main-dashboard/plan-tile";
import RentArrearTile from "@/components/page/manage/main-dashboard/rent-arrear-tile";
import RevenueTile from "@/components/page/manage/main-dashboard/revenue-tile";
import StatsCard from "@/components/page/manage/main-dashboard/stats";
import WelcomeTile from "@/components/page/manage/main-dashboard/welcome-tile";

export default function ManageDashboard() {
  return (
    <div className="py-20">
      <div className="m-4 grid grid-cols-3 gap-8">
        <div className="col-span-2 grid grid-cols-3 gap-8 bg-slate-100">
          <div className="p-7 col-span-3 bg-red-200 bg-no-repeat bg-[length:500px_500px] bg-[bottom_-7rem_right_-3rem]" style={{backgroundImage:"url(/img/house_welcome-bg.png)"}}>
            <WelcomeTile/>
          </div>
          <div className="hover:cursor-pointer">
            <StatsCard
              statSubtitle="New Applicants"
              statTitle="16"
              statArrow="up"
              statPercent="3.48"
              statPercentColor="text-emerald-500"
              statDescripiron="Since last month"
              statIconName="fas fa-file-lines"
              statIconColor="bg-emerald-300"
            />
          </div>
          <div className="hover:cursor-pointer">
            <StatsCard
              statSubtitle="Enquiry messages"
              statTitle="142"
              statArrow="up"
              statPercent="3.48"
              statPercentColor="text-emerald-500"
              statDescripiron="Since last month"
              statIconName="fas fa-envelope"
              statIconColor="bg-blue-300"
            />
          </div>
          <div className="hover:cursor-pointer">
            <StatsCard
              statSubtitle="Maintenance requests"
              statTitle="33"
              statArrow="up"
              statPercent="3.48"
              statPercentColor="text-emerald-500"
              statDescripiron="Since last month"
              statIconName="fas fa-screwdriver-wrench"
              statIconColor="bg-yellow-300"
            />
          </div>
        </div>
        <div className="p-7 shadow-md bg-white">
          <PlanTile/>
        </div>
        <div className="col-span-2 row-span-2">
          <RevenueTile/>
        </div>
        <div className="p-7 shadow-md bg-white">
          <RentArrearTile/>
        </div>
        <div className="p-7 shadow-md bg-white">
          <BillTile/>
        </div>
      </div>
    </div>
  );
}
