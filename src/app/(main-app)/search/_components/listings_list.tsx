import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchResult } from "../page";
import ListingCard, { ListingCardSkeleton } from "./listing-card";

export type SearchListingItem = {
  listing: Partial<Listing>;
  property: Partial<Property>;
};

export default function ListingsList({
  searchResult,
} : {
  searchResult: SearchResult;
}) {
  const {count, items} = searchResult;
  const [listings, setListings] = useState<SearchListingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const ls = (await backendAPI.get<Partial<Listing>[]>('/api/listings/ids', {
          params: {
            listingIds: items.map(i => i.lid),
            fields: "priority,price,title,description,created_at,updated_at,creator_id,property_id",
          }
        })).data;
        const ps = (await backendAPI.get<Partial<Property>[]>('/api/properties/ids', {
          params: {
            propIds: ls.map(l => l.propertyId),
            fields: "area,city,district,ward,project,media",
          }
        })).data;
        setListings(ls.map(l => ({
          listing: l,
          property: ps.find(p => p.id === l.propertyId)!,
        })));
      } catch(err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchResult, items]);

  return (
    <div className="space-y-6">
      <p className="font-normal text-sm">Tìm thấy {count} nhà cho thuê</p>
      <div className="space-y-4">
        {loading ? (
          // 10 listing skeletons
          <>
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          </>
        ) : error ? (
          <div>{JSON.stringify(error)}</div>
        ) : listings.map((l, index) => (
          <Link key={index} href={`/listings/${l.listing.id}`}><ListingCard listing={l} /></Link>
        ))}
      </div>
    </div>
  );
};
