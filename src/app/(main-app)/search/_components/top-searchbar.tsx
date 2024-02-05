"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { objectToQueryString } from "@/utils/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { MdRestartAlt } from "react-icons/md";
import { SearchFormSchema, SearchFormValues } from "../../_components/landing-page/search_box";
import SearchbarSuggestion from "../../_components/landing-page/searchbar_suggestion";
import ExtraFilter from "./filter_extra";
import LocationFilter from "./filter_location";
import PriceFilter from "./filter_price";
import PropTypesFilter from "./filter_ptypes";

export function beforeSubmitSearchForm(data: SearchFormValues) : SearchFormValues {
  if(data.lminPrice) {
    data.lminPrice *= 1000000;
  }
  if(data.lmaxPrice) {
    data.lmaxPrice *= 1000000;
  }
  return data;
}

export default function TopSearchBar({
  defaultValues,
} : {
  defaultValues: Partial<SearchFormValues>;
}) {
  const router = useRouter();
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      ...defaultValues,
      lminPrice: defaultValues.lminPrice ? defaultValues.lminPrice / 1000000 : undefined,
      lmaxPrice: defaultValues.lmaxPrice ? defaultValues.lmaxPrice / 1000000 : undefined,
      ptypes: defaultValues.ptypes || [],
      pfeatures: defaultValues.pfeatures || [],
      uamenities: defaultValues.uamenities || [],
    },
  });

  function onSubmit(data: SearchFormValues) {
    console.log(data);
    router.push(`/search?${objectToQueryString(data)}`);
  }

  return (
    <Form {...form}>
      <form
        className="flex items-center lg:px-2 px-1 h-[72px] border-y shadow-md"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex-1">
          <SearchbarSuggestion
            placeholder="Tìm kiếm theo khu vực"
            type="search"
          />
        </div>

        <Separator orientation="vertical" />

        <PropTypesFilter/>

        <Separator orientation="vertical" />

        <LocationFilter />

        <Separator orientation="vertical" />

        <PriceFilter />

        <Separator orientation="vertical" />

        <ExtraFilter/>

        <Separator orientation="vertical" />

        <Button type="button" variant="ghost" className="flex items-center gap-2" onClick={() => { }}>
          <MdRestartAlt size={16} />
          Đặt lại
        </Button>
      </form>
    </Form>
  );
}
