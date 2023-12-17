"use client";

import BillTile from "./_components/bill-tile";
import PlanTile from "./_components/plan-tile";
import RentArrearTile from "./_components/rent-arrear-tile";
import RevenueTile from "./_components/revenue-tile";
import StatCard from "./_components/stat-card";
import WelcomeTile from "./_components/welcome-tile";

export default function ManageDashboard() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-4 md:p-6 lg:p-8">
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
