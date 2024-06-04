"use client";

import { getUserFullName } from "@/models/user";
import { useSession } from "next-auth/react";
import CurrentRentals from "./_components/current_rentals";
import Expenditure from "./_components/expenditure";
import Maintenance from "./_components/maintenance";
import NewApplications from "./_components/new_applications";
import PlanTile from "./_components/plan-tile";
import RentArrearTile from "./_components/rent-arrear-tile";
import RevenueTile from "./_components/revenue-tile";
import WelcomeTile from "./_components/welcome-tile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RentalComplaints from "./_components/rental_complaints";
import PendingPayments from "./_components/pending_payments";

export default function ManageDashboard() {
  const session = useSession();

  return (
    <div className="container h-full py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Chào mừng, {getUserFullName(session.data!.user.user)}</CardTitle>
        </CardHeader>
        <CardContent>
          {
            session.data?.user.user.role === "LANDLORD" ? (
              <div className="grid grid-cols-1 xl:grid-cols-6 gap-8 p-4 md:p-6 lg:p-8">
                <div className="xl:col-span-4 grid grid-cols-6 gap-8">
                  <div className="xl:col-span-6">
                    <WelcomeTile sessionData={session.data!} />
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
                  <RevenueTile sessionData={session.data!} />
                </div>
                <div className="xl:col-span-3">
                  <RentArrearTile sessionData={session.data!} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-6 gap-4">
                  <CurrentRentals sessionData={session.data!} className="xl:col-span-2"/>
                  <RentalComplaints sessionData={session.data!} className="xl:col-span-2"/>
                  <PendingPayments sessionData={session.data!} className="xl:col-span-2"/>
                  <PlanTile sessionData={session.data!} className="xl:col-span-3"/>
                  <Expenditure sessionData={session.data!} className="xl:col-span-3"/>
              </div>
            )
          }
        </CardContent>
      </Card>
    </div>
  );
}
