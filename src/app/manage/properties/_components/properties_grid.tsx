"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Property } from "@/models/property";
import { Fragment, useMemo, useState } from "react";
import { ManagedProperty } from "../page";
import PropertyCard from "./property_card";

// type PropertyTab = "active" | "archived" | "draft";
const pageSize = 6;

export default function PropertiesGrid({
  initialProperties
}: {
  initialProperties: ManagedProperty[];
}) {
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [offset, setOffset] = useState<number>(0);

  const properties = useMemo<ManagedProperty[]>(() => {
    console.log(offset, Math.ceil(initialProperties.length / pageSize));
    return initialProperties.
      sort((a, b) => {
        switch (sortBy) {
          case "createdAt":
            return order === "asc" 
              ? a.property.createdAt.getTime() - b.property.createdAt.getTime()
              : b.property.createdAt.getTime() - a.property.createdAt.getTime();
          case "area":
            return order === "asc"
              ? a.property.area - b.property.area
              : b.property.area - a.property.area;
          case "rentals":
            return order === "asc"
              ? a.rentals.length - b.rentals.length
              : b.rentals.length - a.rentals.length;
          case "name":
            return order === "asc"
              ? a.property.name.localeCompare(b.property.name)
              : b.property.name.localeCompare(a.property.name);
        }
        return 0;
      }).
      slice(offset, offset + pageSize);
  }, [initialProperties, offset, sortBy, order]);

  return (
    <Fragment>
      <div className="flex flex-row items-center justify-between w-full mb-4">
        <h2>Có {initialProperties.length} nhà cho thuê</h2>
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
                  <SelectItem value="createdAt">Mới nhất</SelectItem>
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
        {properties.map((p, i) => (
          <PropertyCard key={i} data={p}></PropertyCard>
        ))}
      </div>
      <div className="w-full flex flex-row justify-center">
        <Button type="button" variant="outline" disabled={offset === 0} onClick={() => setOffset(v => v - pageSize)}>Trước</Button>
        <Button type="button" variant="outline" disabled={offset + pageSize >= initialProperties.length} onClick={() => setOffset(v => v + pageSize)}>Sau</Button>
      </div>
    </Fragment>
  );
};
