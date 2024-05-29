import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchResult } from "@/models/listing";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon } from "lucide-react";
import ListingCard, { ListingCardSkeleton } from "./listing-card";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationControl from "@/components/complex/pagination";

const EmptyState = (
  <div className="w-full flex flex-row justify-center items-center text-muted-foreground">
    <SearchIcon className="w-32 h-32" />
    <p>Không tìm thấy kết quả phù hợp</p>
  </div>
);

export default function ListingsSection({
  r,
  sortby,
  setSortBy,
  order,
  setOrder,
  limit,
  setLimit,
  offset,
  setOffset,
}: {
  r: SearchResult;
  sortby: string;
  order: "asc" | "desc";
  limit: number;
  offset: number;
  setSortBy: (v: string) => void;
  setOrder: (v: "asc" | "desc") => void;
  setLimit: (v: number) => void;
  setOffset: (v: number) => void;
}) {
  return (
    <Card>
      {r.count > 0 ? (
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl">Tổng {r.count} kết quả</CardTitle>
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row items-center gap-1">
              <span className="text-sm font-light whitespace-nowrap">Sắp xếp theo</span>
              <Select
                value={sortby}
                onValueChange={(v) => setSortBy(v)}
                defaultValue="createdAt">
                <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 bg-transparent gap-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="created_at">Mới nhất</SelectItem>
                    {/* <SelectItem value="views">Số lượt xem</SelectItem> */}
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
        </CardHeader>
      ) : (
        <CardHeader/>
      )}
      <CardContent className="space-y-4">
        {r.count === 0 ? (
          EmptyState
        ) : (
          r.items.map((item, index) => (
            <ListingCard
              key={index}
              item={{
                listing: item.listing!,
                property: item.property!,
                units: item.units!,
              }}
            />
          ))
        )}
      </CardContent>
      <CardFooter>
        <PaginationControl
          totalRecords={r.count}
          recordsPerPage={limit}
          offset={offset}
          onPageChange={setOffset}
        />
      </CardFooter>
    </Card>
  );
};

export const ListingSectionLoadingState = (
  <Card>
    <CardHeader className="flex flex-row justify-between items-center">
      <Skeleton className="w-48 h-8" />
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row items-center gap-1">
          <span className="text-sm font-light whitespace-nowrap">Sắp xếp theo</span>
          <Select
            value="created_at"
            defaultValue="created_at">
            <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 bg-transparent gap-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="created_at">Mới nhất</SelectItem>
                {/* <SelectItem value="views">Số lượt xem</SelectItem> */}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row items-center gap-1">
          <span className="text-sm font-light whitespace-nowrap">Thứ tự</span>
          <Select
            value="asc"
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
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </CardContent>
  </Card>
);
