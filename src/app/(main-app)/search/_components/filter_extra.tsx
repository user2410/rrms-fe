"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrientationItems, pFeatures } from "@/models/property";
import { uAmenities } from "@/models/unit";
import { useFormContext } from "react-hook-form";
import { BsListUl } from "react-icons/bs";
import FilterNRooms from "../../_components/landing-page/filters/filter_nrooms";
import { SearchFormValues } from "../../_components/search_box";
import { useRouter } from "next/navigation";
import { objectToQueryString } from "@/utils/query";
import { beforeSubmitSearchForm } from "./top-searchbar";

export default function ExtraFilter() {
  const router = useRouter();
  const form = useFormContext<SearchFormValues>();

  function handleResetFields() {
    form.setValue("unumberOfLivingRooms", undefined);
    form.setValue("unumberOfBedrooms", undefined);
    form.setValue("unumberOfBathrooms", undefined);
    form.setValue("unumberOfKitchens", undefined);
    form.setValue("unumberOfToilets", undefined);
    form.setValue("unumberOfBalconies", undefined);
    form.setValue("porientation", undefined);
    form.setValue("pfeatures", []);
    form.setValue("uamenities", []);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" className="gap-2 rounded-none text-left text-md font-medium h-full">
          <BsListUl size={16} />
          Lọc thêm
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4 p-1">
        <FilterNRooms />
        <FormField
          control={form.control}
          name="porientation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hướng nhà</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger type="button">
                    <SelectValue placeholder="Hướng nhà" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {OrientationItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <MultipleSelector
            title="Tiện ích"
            options={pFeatures.map((item) => ({
              label: item.text,
              value: item.id.toString(),
            }))}
            selectedValues={form.watch("pfeatures")}
            setSelectedValues={(values) => form.setValue("pfeatures", values)}
          />
        </div>
        <div className="space-y-4">
          <MultipleSelector
            title="Tiện nghi"
            options={uAmenities.map((item) => ({
              label: item.text,
              value: item.id.toString(),
            }))}
            selectedValues={form.watch("uamenities")}
            setSelectedValues={(values) => form.setValue("uamenities", values)}
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <Button type="button" variant="outline" onClick={handleResetFields}>
            Đặt lại
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              router.push(`/search?${objectToQueryString(beforeSubmitSearchForm(form.getValues()))}`);
            }}
          >
            Tìm kiếm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
