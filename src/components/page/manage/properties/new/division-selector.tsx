"use client";

import { Control } from "react-hook-form";
import { PropertyFormValues } from "../../../../../app/manage/properties/new/step1";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Fragment, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface Division {
  Id: string;
  Name: string;
  Districts: [
    {
      Id: string;
      Name: string;
      Wards: [
        {
          Id: string;
          Name: string;
          Level: string;
        }
      ]
    }
  ]
};

export default function DivisionSelector({
  control
}: {
  control: Control<PropertyFormValues>
}) {
  const query = useQuery<Division[]>({
    queryKey: ["dghcvn"],
    queryFn: async () => {
      const res = await fetch("/dghcvn.json");
      const data = await res.json();
      return data;
    }
  });

  const [selectedCity, setSelectedCity] = useState<string>("00");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("000");

  useEffect(() => {
    if (selectedCity === "00") {
      setSelectedDistrict("000");
    }
  }, [selectedCity]);

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
            {(query.isLoading || query.isError) ? (
              <FormControl>
                <Input placeholder="Chọn tỉnh thành" {...field} />
              </FormControl>
            ) : (
              <Select
                onValueChange={(e) => {
                  setSelectedCity(e);
                  field.onChange(e);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh thành" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <ScrollArea className="h-72">
                    <SelectItem value="00">Chọn tỉnh thành</SelectItem>
                    <Separator />
                    {query.data.map((d, i) => (
                      <SelectItem key={i} value={d.Name}>{d.Name}</SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-between gap-1">
        <FormField
          control={control}
          name="district"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>
                Quận, huyện
                <span className="ml-1 text-red-600">*</span>
              </FormLabel>
              {(query.isLoading || query.isError) ? (
                <FormControl>
                  <Input placeholder="Chọn quận huyện" {...field} />
                </FormControl>
              ) : (
                <Select
                  onValueChange={(e: string) => {
                    setSelectedDistrict(e);
                    field.onChange(e);
                  }}
                  disabled={selectedCity === '00'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quận huyện" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-72">
                      <SelectItem value="000">Chọn quận huyện</SelectItem>
                      <Separator />
                      {(selectedCity !== "00") && (
                        query.data.find((c) => c.Name === selectedCity)?.Districts.map((d, i) => (
                          <SelectItem key={i} value={d.Name}>{d.Name}</SelectItem>
                        ))
                      )}
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
          name="ward"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>
                Phường, xã
                <span className="ml-1 text-red-600">*</span>
              </FormLabel>
              {(query.isLoading || query.isError) ? (
                <FormControl>
                  <Input placeholder="Chọn phường xã" {...field} />
                </FormControl>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  disabled={selectedDistrict === '000'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quận huyện" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-72">
                      <SelectItem value="000">Chọn quận huyện</SelectItem>
                      <Separator />
                      {(selectedDistrict !== "000") && (
                        query.
                          data.find((c) => c.Name === selectedCity)?.
                          Districts.find((d) => d.Name === selectedDistrict)?.
                          Wards.map((d, i) => (
                          <SelectItem key={i} value={d.Name}>{d.Name}</SelectItem>
                        ))
                      )}
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
