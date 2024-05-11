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
  const [sortBy, setSortBy] = useState<keyof Property>("createdAt");
  const [offset, setOffset] = useState<number>(0);

  const properties = useMemo<ManagedProperty[]>(() => {
    console.log(offset, Math.ceil(initialProperties.length/pageSize));
    return initialProperties.
      sort((a, b) => {
        if (sortBy === "name") {
          return a.property.name.localeCompare(b.property.name);
        }
        if (sortBy === "createdAt") {
          return b.property.createdAt.getTime() - a.property.createdAt.getTime();
        }
        if (sortBy === "area") {
          return b.property.area - a.property.area;
        }
        return 0;
      }).
      slice(offset, offset + pageSize);
  }, [initialProperties, offset, sortBy]);

  return (
    <Fragment>
      <div className="flex flex-row justify-between w-full">
        <h2>Có {initialProperties.length} nhà cho thuê</h2>
        <div className="flex flex-row items-center gap-2">
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
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {properties.map((p, i) => (
          <PropertyCard key={i} property={p.property}></PropertyCard>
        ))}
      </div>
      <div className="w-full flex flex-row justify-center">
        <Button type="button" variant="outline" disabled={offset === 0} onClick={() => setOffset(v => v- pageSize)}>Trước</Button>
        <Button type="button" variant="outline" disabled={offset+pageSize >= initialProperties.length} onClick={() => setOffset(v => v + pageSize)}>Sau</Button>

      </div>
    </Fragment>
  );
};
