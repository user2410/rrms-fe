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
import { Unit } from "@/models/unit";

export type ManagedListing = {
  listing: Listing;
  property: Property;
  units: Unit[];
}

export default function ManageListingsPage() {
  const session = useSession();
  const router = useRouter();

  const query = useQuery<ManagedListing[]>({
    queryKey: ['manage', 'listings'],
    queryFn: async () => {
      const listings = (await backendAPI.get<Listing[]>("api/listings/my-listings", {
        params: {
          fields: "property_id,units,title,price,active,created_at,updated_at,expired_at",
        },
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`,
        },
      })).data || ([]);
      const properties = (await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          fields: "name,city,district,ward,full_address,area,type,media,primary_image",
          propIds: listings.map((listing: Listing) => listing.propertyId),
        },
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`,
        }
      })).data || ([]);
      console.log('unitIds:',listings.map((listing: Listing) => listing.units.map((unit) => unit.unitId)).flat());
      const units = (await backendAPI.get<Unit[]>("/api/units/ids", {
        params: {
          fields: "name,area,number_of_bedrooms,number_of_bathrooms,number_of_toilets",
          unitIds: listings.map((listing: Listing) => listing.units.map((unit) => unit.unitId)).flat(),
        },
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`,
        }
      })).data || ([]);

      return listings.map((listing: Listing) => ({
        listing: {
          ...listing,
          createdAt: new Date(listing.createdAt),
          updatedAt: new Date(listing.updatedAt),
          expiredAt: new Date(listing.expiredAt),
        },
        property: properties.find((prop: Property) => prop.id === listing.propertyId)!,
        units: units.filter((unit: Unit) => listing.units.find((u) => u.unitId === unit.id)),
      }));;
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
              <Spinner size={32} />
            </div>
          ) : query.isError ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-red-500">Error: {JSON.stringify(query.error)}</p>
            </div>
          ) : (
            <ListingsList initialListings={query.data} />
          )}
      </div>
    </div>
  );
};
