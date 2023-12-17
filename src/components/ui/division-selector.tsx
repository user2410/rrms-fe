"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldValues, useFormContext, useWatch } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCities, useDistricts, useWards } from "@/hooks/use-dghcvn";

export default function DivisionSelector<T>({
  cityFieldName,
  districtFieldName,
  wardFieldName,
} : {
  cityFieldName: string;
  districtFieldName: string;
  wardFieldName: string;
}) {
  const { control, resetField } = useFormContext<FieldValues>();

  const cityCode = useWatch({
    control,
    name: cityFieldName,
  });
  const districtId = useWatch({
    control,
    name: districtFieldName,
  });
  const wardId = useWatch({
    control,
    name: wardFieldName,
  });

  const cityQuery = useCities();
  const districtQuery = useDistricts(cityCode);
  const wardQuery = useWards(districtId);

  return (
    <div className="flex flex-col gap-3">
      <FormField
        control={control}
        name={cityFieldName}
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
                  resetField(districtFieldName);
                  resetField(wardFieldName);
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
          name={districtFieldName}
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
                    resetField(wardFieldName);
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
          name={wardFieldName}
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
    </div>
  );
}
