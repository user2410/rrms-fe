"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ListingsList from "./_components/listings_list";

export type ManagedListing = {
  listing: Listing;
  property: Property;
}

export default function ManageListingsPage() {
  const session = useSession();
  const router = useRouter();

  const query = useQuery({
    queryKey: ['manage', 'listings'],
    queryFn: async () => {
      const managedListings: ManagedListing[] = [];
        const listingsQuery = await backendAPI.get("api/listings/my-listings", {
          params: {
            fields: "property_id,title,price,active,created_at,updated_at,post_at,expired_at",
          },
          headers: {
            Authorization: `Bearer ${session.data?.user.accessToken}`,
          },
        });
        for (const listing of listingsQuery.data) {
          const propertyQuery = await backendAPI.get(`api/properties/property/${listing.propertyId}`, {
            headers: {
              Authorization: `Bearer ${session.data?.user.accessToken}`,
            },
          });
          managedListings.push({
            listing: listing,
            property: propertyQuery.data,
          });
        }
      return managedListings;
    },
    enabled: session.status === 'authenticated',
    staleTime: 1 * 60 * 1000,
    cacheTime: 1 * 60 * 1000,
  });

  return (
    <div className="container h-full py-10">
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-2xl lg:text-3xl font-light">Tin đăng của bạn</h1>
          <Button type="button" variant="default" onClick={() => router.push('/manage/listings/new')}>Tạo tin đăng mới</Button>
        </div>
        {query.isLoading
          ? (
            <div className="w-full h-full flex justify-center items-center">
              <Spinner size={32}/>
            </div>
          ) : query.isError ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-red-500">Error: {JSON.stringify(query.error)}</p>
            </div>
          ) : (
            <ListingsList initialListings={query.data} />
          ) }
      </div>
    </div>
  );
};
