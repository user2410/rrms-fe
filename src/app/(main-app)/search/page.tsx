"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { backendAPI } from "@/libs/axios";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SearchFormValues } from "../_components/landing-page/search_box";
import Sidebar from "./_components/sidebard";
import TopSearchBar from "./_components/top-searchbar";
import { GetCityById, GetDistrictById, GetLocationName, GetWardById } from "@/utils/dghcvn";
import ListingsList from "./_components/listings_list";

export type SearchResult = {
  count: number;
  items: {lid: string;}[];
  limit: number;
  offset: number;
  sortby: string;
  order: 'asc' | 'desc';
};

export default function SearchPage() {
  const searchParams = useSearchParams();

  const [data, setData] = useState<SearchResult>({} as SearchResult);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  // extract query to SearchFormValue
  const query = useMemo<SearchFormValues>(() => {
    const q: any = {};

    if (!searchParams) return q;
    for (const [key, value] of searchParams.entries()) {
      switch (key) {
        case "ptypes":
          if (!q.ptypes) {
            q.ptypes = [];
          }
          q.ptypes.push(value);
          break;
        case "pfeatures":
          if (!q.pfeatures) {
            q.pfeatures = [];
          }
          q.pfeatures.push(value);
          break;
        case "uamenities":
          if (!q.uamenities) {
            q.uamenities = [];
          }
          q.uamenities.push(value);
          break;
        case "limit":
          q.limit = parseInt(value);
          break;
        case "offset":
          q.offset = parseInt(value);
          break;
        case "sortby": 
          q.sortby = value;
          break;
        case "order":
          q.order = value;
          break;
        default:
          // @ts-ignore
          q[key as keyof SearchFormValues] = value;
      }
    }

    (async () => {
      try {
        setLoading(true);
        const r = await backendAPI.get<SearchResult>("/api/listings/", {
          params: {
            ...q,
            ptypes: q.ptypes ? q.ptypes.join(",") : undefined,
            pfeatures: q.pfeatures ? q.pfeatures.join(",") : undefined,
            uamenities: q.uamenities ? q.uamenities.join(",") : undefined,
            r: new Date().getTime(), // prevent cache
          },
        });
        setData(r.data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
    return q;
  }, [searchParams]);

  return (
    <div>
      <TopSearchBar defaultValues={query} />
      <div className="container space-y-4">
        {/* Breadcrumb */}
        <Breadcrumb
          items={(() => {
            const items = [{ label: GetCityById(query.pcity)!.name }];
            if (query.pdistrict) {
              const d = GetDistrictById(query.pdistrict);
              if (d) {
                items.push({ label: d.name });
              }
            }
            if (query.pward) {
              const w = GetWardById(query.pward);
              if (w) {
                items.push({ label: w.name });
              }
            }
            return items;
          })()}
          className="mt-4"
        />
        <h1 className="font-semibold text-xl">Nhà cho thuê {GetLocationName(query.pcity, query.pdistrict || "", query.pward || "")}</h1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8">
            {!loading && !error && (
              <ListingsList searchResult={data} />
            )}
          </div>
          <div className="hidden md:block md:col-span-4">
            <aside className="sticky top-4">
              <Sidebar cityCode={query.pcity} districtCode={query.pdistrict} />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
