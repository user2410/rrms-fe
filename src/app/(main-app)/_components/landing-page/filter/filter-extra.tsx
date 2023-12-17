"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrientationItems, pFeatures } from "@/models/property";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "../search-bar";
import FilterNRooms from "./filter-nrooms";

export default function ExtraFilter() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useFormContext<SearchFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lọc thêm</CardTitle>
      </CardHeader>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <CardContent>
            <Button type="button" variant="link" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "Ẩn" : "Hiện"} lọc thêm
            </Button>
          </CardContent>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <FilterNRooms/>
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
            <div className="space-y-4">
            <MultipleSelector
              title="Tiện ích"
              options={pFeatures.map((item) => ({
                label: item.text,
                value: item.id.toString(),
              }))}
              selectedValues={form.watch("pfeatures[]")}
              setSelectedValues={(values) => form.setValue("pfeatures[]", values)}
            />
            </div>
            <div className="space-y-4">
            <MultipleSelector
              title="Tiện nghi"
              options={pFeatures.map((item) => ({
                label: item.text,
                value: item.id.toString(),
              }))}
              selectedValues={form.watch("uamenities[]")}
              setSelectedValues={(values) => form.setValue("uamenities[]", values)}
            />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="button" variant="outline" onClick={() => {
              form.resetField("unumberOfLivingRooms");
              form.resetField("unumberOfBedrooms");
              form.resetField("unumberOfBathrooms");
              form.resetField("unumberOfKitchens");
              form.resetField("unumberOfToilets");
              form.resetField("unumberOfBalconies");
              form.resetField("porientation");
              form.resetField("pfeatures[]");
            }}>
              Đặt lại
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
