"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchFormSchema, SearchFormValues } from "../_components/search_box";
import SearchPage from "./_components/search";

export default function SearchPageWrapper() {
  const searchParams = useSearchParams();
  const encodedData = searchParams?.get("q");
  const [query, setQuery] = useState<SearchFormValues | undefined>({} as SearchFormValues);

  useEffect(() => {
    try {
      const q = (encodedData
        ? JSON.parse(decodeURIComponent(encodedData))
        : {});
      const parse = searchFormSchema.safeParse(q);
      if(parse.success) {
        setQuery(q);
      } else {
        throw new Error(JSON.stringify(parse.error));
      }
    } catch(err) {
      setQuery(undefined);
      console.error('Error parsing query parameter:', err);
    }
  }, []);

  return (!!query) ? (
    <SearchPage query={query} />
  ) : (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <p className="text-red-500">Truy vấn không hợp lệ</p>
      <button
        className="btn btn-primary"
        onClick={() => window.location.href = "/"}
      >
        Quay lại trang chủ
      </button>
    </div>
  );
}

