"use client";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import Step2Amenities from "./step2-amenities";

export default function Step2Room() {
  const form = useFormContext<PropertyForm>();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Thông tin phòng</CardTitle>
          <CardDescription>Chi tiết về phòng trọ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full flex justify-between gap-2">
            <FormField
              control={form.control}
              name="units.0.name"
              render={({ field }) => (
                <FormItem className="flex-grow-[2]">
                  <FormLabel>Tên phòng</FormLabel>
                  <FormControl>
                    <Input placeholder="D9-401" {...field} />
                  </FormControl>
                  <FormDescription>Nếu không có, bỏ qua trường này</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="units.0.floor"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Tầng</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex justify-between gap-2">
            <FormField
              control={form.control}
              name="units.0.numberOfBedrooms"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Số phòng ngủ</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="units.0.numberOfBathrooms"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Số phòng tắm</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="units.0.hasBalcony"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(e) => {
                      console.log(e.valueOf());
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormLabel>
                  Có ban công
                </FormLabel>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Tiện nghi</CardTitle>
          <CardDescription>Tiện nghi có sẵn trong phòng trọ</CardDescription>
        </CardHeader>
        <CardContent>
          <Step2Amenities nth={0}/>
        </CardContent>
      </Card>
    </div>
  );
}
