"use client";

import BillTile from "@/components/page/manage/main-dashboard/bill-tile";
import PlanTile from "@/components/page/manage/main-dashboard/plan-tile";
import RentArrearTile from "@/components/page/manage/main-dashboard/rent-arrear-tile";
import RevenueTile from "@/components/page/manage/main-dashboard/revenue-tile";
import StatCard from "@/components/page/manage/main-dashboard/stat-card";
import WelcomeTile from "@/components/page/manage/main-dashboard/welcome-tile";

export default function ManageDashboard() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 grid grid-cols-3 gap-8">
        <div className="col-span-3">
          <WelcomeTile />
        </div>
        <div className="hover:cursor-pointer">
          <StatCard
            title="New Applicants"
            icon={<i className="fas fa-file-lines"/>}
            data="16"
            statArrow="up"
            change="3.48%"
            since="Since last month"
          />
        </div>
        <div className="hover:cursor-pointer">
          <StatCard
            title="Enquiry messages"
            icon={<i className="fas fa-envelope"/>}
            data="142"
            statArrow="down"
            change="3.48%"
            since="Since last month"
          />
        </div>
        <div className="hover:cursor-pointer">
          <StatCard
            title="Maintenance requests"
            icon={<i className="fas fa-screwdriver-wrench"/>}
            data="3"
            statArrow="none"
            change="3.48%"
            since="Since last week"
          />
        </div>
      </div>
      <div className="">
        <PlanTile />
      </div>
      <div className="xl:col-span-2 row-span-2">
        <RevenueTile />
      </div>
      <div className="">
        <RentArrearTile />
      </div>
      <div className="">
        <BillTile />
      </div>
    </div>
  );
}
