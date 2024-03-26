"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrientationItems, pFeatures } from "@/models/property";
import { useFormContext } from "react-hook-form";
import FilterNRooms from "./filter_nrooms";
import { SearchFormValues } from "../../search_box";
import { uAmenities } from "@/models/unit";

export default function ExtraFilter() {
  const form = useFormContext<SearchFormValues>();

  return (
    <Card className="border-none">
      <CardContent className="space-y-4 p-1">
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
      </CardContent>
    </Card>
  );
}
