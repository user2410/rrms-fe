"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { MdRestartAlt, MdSearch } from "react-icons/md";
import SearchbarSuggestion from "../../_components/landing-page/searchbar_suggestion";
import { searchFormSchema, SearchFormValues } from "../../_components/search_box";

import ExtraFilter from "./filter_extra";
import { useEffect } from "react";
import toast from "react-hot-toast";
import * as _ from "lodash";
import AreaFilter from "../../_components/landing-page/filters/filter_area";
import PriceFilter from "../../_components/landing-page/filters/filter_price";
import LocationFilter from "../../_components/landing-page/filters/filter_location";
import { PropTypesFilter } from "../../_components/landing-page/filters/filter_proptypes";
import { getSearchURL } from "./get_searchurl";

export default function TopSearchBar({
  defaultValues,
}: {
  defaultValues: Partial<SearchFormValues>;
}) {
  const router = useRouter();
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      ...defaultValues,
      ptypes: defaultValues.ptypes || [],
      pfeatures: defaultValues.pfeatures || [],
      uamenities: defaultValues.uamenities || [],
    },
  });

  function onSubmit(data: SearchFormValues) {
    router.push(getSearchURL(data));
  }

  useEffect(() => {
    if(!_.isEmpty(form.formState.errors)){
      console.error("form error:", form.formState.errors);
      toast.error(`Thông tin form không hợp lệ`);
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form
        className="flex items-center lg:px-2 px-1 h-[72px] border-y shadow-md"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex-1 px-2">
          <SearchbarSuggestion
            placeholder="Tìm kiếm theo khu vực"
            type="search"
            handlecityChange={(city) => form.setValue("pcity", city)}
            handledistrictChange={(district) => form.setValue("pdistrict", district)}
            handlewardChange={(ward) => form.setValue("pward", ward)}
          />
        </div>
        <Separator orientation="vertical" />
        <PropTypesFilter context="SEARCH" />
        <Separator orientation="vertical" />
        <LocationFilter context="SEARCH" />
        <Separator orientation="vertical" />
        <PriceFilter context="SEARCH" />
        <Separator orientation="vertical" />
        <AreaFilter context="SEARCH"/>
        <Separator orientation="vertical" />
        <ExtraFilter />
        <Separator orientation="vertical" />
        <Button type="button" variant="ghost" className="flex items-center gap-2" onClick={() => form.reset()}>
          <MdRestartAlt size={16} />
          Đặt lại
        </Button>
        <Separator orientation="vertical" />
        <Button
          type="submit" variant="ghost"
          className="flex items-center gap-2 hover:bg-primary-foreground"
        >
          <MdSearch size={16} />
          Tìm kiếm
        </Button>
      </form>
    </Form>
  );
}
