"use client";

import DivisionSelector from "@/components/complex/division-selector";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { OrientationItems, mapPropertyTypeToText } from "@/models/property";
import { GetLocationName } from "@/utils/dghcvn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { BsChevronDown, BsListUl } from "react-icons/bs";
import { MdRestartAlt } from "react-icons/md";
import { SearchFormDefaultValues, SearchFormSchema, SearchFormValues } from "../../_components/landing-page/search_box";
import SearchbarSuggestion from "../../_components/landing-page/searchbar_suggestion";

// const FilterButton = ({
//   title,
//   value,
// }: {
//   title: string;
//   value?: string | number;
// }): JSX.Element => (
//   <Button type="button" variant="ghost" className="block text-left rounded-none">
//     <div className="flex items-center gap-2 text-md font-medium">
//       {title}
//       <BsChevronDown size={16} />
//     </div>
//     <div className="text-sm font-light">
//       {value && ("Tất cả")}
//     </div>
//   </Button>
// );

const RegionPopover = (): JSX.Element => {
  const form = useFormContext<SearchFormValues>();

  const pcity = form.watch('pcity');
  const pdistrict = form.watch('pdistrict');
  const pward = form.watch('pward');

  const locationName = useMemo(() => GetLocationName(pcity || "", pdistrict || "", pward || ""), [pcity, pdistrict, pward]);

  function handleResetFields() {
    form.resetField("pcity");
    form.resetField("pdistrict");
    form.resetField("pward");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" className="block text-left rounded-none h-full">
          <div className="flex items-center gap-2 text-md font-medium">
            Khu vực
            <BsChevronDown size={16} />
          </div>
          <div className="text-sm font-light">
            {locationName ? locationName : "Toàn quốc"}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <DivisionSelector
          cityFieldName="pcity"
          districtFieldName="pdistrict"
          wardFieldName="pward"
        />
        <Button type="button" variant="outline" className="mt-3" onClick={handleResetFields}>
          Đặt lại
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const PricePopover = (): JSX.Element => {
  const form = useFormContext<SearchFormValues>();

  const lminPrice = form.watch('lminPrice');
  const lmaxPrice = form.watch('lmaxPrice');

  function handleResetFields() {
    form.setValue("lminPrice", Number.NEGATIVE_INFINITY);
    form.setValue("lmaxPrice", Number.POSITIVE_INFINITY);
    // form.resetField("lminPrice");
    // form.resetField("lmaxPrice");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" className="block text-left rounded-none h-full">
          <div className="flex items-center gap-2 text-md font-medium">
            Mức giá
            <BsChevronDown size={16} />
          </div>
          <div className="text-sm font-light">
            {lminPrice ? (
              lmaxPrice ? (
                `${lminPrice} triệu - ${lmaxPrice} triệu`
              ) : (
                `Trên ${lminPrice} triệu`
              )
            ) : lmaxPrice ? (
              `Dưới ${lmaxPrice} triệu`
            ) : "Tất cả"}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex justify-between">
          <FormField
            control={form.control}
            name="lminPrice"
            render={({ field }) => (
              <FormItem className="flex gap-2">
                <FormControl>
                  <Input type="number" className="w-20" min={form.watch('lmaxPrice')} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormDescription>triệu</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lmaxPrice"
            render={({ field }) => (
              <FormItem className="flex gap-2">
                <FormControl>
                  <Input type="number" className="w-20" min={form.watch('lminPrice')} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormDescription>triệu</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <Button type="button" variant="outline" className="mt-3" onClick={handleResetFields}>
          Đặt lại
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const OthersPopover = (): JSX.Element => {
  const form = useFormContext<SearchFormValues>();

  function handleResetFields() {

  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" className="gap-2 rounded-none text-left text-md font-medium h-full">
          <BsListUl size={16} />
          Lọc thêm
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div>
          <FormField
            control={form.control}
            name="porientation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hướng nhà</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        </div>
        <Button type="button" variant="outline" className="mt-3" onClick={handleResetFields}>
          Đặt lại
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default function TopSearchBar() {
  // const searchParams = useSearchParams();
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: SearchFormDefaultValues,
  });

  function onSubmit(data: SearchFormValues) {
    console.log(data);
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

        <FormField
          control={form.control}
          name="ptypes"
          render={({ field }) => (
            <MultipleSelector
              title="Loại bât động sản"
              options={Object.entries(mapPropertyTypeToText).map((item) => ({
                label: item[1],
                value: item[0],
              }))}
              selectedValues={field.value}
              setSelectedValues={(values) => field.onChange(values)}
            />
          )}
        />

        <Separator orientation="vertical" />

        <RegionPopover />

        <Separator orientation="vertical" />

        <PricePopover />

        <Separator orientation="vertical" />

        <OthersPopover/>

        <Separator orientation="vertical" />

        <Button type="button" variant="ghost" className="flex items-center gap-2" onClick={() => { }}>
          <MdRestartAlt size={16} />
          Đặt lại
        </Button>
      </form>
    </Form>
  );
}
