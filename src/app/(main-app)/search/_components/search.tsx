import { backendAPI } from "@/libs/axios";
import { Listing, SearchResult } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SearchFormValues } from "../../_components/search_box";
import Header from "./header";
import ListingsSection, { ListingSectionLoadingState } from "./listings_section";
import Sidebar from "./sidebar/sidebar";
import TopSearchBar from "./top-searchbar";

export default function SearchPage({ query }: { query: SearchFormValues }) {
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [sortby, setSortby] = useState<string>("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // fetching listings
  const _query = useQuery<SearchResult>({
    queryKey: ["search", limit, offset, sortby, order, query],
    queryFn: async ({ queryKey }) => {
      const q = queryKey.at(-1) as SearchFormValues;
      const r = (await backendAPI.get<SearchResult>("/api/listings/search", {
        params: {
          ...q,
          limit: queryKey.at(1),
          offset: queryKey.at(2),
          sortby: [queryKey.at(3)],
          order: [queryKey.at(4)],
          _r: new Date().getTime(),
        },
      })).data;
      r.items = r.items ?? [];
      let listings: Listing[] = [];
      let properties: Property[] = [];
      if (r.items.length > 0) {
        listings = (await backendAPI.get<Listing[]>('/api/listings/ids', {
          params: {
            listingIds: [...new Set(r.items.map(i => i.lid))],
            fields: "priority,price,title,description,created_at,updated_at,creator_id,property_id,full_name,email,phone",
          }
        })).data;
        properties = (await backendAPI.get<Property[]>('/api/properties/ids', {
          params: {
            propIds: [...new Set(listings.map(l => l.propertyId))],
            fields: "area,city,district,ward,type,primary_image,media",
          }
        })).data;
      }
      return ({
        ...r,
        items: r.items.map(i => ({
          lid: i.lid,
          listing: listings.find(l => l.id === i.lid)!,
          property: properties.find(p => p.id === listings.find(l => l.id === i.lid)!.propertyId)!,
        })),
      }) as SearchResult;
    },
  });

  return (
    <div>
      <TopSearchBar defaultValues={query} />
      <div className="container space-y-4">
        <div className="py-4">
          <Header query={query} />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8 space-y-4">
            {_query.isLoading ? (
              ListingSectionLoadingState
            ) : _query.isError ? (
              ListingSectionLoadingState
            ) : (
              <ListingsSection
                r={_query.data}
                order={order}
                sortby={sortby}
                limit={limit}
                offset={offset}
                setOrder={setOrder}
                setSortBy={setSortby}
                setLimit={setLimit}
                setOffset={setOffset}
              />
            )}
          </div>
          <div className="hidden md:block md:col-span-4">
            <Sidebar query={query} />
          </div>
        </div>
      </div>
    </div>
  );
}

// const _query = useQuery<SearchResult>({
//   queryKey: ["search", limit, offset, sortby, order, query],
//   queryFn: async ({ queryKey }) => {
//     const q = queryKey.at(-1) as SearchFormValues;
//     const r = (await backendAPI.get<SearchResult>("/api/listings/", {
//       params: {
//         ...q,
//         limit: queryKey.at(1),
//         offset: queryKey.at(2),
//         sortby: [queryKey.at(3)],
//         order: [queryKey.at(4)],
//         _r: new Date().getTime(),
//       },
//     })).data;
//     const listings = (await backendAPI.get<Listing[]>('/api/listings/ids', {
//       params: {
//         listingIds: [...new Set(r.items.map(i => i.lid))],
//         fields: "priority,price,title,description,created_at,updated_at,creator_id,property_id",
//       }
//     })).data;
//     const properties = (await backendAPI.get<Property[]>('/api/properties/ids', {
//       params: {
//         propIds: [...new Set(listings.map(l => l.propertyId))],
//         fields: "area,city,district,ward,project,media",
//       }
//     })).data;
//     return ({
//       ...r,
//       items: listings.map(l => ({
//         lid: l.id,
//         listing: l,
//         property: properties.find(p => p.id === l.propertyId)!,
//       })),
//     });
//   },
// });

      // await wait(1000);
      // return ({
      //   count: 12000,
      //   limit: queryKey.at(1),
      //   offset: queryKey.at(2),
      //   sortby: queryKey.at(3),
      //   order: queryKey.at(4),
      //   items: [
      //     {
      //       lid: mockupListings[0].id,
      //       listing: mockupListings[0],
      //       property: mockupProperties[0],
      //     },
      //     {
      //       lid: mockupListings[0].id,
      //       listing: mockupListings[0],
      //       property: mockupProperties[0],
      //     },
      //     {
      //       lid: mockupListings[1].id,
      //       listing: mockupListings[1],
      //       property: mockupProperties[1],
      //     },
      //     {
      //       lid: mockupListings[2].id,
      //       listing: mockupListings[2],
      //       property: mockupProperties[2],
      //     },
      //   ],
      // }) as SearchResult;
