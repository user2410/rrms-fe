import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { Fragment, useState } from "react";
import { ManagedListing } from "../page";
import ListingItem from "./listing_item";

type Data = {
  count: number;
  items: ManagedListing[];
}

const pageSize = 6;

export default function ListingsList({
  sessionData,
}: {
  sessionData: Session;
}) {
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [offset, setOffset] = useState<number>(0);

  const query = useQuery<Data>({
    queryKey: ['manage', 'listings', 'managed', pageSize, offset, sortBy, order, sessionData?.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const params = {
        fields: "property_id,units,title,price,active,priority,created_at,updated_at,expired_at",
        limit: queryKey.at(3),
        offset: queryKey.at(4),
        sortBy: queryKey.at(5),
        order: queryKey.at(6),
      };
      const res = (await backendAPI.get("api/listings/managed-listings", {
        params,
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ([]);
      const properties = (await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          fields: "name,city,district,ward,full_address,area,type,media,primary_image",
          propIds: [...new Set(res.items.map((listing: Listing) => listing.propertyId))],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);
      const units = (await backendAPI.get<Unit[]>("/api/units/ids", {
        params: {
          fields: "name,area,number_of_bedrooms,number_of_bathrooms,number_of_toilets",
          unitIds: [...new Set(res.items.map((listing: Listing) => listing.units.map((unit) => unit.unitId)).flat())],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);

      return {
        ...res,
        items: res.items.map((listing: Listing) => ({
          listing: {
            ...listing,
            createdAt: new Date(listing.createdAt),
            updatedAt: new Date(listing.updatedAt),
            expiredAt: new Date(listing.expiredAt),
          },
          property: properties.find((p) => p.id === listing.propertyId) || ({} as Property),
          units: units.filter((u) => listing.units.map((unit) => unit.unitId).includes(u.id)),
        } as ManagedListing)),
      } as Data;
    },
    staleTime: 1 * 60 * 1000,
    cacheTime: 1 * 60 * 1000,
  });

  return query.isLoading ? (
    <div className="flex flex-row justify-center items-center w-full h-full">
      <Spinner size={32} />
    </div>
  ) : query.isError ? (
    <div className="flex flex-row justify-center items-center w-full h-full">
      Đã có lỗi xảy ra
    </div>
  ) : (
    <Fragment>
      <div className="flex flex-row justify-between w-full">
        <h2>Có {query.data.count} tin đăng</h2>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row items-center gap-1">
            <span className="text-sm font-light whitespace-nowrap">Sắp xếp theo</span>
            <Select 
              defaultValue={sortBy}
              onValueChange={(v) => setSortBy(v as string)}
            >
              <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 bg-transparent gap-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="title">Tiêu đề</SelectItem>
                  <SelectItem value="created_at">Mới nhất</SelectItem>
                  <SelectItem value="price">Giá</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row items-center gap-1">
            <span className="text-sm font-light whitespace-nowrap">Thứ tự</span>
            <Select
              value={order}
              onValueChange={(v) => setOrder(v as "asc" | "desc")}
              defaultValue="asc">
              <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 bg-transparent gap-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="asc">Tăng dần</SelectItem>
                  <SelectItem value="desc">Giảm dần</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {query.data.items.map((l, i) => (
          <ListingItem key={i} listing={l.listing} property={l.property} units={l.units} />
        ))}
      </div>
      <div className="w-full flex flex-row justify-center">
        <Button type="button" variant="outline" disabled={offset === 0} onClick={() => setOffset(v => v - pageSize)}>Trước</Button>
        <Button type="button" variant="outline" disabled={offset + pageSize >= query.data.count} onClick={() => setOffset(v => v + pageSize)}>Sau</Button>
      </div>
    </Fragment>
  );
};
