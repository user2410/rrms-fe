'use client';

import Loading from "@/components/ui/loading";
import { backendAPI } from "@/libs/axios";
import { Listing, ListingUnit } from "@/models/listing";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import * as _ from "lodash";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MainForm from "./_components/main_form";

export type ListingDetail = {
  listing: Listing; 
  property: Property; 
  units: Unit[];
};

export default function ApplicationPage({ params: {listingId} }: { params: { listingId: string } }) {
  const session = useSession();
  const router = useRouter();

  const [unitIds, setUnitIds] = useState<string[]>([]);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) {
      throw new Error("No search params");
    }
    const unitsQuery = searchParams.get('units');
    if (!unitsQuery) {
      throw new Error("Missing units param");
    }
    const uIds = unitsQuery.split(',');
    if (uIds.length === 0) {
      throw new Error("No units selected");
    }
    setUnitIds(uIds);
  }, [searchParams]);

  const query = useQuery<ListingDetail>({
    queryKey: ['application', 'listing', session.data?.user.user.id, listingId, unitIds],
    queryFn: async ({queryKey}) => {
      const userId = queryKey.at(2) as string;
      const listingId = queryKey.at(3) as string;
      const unitIds = queryKey.at(4) as string[];

      const listing = (await backendAPI.get<Listing>(`/api/listings/listing/${listingId}`)).data;
      if(_.intersection(listing.units.map((u) => u.unitId), unitIds).length < unitIds.length){
        throw new Error("Invalid unit id");
      }
      const property = (await backendAPI.get<Property>(`/api/properties/property/${listing.propertyId}`)).data;
      if(property.managers.map(m => m.managerId).includes(userId)){
        throw new Error("You are not authorized to apply for this listing");
      }      
      const units = (await backendAPI.get<Unit[]>('/api/units/ids', {
        params: {
          unitIds: unitIds,
          fields: "name,floor,area"
        }
      })).data;
      return {
        listing,
        property: property,
        units: units,
      };
    },
    enabled: session.status === "authenticated" && unitIds.length > 0,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return query.isLoading ? (
    <Loading />
  ) : query.isError ? (
    <div>Error {JSON.stringify(query.error)}</div>
  ) : (
    <MainForm 
      data={query.data!}
      sessionData={session.data!}
    />
  );
}
