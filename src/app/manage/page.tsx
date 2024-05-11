"use client";

import { useSession } from "next-auth/react";
import Maintenance from "./_components/maintenance";
import NewApplications from "./_components/new_applications";
import PlanTile from "./_components/plan-tile";
import RentArrearTile from "./_components/rent-arrear-tile";
import RevenueTile from "./_components/revenue-tile";
import WelcomeTile from "./_components/welcome-tile";

export default function ManageDashboard() {
  const session = useSession();
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-6 gap-8 p-4 md:p-6 lg:p-8">
      <div className="xl:col-span-4 grid grid-cols-6 gap-8">
        <div className="xl:col-span-6">
          <WelcomeTile sessionData={session.data!}/>
        </div>
        <div className="xl:col-span-3">
          <NewApplications sessionData={session.data!} />
        </div>
        <div className="xl:col-span-3">
          <Maintenance sessionData={session.data!} />
        </div>
      </div>
      <div className="xl:col-span-2">
        <PlanTile sessionData={session.data!} />
      </div>
      <div className="xl:col-span-3">
        <RevenueTile sessionData={session.data!}/>
      </div>
      <div className="xl:col-span-3">
        <RentArrearTile sessionData={session.data!} />
      </div>
    </div>
  );
}
