import { useQuery } from "@tanstack/react-query";
import { SearchResult } from "../page";
import { SearchFormValues } from "../../_components/search_box";
import { backendAPI } from "@/libs/axios";
import { ListingCardSkeleton } from "./listing-card";
import { useState } from "react";
import ListingsList from "./listings_list";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function Search({
  query,
}: {
  query: SearchFormValues;
}) {
  const [pageSize, setPageSize] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);

  const resultQuery = useQuery<SearchResult>({
    queryKey: ["search", JSON.stringify(query)],
    queryFn: async ({ queryKey }) => {
      const q = JSON.parse(queryKey.at(1) as string) as SearchFormValues;
      const sr = (await backendAPI.get<SearchResult>("/api/listings/", {
        params: {
          ...q,
          ptypes: q.ptypes ? q.ptypes.join(",") : undefined,
          pfeatures: q.pfeatures ? q.pfeatures.join(",") : undefined,
          uamenities: q.uamenities ? q.uamenities.join(",") : undefined,
          limit: 1000,
          _r: new Date().getTime(), // prevent cache
        },
      })).data;
      return sr;
    },
    staleTime: 1000 * 60, // 1 minute
    cacheTime: 1000 * 60, // 1 minute
  });

  return (
    <div className="space-y-6">
      <p className="font-normal text-sm">
        {resultQuery.isLoading ? (
          "Đang tìm kiếm..."
        ) : resultQuery.isError ? (
          "Có lỗi xảy ra"
        ) : (
          resultQuery.data.count > 0 ? `Tìm thấy ${resultQuery.data.count} nhà cho thuê` : "Không tìm thấy kết quả nào"
        )}
      </p>
      {resultQuery.isLoading || resultQuery.isError ? (
        <></>
      ) : (resultQuery.data.count > 0 && (
        <div className="space-y-6">
          <ListingsList
            query={query}
            listingIds={
              resultQuery.data.items
              .map(i => i.lid)
              .slice(offset, offset + pageSize)
            }
          />
          <Pagination className="w-full flex flex-row justify-center">
            <PaginationContent>
              <PaginationItem 
                onClick={() => {
                  if(offset >= pageSize) {
                    setOffset(v => v - pageSize);
                  }
                }}
              >
                <PaginationPrevious isActive={offset > pageSize} href="#">Trước</PaginationPrevious>
              </PaginationItem>
              {Array.from({length: resultQuery.data.count/pageSize}, (_, i) => i + 1).map((i) => (
                <PaginationItem 
                  key={i} 
                  onClick={() => setOffset(v => (i-1) * pageSize)}
                >
                  <PaginationLink 
                    href="#" 
                    isActive={(i-1) === offset/pageSize}
                  >
                    {i}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem
                onClick={() => {
                  if(offset < resultQuery.data.count - pageSize) {
                    setOffset(v => offset + pageSize);
                  }
                }}
              >
                <PaginationNext isActive={offset > pageSize} href="#">Sau</PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ))}
    </div>
  );
};
