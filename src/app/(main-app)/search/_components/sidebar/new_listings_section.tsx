import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Listing, ManagedListing, mockupListings } from "@/models/listing";
import { mockupProperties, Property } from "@/models/property";
import wait from "@/utils/wait-fn";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import ListingItem, { ListingItemSkeleton } from "./listing_item";
import { backendAPI } from "@/libs/axios";

export default function NewListingsSection() {
  const query = useQuery<ManagedListing[]>({
    queryKey: ["search", "new-listings"],
    queryFn: async () => {
      const listings = (await backendAPI.get<Listing[]>("/api/landing/recent", {
        params: {
          fields: "title,property_id,price,created_at,updated_at,creator_id,priority",
          limit: 7,
        },
      })).data;
      const properties = (await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          propIds: [...new Set(listings.map(l => l.propertyId))],
          fields: "area,city,district,ward,type,primary_image,media",
        },
      })).data;
      return listings.map(l => ({
        listing: l,
        property: properties.find(p => p.id === l.propertyId)!,
      }) as ManagedListing);
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          Tin mới đăng
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
