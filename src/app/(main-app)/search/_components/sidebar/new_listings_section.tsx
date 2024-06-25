import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendAPI } from "@/libs/axios";
import { Listing, ManagedListing } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import ListingItem, { ListingItemSkeleton } from "./listing_item";

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
      const verificationStatus = (await backendAPI.get<{ propertyId: string; status: 'PENDING' | 'APPROVED' | 'REJECTED' }[]>("/api/properties/verification-status", {
        params: {
          ids: properties.map(p => p.id),
        }
      })).data;
      return listings.map(l => {
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
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
