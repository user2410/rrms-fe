"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { Property, PropertyMedia } from "@/models/property";
import { Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { Fragment, useState } from "react";
import { ManagedProperty } from "../page";
import PropertyCard from "./property_card";

// type PropertyTab = "active" | "archived" | "draft";
const pageSize = 6;

type Data = {
  items: ManagedProperty[];
  total: number;
}

export default function PropertiesGrid({
  sessionData,
}: {
  sessionData: Session;
}) {
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [offset, setOffset] = useState<number>(0);


  const query = useQuery<Data>({
    queryKey: ['manage', 'properties', 'managed', pageSize, offset, sortBy, order, sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const res = (await backendAPI.get<Data>("api/properties/managed-properties", {
        params: {
          fields: "name,full_address,city,district,ward,area,orientation,lat,lng,media,type,primary_image,created_at",
          limit: queryKey.at(3),
          offset: queryKey.at(4),
          sortBy: queryKey.at(5),
          order: queryKey.at(6),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ([]);
      return {
        ...res,
        items: res.items.map((item: ManagedProperty) => ({
          ...item,
          property: {
            ...item.property,
            units: item.property.units || ([] as Unit[]),
            media: item.property.media || ([] as PropertyMedia[])
          },
          listings: item.listings || ([] as Listing[]),
          rentals: item.rentals || ([] as Rental[]),
        })),
      } as Data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
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
      <div className="flex flex-row items-center justify-between w-full mb-4">
        <h2>Có {query.data.total} nhà cho thuê</h2>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row items-center gap-1">
            <span className="text-sm font-light whitespace-nowrap">Sắp xếp theo</span>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as keyof Property)}
              defaultValue="createdAt">
              <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 bg-transparent gap-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="name">Tên</SelectItem>
                  <SelectItem value="area">Diện tích</SelectItem>
                  <SelectItem value="created_at">Mới nhất</SelectItem>
                  <SelectItem value="rentals">Số lượt thuê</SelectItem>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {query.data.items.map((p, i) => (
          <PropertyCard key={i} data={p}></PropertyCard>
        ))}
      </div>
      <div className="w-full flex flex-row justify-center">
        <Button type="button" variant="outline" disabled={offset === 0} onClick={() => setOffset(v => v - pageSize)}>Trước</Button>
        <Button type="button" variant="outline" disabled={offset + pageSize >= query.data.total} onClick={() => setOffset(v => v + pageSize)}>Sau</Button>
      </div>
    </Fragment>
  );
};
