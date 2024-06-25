"use client";

import PaginationControl from "@/components/complex/pagination";
import Spinner from "@/components/ui/spinner";
import { useFavListings } from "@/context/favorite_listings.context";
import { backendAPI } from "@/libs/axios";
import { Listing, ManagedListing } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ListingCard from "../search/_components/listing-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PAGESIZE = 10;

export default function FavoritePage() {
  const {favListings} = useFavListings();
  const [offset, setOffset] = useState(0);

  const displayedListings = favListings.slice(offset, offset + PAGESIZE);

  return (
    <div className="container h-full py-10 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tin đăng đã đánh dấu</CardTitle>
          <CardDescription>{favListings.length} đã đánh dấu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayedListings.length === 0 ? (
            <p className="text-center">Không có tin đăng nào</p>
          ) : (
            <>
              <ListingList ids={displayedListings} />
              <PaginationControl
                totalRecords={favListings.length}
                recordsPerPage={PAGESIZE}
                offset={offset}
                onPageChange={setOffset}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function ListingList({
  ids,
} : {
  ids: string[];
}) {
  const query = useQuery<ManagedListing[]>({
    queryKey: ["fav-listings", ids],
    queryFn: async ({queryKey}) => {
      const listings = (await backendAPI.get<Listing[]>('/api/listings/ids', {
        params: {
          listingIds: queryKey.at(1),
          fields: "priority,price,title,description,created_at,updated_at,creator_id,property_id,full_name,email,phone",
        }
      })).data;
      var properties = (await backendAPI.get<Property[]>('/api/properties/ids', {
        params: {
          propIds: [...new Set(listings.map(l => l.propertyId))],
          fields: "area,city,district,ward,type,primary_image,media",
        }
      })).data;
      const verificationStatus = (await backendAPI.get<{propertyId: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'}[]>("/api/properties/verification-status", {
        params: {
          ids: properties.map(p => p.id),
        }
      })).data;
      properties = properties.map(p => ({
        ...p,
        verificationStatus: verificationStatus.find(v => v.propertyId === p.id)?.status,
      }));
      return listings.map(l => ({
        listing: l,
        property: properties.find(p => p.id === l.propertyId)!,
      } as ManagedListing));
    }
  });

  if (query.isLoading || query.isError) {
    return <div className="flex flex-row justify-center">
      <Spinner size={32}/>
    </div>;
  }

  return (
    <div className="space-y-2 5">
      {query.data!.map(l => (
        <ListingCard item={l} key={l.listing.id}/>
      ))}
    </div>
  );
}