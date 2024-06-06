"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { DeepPartial, useForm } from "react-hook-form";
import { BsSliders } from "react-icons/bs";
import * as z from "zod";
import AreaFilter from "./landing-page/filters/filter_area";
import ExtraFilter from "./landing-page/filters/filter_extra";
import LocationFilter from "./landing-page/filters/filter_location";
import PriceFilter from "./landing-page/filters/filter_price";
import { PropTypesFilter } from "./landing-page/filters/filter_proptypes";
import SearchbarSuggestion from "./searchbar_suggestion";
import { getSearchURL } from "../search/_components/get_searchurl";

export const searchFormSchema = z.object({
  ptypes: z
    .array(
      z.string()
    ),
  lcreatorId: z.string().optional(),
  lminPrice: z
    .number()
    .min(0)
    .optional(),
  lmaxPrice: z
    .number()
    .min(0)
    .optional(),
  pminArea: z
    .number()
    .min(0)
    .optional(),
  pmaxArea: z
    .number()
    .min(0)
    .optional(),
  pcity: z
    .string()
    .optional(),
  pdistrict: z
    .string()
    .optional(),
  pward: z
    .string()
    .optional(),
  unumberOfLivingRooms: z
    .coerce
    .number()
    .optional(),
  unumberOfBedrooms: z
    .coerce
    .number()
    .optional(),
  unumberOfBathrooms: z
    .coerce
    .number()
    .optional(),
  unumberOfKitchens: z
    .coerce
    .number()
    .optional(),
  unumberOfToilets: z
    .coerce
    .number()
    .optional(),
  unumberOfBalconies: z
    .coerce
    .number()
    .optional(),
  porientation: z
    .string()
    .optional(),
  pfeatures: z
    .array(
      z.string()
    ),
  uamenities: z
    .array(
      z.string()
    ),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;

export const SearchFormDefaultValues: DeepPartial<SearchFormValues> = {
  ptypes: [],
  pfeatures: [],
  uamenities: [],
};

export default function SearchBox() {
  const router = useRouter();
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: SearchFormDefaultValues,
  });

  async function onSubmit(data: SearchFormValues) {
    router.push(getSearchURL(data));
  }

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full flex flex-row gap-2">
          <div className="flex-1">
            <SearchbarSuggestion
              placeholder="Tìm kiếm theo khu vực"
              type="search"
            />
          </div>
          <div className="flex flex-row gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <BsSliders size={16} />
                  <span>Lọc...</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[582px]">
                <DialogHeader>Lọc thêm</DialogHeader>
                <ExtraFilter />
                <DialogFooter className="justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => {
                    form.setValue("unumberOfLivingRooms", undefined);
                    form.setValue("unumberOfBedrooms", undefined);
                    form.setValue("unumberOfBathrooms", undefined);
                    form.setValue("unumberOfKitchens", undefined);
                    form.setValue("unumberOfToilets", undefined);
                    form.setValue("unumberOfBalconies", undefined);
                    form.setValue("porientation", undefined);
                    form.setValue("pfeatures", []);
                    form.setValue("uamenities", []);
                  }}>
                    Đặt lại
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Đóng</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DialogClose asChild>
              <Button type="submit" variant="destructive">Tìm kiếm</Button>
            </DialogClose>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <PropTypesFilter />
          <LocationFilter />
          <AreaFilter />
          <PriceFilter />
        </div>
      </form>
    </Form>
  );
}
