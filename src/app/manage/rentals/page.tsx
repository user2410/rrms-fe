"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { Property } from "@/models/property";
import { Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Expired from "./_components/expired";
import NonExpired from "./_components/non-expired";

export type ManagedRental = {
  rental: Rental & { timeLeft: number };
  property: Property;
  unit: Unit;
}

export default function ManagedRentalsPage() {
  const router = useRouter();
  const session = useSession();

  return (
    <div className="container h-full py-10">
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-2xl lg:text-3xl font-light">Quản lý thuê</h1>
          {session.data?.user.user.role === "LANDLORD" && (
            <Button type="button" variant="default" onClick={() => router.push('/manage/rentals/new')}>Thêm người thuê mới</Button>
          )}
        </div>
        {session.status !== "authenticated"
        ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner size={32} />
          </div>
        ) : (
          <div className="space-y-4">
            <NonExpired 
              sessionData={session.data}
              segment={session.data.user.user.role === "LANDLORD" ? "managed-rentals" : "my-rentals"}
              />
            <Expired 
              sessionData={session.data}
              segment={session.data.user.user.role === "LANDLORD" ? "managed-rentals" : "my-rentals"}
            />
          </div>
        )}
      </div>
    </div>
  );
};
