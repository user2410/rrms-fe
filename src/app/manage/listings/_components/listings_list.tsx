import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fragment } from "react";
import { ManagedListing } from "../page";
import ListingItem from "./listing_item";
import TopSearchbar from "./top_searchbar";
import { Button } from "@/components/ui/button";

export default function ListingsList({
  initialListings,
}: {
  initialListings: ManagedListing[];
}) {
  return (
    <Fragment>
      <TopSearchbar />
      <div className="flex flex-row justify-between w-full">
        <h2>Hiển thị {initialListings.length} tin đăng</h2>
        <div className="flex flex-row items-center gap-2">
          <span className="text-sm font-light whitespace-nowrap">Sắp xếp theo</span>
          <Select defaultValue="name">
            <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 bg-transparent gap-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Tiêu đề</SelectItem>
                <SelectItem value="createdAt">Thời gian tạo</SelectItem>
                <SelectItem value="updatedAt">Thời gian cập nhật</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-4">
        {initialListings.map((l, i) => (
          <ListingItem key={i} listing={l.listing} property={l.property} units={l.units}/>
        ))}
      </div>
      <div className="w-full flex flex-row justify-center">
        <Button variant="outline">Xem thêm</Button>
      </div>
    </Fragment>
  );
};
