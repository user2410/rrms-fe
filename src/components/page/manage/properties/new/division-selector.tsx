"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext, useWatch } from "react-hook-form";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCities, useDistricts, useWards } from "@/hooks/use-dghcvn";
import { Fragment } from "react";

export default function DivisionSelector() {
  const { control, resetField } = useFormContext<PropertyForm>();

  const cityCode = useWatch({
    control,
    name: "property.city",
  });
  const districtId = useWatch({
    control,
    name: "property.district",
  });
  const wardId = useWatch({
    control,
    name: "property.ward",
  });

  const cityQuery = useCities();
  const districtQuery = useDistricts(cityCode);
  const wardQuery = useWards(districtId);

  return (
    <Fragment>
      <FormField
        control={control}
        name="property.city"
        render={({ field }) => (
          <FormItem className="flex-grow">
            <FormLabel>
              Tỉnh / Thành phố
              <span className="ml-1 text-red-600">*</span>
            </FormLabel>
            {(cityQuery.isLoading || cityQuery.isError) ? (
              <FormControl>
                <Input {...field} />
              </FormControl>
            ) : (
              <Select 
                onValueChange={(e) => {
                  resetField('property.district');
                  resetField('property.ward');
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
                    {cityQuery.data.map((c, i) => (
                      <SelectItem key={i} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-1">
        <FormField
          control={control}
          name="property.district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Quận, huyện
                <span className="ml-1 text-red-600">*</span>
              </FormLabel>
              {(districtQuery.isLoading || districtQuery.isError) ? (
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Quận huyện"
                    disabled={!cityCode}
                  />
                </FormControl>
              ) : (
                <Select
                  onValueChange={(e) => {
                    resetField('property.ward')
                    field.onChange(e);
                  }}
                  defaultValue={field.value}
                  value={districtId}
                  disabled={!cityCode}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quận huyện"/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-72">
                      {districtQuery.data.map((d, i) => (
                        <SelectItem key={i} value={d.id.toString()}>{d.name}</SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="property.ward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phường, xã
                <span className="ml-1 text-red-600">*</span>
              </FormLabel>
              {(wardQuery.isLoading || wardQuery.isError) ? (
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Phường xã"
                    disabled={!districtId}
                  />
                </FormControl>
              ) : (
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
                        wardQuery.data.map((w, i) => (
                          <SelectItem key={i} value={w.id.toString()}>{w.name}</SelectItem>
                        ))
                      }
                    </ScrollArea>
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Fragment>
  )
}
