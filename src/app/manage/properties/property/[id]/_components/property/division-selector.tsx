"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext, useWatch } from "react-hook-form";

import { ScrollArea } from "@/components/ui/scroll-area";
import { GetCities, GetDistricts, GetWards } from "@/utils/dghcvn";
import { Fragment, useMemo } from "react";
import { FormValues } from "./address_form";

export default function DivisionSelector() {
  const { control, resetField } = useFormContext<FormValues>();

  const cityCode = useWatch({
    control,
    name: "city",
  });
  const districtId = useWatch({
    control,
    name: "district",
  });
  const wardId = useWatch({
    control,
    name: "ward",
  });

  const cities = useMemo(() => GetCities(), []);
  const districts = useMemo(() => GetDistricts(cityCode), [cityCode]);
  const wards = useMemo(() => GetWards(districtId), [districtId]);

  return (
    <Fragment>
      <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem className="flex-grow">
            <FormLabel>
              Tỉnh / Thành phố
              <span className="ml-1 text-red-600">*</span>
            </FormLabel>
            <Select
              onValueChange={(e) => {
                resetField('district');
                resetField('ward');
                field.onChange(e);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tỉnh thành" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <ScrollArea className="h-72">
                  {cities.map((c, i) => (
                    <SelectItem key={i} value={c.id}>{c.name}</SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-1">
        <FormField
          control={control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Quận, huyện
                <span className="ml-1 text-red-600">*</span>
              </FormLabel>
              <Select
                onValueChange={(e) => {
                  resetField('ward');
                  field.onChange(e);
                }}
                defaultValue={field.value}
                value={districtId}
                disabled={!cityCode}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận huyện" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <ScrollArea className="h-72">
                    {districts.map((d, i) => (
                      <SelectItem key={i} value={d.id.toString()}>{d.name}</SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="ward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phường, xã
                <span className="ml-1 text-red-600">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={wardId}
                disabled={!districtId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phường xã" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <ScrollArea className="h-72">
                    {
                      wards.map((w, i) => (
                        <SelectItem key={i} value={w.id.toString()}>{w.name}</SelectItem>
                      ))
                    }
                  </ScrollArea>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Fragment>
  );
}
