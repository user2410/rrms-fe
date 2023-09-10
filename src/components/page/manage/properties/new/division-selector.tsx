"use client";

import { Control } from "react-hook-form";
import { PropertyFormValues } from "./step1";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
} : {
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

  if(query.isLoading) {
    return (
      <div>Loading...</div>
    );
  }

  if(query.isError) {
    return (
      <div>Error: {JSON.stringify(query.error)}</div>
    );
  }

  return (
    <div className="flex justify-between gap-1">
      <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem className="flex-grow">
            <FormLabel>City</FormLabel>
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
                  <Separator/>
                  {query.data.map((d, i) => (
                    <SelectItem key={i} value={d.Id}>{d.Name}</SelectItem>
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
        name="district"
        render={({ field }) => (
          <FormItem className="flex-grow">
            <FormLabel>District</FormLabel>
            <Select 
              onValueChange={field.onChange}
              disabled={selectedCity === '00'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quận huyện" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="000">Chọn tỉnh thành</SelectItem>
                {(selectedCity !== "00") && (
                  query.data.find((d) => d.Id === selectedCity)?.Districts.map((d, i) => (
                    <SelectItem key={i} value={d.Id}>{d.Name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}