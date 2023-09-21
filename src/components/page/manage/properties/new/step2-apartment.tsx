"use client";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import Step2Amenities from "./step2-amenities";
import Step2NRooms from "./step2-nrooms";

export default function Step2Apartment() {
  const form = useFormContext<PropertyForm>();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Thông tin về căn hộ</CardTitle>
          <CardDescription>Chi tiết về căn hộ giúp tìm kiếm khi đăng tin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="property.building"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Tòa nhà</FormLabel>
                <FormControl>
                  <Input placeholder="VD: Gold Mark City" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="property.project"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Dự án</FormLabel>
                <FormControl>
                  <Input placeholder="Project" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle>Phòng</CardTitle>
          <CardDescription>Số phòng trong căn hộ</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Step2NRooms/>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Tiện nghi</CardTitle>
          <CardDescription>Tiện nghi có sẵn trong căn hộ</CardDescription>
        </CardHeader>
        <CardContent>
          <Step2Amenities nth={0}/>
        </CardContent>
      </Card>
    </div>
  );
}
