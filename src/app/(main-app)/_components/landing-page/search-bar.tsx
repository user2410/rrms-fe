"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { BsSliders } from "react-icons/bs";
import FilterModal from "./filter-modal";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { DeepPartial, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { backendAPI } from "@/libs/axios";

export const SearchFormSchema = z.object({
  ltitle: z
    .string(),
  "ptypes[]": z
    .array(
      z.string()
    ),
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
    .string(),
  pdistrict: z
    .string(),
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
  "pfeatures[]": z
    .array(
      z.string()
    ),
  "uamenities[]": z
    .array(
      z.string()
    ),
});

export type SearchFormValues = z.infer<typeof SearchFormSchema>;

export const SearchFormDefaultValues: DeepPartial<SearchFormValues> = {
  "ptypes[]": [],
  "pfeatures[]": [],
  "uamenities[]": [],
};

export default function SearchBar() {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: SearchFormDefaultValues,
  });
  const [openFilterModal, setOpenFilterModal] = useState(false);

  async function onSubmit(data: SearchFormValues) {
    console.log(data);
    try {
      const res = await backendAPI.get("/api/listings", {
        params: data
      });
      console.log(res.data);
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Modal
          isOpen={openFilterModal}
          onClose={() => setOpenFilterModal(false)}
        >
          <FilterModal closeModal={() => setOpenFilterModal(false)}/>
        </Modal>
        <FormField
          control={form.control}
          name="ltitle"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  className="flex-1 px-2 lg:px-3 py-1 lg:py-2"
                  placeholder="Tìm kiếm theo địa chỉ, tiêu đề tin đăng"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => setOpenFilterModal(true)}
          >
            <BsSliders size={16} />
            <span>Filter</span>
          </Button>
          <Button type="submit" variant="destructive">Search</Button>
        </div>
      </form>
    </Form>
  );
}
