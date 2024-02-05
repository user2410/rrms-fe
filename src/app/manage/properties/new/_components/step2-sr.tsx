"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { PropertyForm } from "../page";
import Step2Amenities from "./step2-amenities";

export default function Step2SingleUnit() {
  const form = useFormContext<PropertyForm>();
  const propertyType = form.watch("property.type");

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {["APARTMENT", "PRIVATE"].includes(propertyType) && (
        <Card>
          <CardHeader>
            <CardTitle>Phòng ốc</CardTitle>
            <CardDescription>Số phòng trong nhà</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="units.0.numberOfBedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phòng ngủ</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min={0} 
                      onChange={(e) => {
                        if(e.target.value === "") { form.resetField("units.0.numberOfBedrooms"); }
                        field.onChange(e.target.valueAsNumber);
                      }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="units.0.numberOfBathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phòng tắm</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min={0} 
                      onChange={(e) => {
                        if(e.target.value === "") { form.resetField("units.0.numberOfBathrooms"); }
                        field.onChange(e.target.valueAsNumber);
                      }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="units.0.numberOfBalconies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ban công</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min={0} 
                      onChange={(e) => {
                        if(e.target.value === "") { form.resetField("units.0.numberOfBalconies"); }
                        field.onChange(e.target.valueAsNumber);
                      }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Tiện nghi</CardTitle>
          <CardDescription>Tiện nghi có sẵn</CardDescription>
        </CardHeader>
        <CardContent>
          <Step2Amenities nth={0} />
        </CardContent>
      </Card>
    </div>
  );
}
