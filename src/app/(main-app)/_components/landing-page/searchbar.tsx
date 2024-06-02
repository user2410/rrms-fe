"use client";

import { Button } from "@/components/ui/button";
import SearchbarSuggestion from "./searchbar_suggestion";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Values = {
  pcity?: string;
  pdistrict?: string;
  pward?: string;
};

export default function Searchbar() {
  const [values, setValues] = useState<Values>({} as Values);
  const router = useRouter();
  
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("submitting", values);
    e.preventDefault();
    if (!values.pcity) {
      return;
    }
    const q = encodeURIComponent(JSON.stringify({
      ...values,
      ptypes: [],
      pfeatures: [],
      uamenities: [],
    }));
    console.log(q);
    router.push(`/search?q=${q}`);
  }

  return (
    <form className="flex flex-row w-2/5 gap-1" onSubmit={handleSubmit}>
      <div className="flex-grow">
        <SearchbarSuggestion
          placeholder="Tìm kiếm theo khu vực"
          type="search"
          handlecityChange={(city: string) => setValues(v => ({ pcity: city}))}
          handledistrictChange={(district: string) => setValues(v => ({ pdistrict: district}))}
          handlewardChange={(ward: string) => setValues(v => ({ pward: ward}))}
        />
      </div>
      <Button type="submit">Tìm kiếm</Button>
    </form>
  );

};
