"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Gallery from "./_components/gallery";

import { backendAPI } from "@/libs/axios";
import { GetCityById, GetDistrictById } from "@/utils/dghcvn";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ContactForm from "./_components/contact";
import ListingDetails from "./_components/details";
import ListingsForyou from "./_components/for_you";
import GeneralInfo from "./_components/general-info";
import MapNNearby from "./_components/map_nearby";
import PostedBy from "./_components/posted-by";
import RentalPolicies from "./_components/rental_policies";
import Tags from "./_components/tags";
import { Unit } from "@/models/unit";
import UnitsList from "./_components/units";
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
      const unitsQuery = await backendAPI.get(`/api/properties/property/${listing.propertyId}/units`);
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
      />
    </div>
  );
}
