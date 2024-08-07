import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendAPI } from "@/libs/axios";
import { Listing, ManagedListing } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import ListingItem, { ListingItemSkeleton } from "./listing_item";

export default function RecommendedListings({
  listingId,
} : {
  listingId: string;
}) {
  const query = useQuery<ManagedListing[]>({
    queryKey: ["listings", listingId, "recommended"],
    queryFn: async ({queryKey}) => {
      const recommendation = (await backendAPI.get(`/api/landing/suggest/listings/listing/${queryKey.at(1)}`, {
        params: {
          limit: 5,
        },
      })).data.hits;
      if (recommendation.length === 0) {
        return [];
      }
      const listings = (await backendAPI.get("/api/listings/ids", {
        params: {
          listingIds: recommendation.map((l: any) => l.id),
          fields: "title,property_id,price,created_at,updated_at,creator_id,priority",
        },
      })).data;
      const properties = (await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          propIds: [...new Set(listings.map((l: any) => l.propertyId))],
          fields: "area,full_address,city,district,ward,type,primary_image,media",
        },
      })).data;
      const verificationStatus = (await backendAPI.get<{propertyId: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'}[]>("/api/properties/verification-status", {
        params: {
          ids: properties.map(p => p.id),
        }
      })).data;
      return listings.sort((a: Listing, b: Listing) => (
        // sort listings by priority in descending order
        b.priority - a.priority
      )).map((l: any) => {
        const property = properties.find(p => p.id === l.propertyId)!;
        return ({
          listing: l,
          property: { ...property, verificationStatus: verificationStatus.find(v => v.propertyId === property.id)?.status },
        }) as ManagedListing;
      });
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          Tin đăng tương tự
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-none m-0 p-0">
          {(query.isLoading || query.isError) ? (
            Array.from({ length: 2 }).map((_, index) => (
              <Fragment key={index}>
                {ListingItemSkeleton}
              </Fragment>
            ))
          ) : (
            query.data.map((item, index) => (
              <ListingItem
                key={index}
                item={item as ManagedListing}
                className={index === 0 ? '' : 'border-t'}
              />
            ))
          ) }
        </ul>
      </CardContent>
    </Card>
  );
};
