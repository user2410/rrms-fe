import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { SearchFormValues } from "../../_components/search_box";
import ListingCard, { ListingCardSkeleton } from "./listing-card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";


type SearchResult = {
  count: number;
  items: { lid: string; }[];
  limit: number;
  offset: number;
  sortby: string;
  order: 'asc' | 'desc';
};

export type SearchListingItem = {
  listing: Listing;
  property: Property;
};

export default function ListingsList({
  query,
  listingIds,
}: {
  query: SearchFormValues;
  listingIds: string[];
}) {
  const resultQuery = useQuery<SearchListingItem[]>({
    queryKey: ["search", "listing-list", JSON.stringify(query), listingIds.join(",")],
    queryFn: async ({ queryKey }) => {
      const lids = (queryKey.at(3) as string).split(",");
      const ls = (await backendAPI.get<Listing[]>('/api/listings/ids', {
        params: {
          listingIds: lids,
          fields: "priority,price,title,description,created_at,updated_at,creator_id,property_id",
        }
      })).data;
      const ps = (await backendAPI.get<Property[]>('/api/properties/ids', {
        params: {
          propIds: ls.map(l => l.propertyId),
          fields: "area,city,district,ward,project,media",
        }
      })).data;
      return ls.map(l => ({
        listing: l,
        property: ps.find(p => p.id === l.propertyId)!,
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });

  return resultQuery.isLoading ? (
    <div className="space-y-4">
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
    </div>
  ) : resultQuery.isError ? (
    <div>Error {JSON.stringify(resultQuery.error)}</div>
  ) : resultQuery.data!.map((l, index) => (
    <ListingCard key={index} listing={l} />
  ));
};


// useEffect(() => {
//   (async () => {
//     try {
//       setLoading(true);
//       const ls = (await backendAPI.get<Partial<Listing>[]>('/api/listings/ids', {
//         params: {
//           listingIds: items.slice(searchResult.offset, searchResult.offset + 10).map(i => i.lid),
//           fields: "priority,price,title,description,created_at,updated_at,creator_id,property_id",
//         }
//       })).data;
//       const ps = (await backendAPI.get<Partial<Property>[]>('/api/properties/ids', {
//         params: {
//           propIds: ls.map(l => l.propertyId),
//           fields: "area,city,district,ward,project,media",
//         }
//       })).data;
//       setListings(ls.map(l => ({
//         listing: l,
//         property: ps.find(p => p.id === l.propertyId)!,
//       })));
//     } catch(err) {
//       console.error(err);
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   })();
// }, [searchResult, items]);
