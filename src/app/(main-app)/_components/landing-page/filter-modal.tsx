import { Separator } from "@/components/ui/separator";

import { ScrollArea } from "@/components/ui/scroll-area";
import ExtraFilter from "./filter/filter-extra";
import LocationFilter from "./filter/filter-location";
import PriceFilter from "./filter/filter-price";
import PropTypesFilter from "./filter/filter-types";
import { Button } from "@/components/ui/button";
import { BsCheck } from "react-icons/bs";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "./search-bar";
import { Input } from "@/components/ui/input";
import AreaFilter from "./filter/filter-area";

export default function FilterModal({
  closeModal,
} : {
  closeModal: () => void;
}) {
  const form = useFormContext<SearchFormValues>();

  return (
    <div className="relative space-y-4">
      <div className="absolute top-0 left-0 right-0 bg-gray-200">
        <FormField
          control={form.control}
          name="ltitle"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="flex-1 px-2 lg:px-3 py-1 lg:py-2 focus-visible:!ring-0 focus-visible:!ring-transparent"
                  placeholder="Tìm kiếm địa chỉ, tiêu đề tin đăng"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="pt-10">
        <ScrollArea className="h-[75vh]">
          <PropTypesFilter />
          <Separator />
          <LocationFilter />
          <Separator />
          <AreaFilter />
          <Separator />
          <PriceFilter />
          <Separator />
          <ExtraFilter />
        </ScrollArea>
        <div className="w-full">
          <div className="float-right">
            <Button 
              type="button" 
              variant="default"
              className="bg-primary text-white flex items-center"
              onClick={() => closeModal()}>
              <BsCheck size={20} />
              <span className="ml-2">Áp dụng</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
