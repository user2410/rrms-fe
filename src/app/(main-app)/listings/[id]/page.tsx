"use client";

import { Listing, ListingUnit } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";

import { backendAPI } from "@/libs/axios";
import { Unit } from "@/models/unit";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ListingContent from "./_components/listing_content";

export type ListingDetail = {
  listing: Listing;
  property: Property;
  units: Unit[];
};

export default function ListingPage({ params }: { params: { id: string } }) {
  const detailListingQuery = useQuery<ListingDetail>({
    queryKey: ['listings', 'listing', 'detail-view', params.id],
    queryFn: async ({queryKey}) => {
      const listingQuery = await backendAPI.get(`/api/listings/listing/${queryKey.at(3)}`);
      const listing = listingQuery.data;
      const propertyQuery = await backendAPI.get(`/api/properties/property/${listing.propertyId}`);
      const unitsQuery = await backendAPI.get("/api/units/ids", {
        params: {
          unitIds: [...new Set(listing.units.map((lu: ListingUnit) => lu.unitId))],
          fields: "name,property_id,area,floor,number_of_living_rooms,number_of_bedrooms,number_of_bathrooms,number_of_toilets,number_of_balconies,number_of_kitchens,type,created_at,updated_at,amenities,media"
        }
      });
      const data = {
        listing,
        property : propertyQuery.data,
        units : unitsQuery.data,
      };
      console.log(data);
      return data;
    },
    retry: 1,
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 60 * 60 * 1000, // 1 hour
  });

  const data = detailListingQuery.data;

  if (detailListingQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (detailListingQuery.isError) {
    return <div>Error {JSON.stringify(detailListingQuery.error)}</div>;
  }

  return (
    <div className="container my-4">
      <ListingContent
        listing={data!.listing}
        property={data!.property}
        units={data!.units}
        preview={false}
      />
    </div>
  );
}
