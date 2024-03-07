"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fragment } from "react";
import { ManagedProperty } from "../page";
import PropertyCard from "./property_card";

// type PropertyTab = "active" | "archived" | "draft";

export default function PropertiesGrid({
  initialProperties
}: {
  initialProperties: ManagedProperty[];
}) {
  return (
    <Fragment>
      <div className="flex flex-row justify-between w-full">
        <h2>Hiển thị {initialProperties.length} nhà cho thuê</h2>
        <div className="flex flex-row items-center gap-2">
          <span className="text-sm font-light whitespace-nowrap">Sắp xếp theo</span>
          <Select defaultValue="name">
            <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 bg-transparent gap-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Tên</SelectItem>
                <SelectItem value="createdAt">Thời gian tạo</SelectItem>
                <SelectItem value="updatedAt">Thời gian cập nhật</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {initialProperties.map((p, i) => (
          <PropertyCard key={i} property={p.property}></PropertyCard>
        ))}
      </div>
      <div className="w-full flex flex-row justify-center">
        <Button variant="outline">Xem thêm</Button>
      </div>
    </Fragment>
  );
};
