"use client";

import { Button } from "@/components/ui/button";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ListingsList from "./_components/listings_list";
import { Unit } from "@/models/unit";

export type ManagedListing = {
  listing: Listing;
  property: Property;
  units: Unit[];
}

export default function ManageListingsPage() {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="container h-full py-10">
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-2xl lg:text-3xl font-light">Tin đăng của bạn</h1>
          <Button type="button" variant="default" onClick={() => router.push('/manage/listings/new')}>Tạo tin đăng mới</Button>
        </div>
        {session.status === "authenticated" && (
          <ListingsList sessionData={session.data!} />
        )}
      </div>
    </div>
  );
};
