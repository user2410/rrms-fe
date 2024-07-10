"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { backendAPI } from "@/libs/axios";
import { GeolocationDB } from "@/models/dghcvn";
import { Listing, SearchResult } from "@/models/listing";
import { getPrimaryImage, getPropertyFullAddress, Property } from "@/models/property";
import { ToMillion } from "@/utils/currency";
import { getLowerCityName } from "@/utils/dghcvn";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { getCurrentLocation } from "../../_action/get_location";

function ListingCard({ item }: { item: ReturnedListing }) {
  const { listing, property } = item;

  return (
    <Link href={`listings/${listing.id}`}>
      <Card className="rounded-md w-full p-0">
        <CardHeader className="block relative w-full p-0 aspect-video">
          <Image
            src={getPrimaryImage(property)}
            alt={listing.title}
            fill
            className="object-cover" />
        </CardHeader>
        <CardContent className="p-3">
          <h3 className="truncate">{listing.title}</h3>
          <h4 className="text-red-600">{ToMillion(listing.price)}/tháng - {property.area}m<sup>2</sup></h4>
          <h5 className="text-gray-500 space-x-2">
            <i className="fas fa-location-dot" />
            <span>{getPropertyFullAddress(property)}</span>
          </h5>
        </CardContent>
      </Card>
    </Link>
  );
}

function ListingCardSkeleton() {
  return (
    <Card className="rounded-md w-full p-0">
      <Skeleton className="block w-full p-0 aspect-video" />
      <CardContent className="p-3 space-y-2">
        <Skeleton className="w-9/12 h-4" />
        <Skeleton className="w-9/12 h-4" />
        <h5 className="text-gray-500 space-x-2">
          <i className="fas fa-location-dot" />
          <Skeleton className="w-6/12 h-4" />
        </h5>
      </CardContent>
    </Card>
  );
}

type ReturnedListing = {
  listing: Listing;
  property: Property;
};

type Data = {
  geolocation: GeolocationDB;
  listings: ReturnedListing[];
};

export default function ListingInplace() {
  const query = useQuery<Data>({
    queryKey: ['landing', "listings-inplace"],
    queryFn: async () => {
      const geolocation = await getCurrentLocation();
      const searchListings = (await backendAPI.get<SearchResult>(`/api/listings/search`, {
        params: {
          pcity: geolocation.city?.code || "HN",
          limit: 8,
          _r: new Date().getTime(), // prevent cache
        },
      })).data;
      const listings = (await backendAPI.get<Listing[]>("/api/listings/ids", {
        params: {
          fields: "property_id,price,title",
          listingIds: searchListings.items.map(i => i.lid),
        },
      })).data;
      const properties = (await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          fields: "city,district,ward,full_address,area,primary_image,media,created_at",
          propIds: listings.map(l => l.propertyId),
        },
      })).data;
      return ({
        geolocation,
        listings: listings.map(item => ({
          listing: item,
          property: properties.find(p => p.id === item.propertyId),
        })),
      }) as Data;
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Tin đăng {query.isSuccess ? ` tại ${query.data.geolocation.city?.name}` : "dành cho bạn"}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7">
        {query.isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <ListingCardSkeleton key={index} />
          ))
        ) : query.isSuccess && (
          query.data.listings.map((item, index) => (
            <ListingCard key={index} item={item} />
          ))
        )}
      </div>
      <div className="text-center">
        <Button  >Xem thêm</Button>
      </div>
    </div>
  );
};
