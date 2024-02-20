"use client";

import { PropertyForm } from "@/app/manage/properties/new/page";
import Editor from "@/components/ui/editor";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { mapPropertyTypeToText } from "@/models/property";
import { Fragment } from "react";
import { useFormContext } from "react-hook-form";

const propertyNamePlaceholders = {
  APARTMENT: 'VD: Căn hộ đường Giải Phóng',
  PRIVATE: 'VD: Nhà riêng đường Giang Văn Minh',
  ROOM: 'VD: Phòng trọ đường Nguyễn Văn Cừ',
  OFFICE: 'VD: Văn phòng đường Lê Văn Lương',
  STORE: 'VD: Cửa hàng đường Lê Văn Lương',
};

// APARTMENT có nhiều unit = quỹ căn hộ
// ROOM có nhiều unit = dãy nhà trọ
// PRIVATE, dãy nhà trọ nhập số tầng
// Quỹ căn hộ không nhập diện tích
export default function Step1BasicInfo() {
  const form = useFormContext<PropertyForm>();
  const propertyType = form.watch('property.type');

  return (
    <Fragment>
      <div className="flex flex-row items-center gap-2">
        <FormField
          control={form.control}
          name="property.type"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Loại nhà cho thuê <span className="ml-1 text-red-600">*</span></FormLabel>
              <Select
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="ring-0 focus:ring-0">
                    <SelectValue placeholder="VD: Nhà riêng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(mapPropertyTypeToText).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {propertyType === "APARTMENT" && (
          <FormField
            control={form.control}
            name="property.multiUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Là quỹ căn ?</FormLabel><br/>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-readonly
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        {propertyType === "ROOM" && (
          <FormField
            control={form.control}
            name="property.multiUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Là dãy phòng trọ ?</FormLabel><br/>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-readonly
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>
      {propertyType === "APARTMENT" && (
        <div className="flex flex-row justify-between gap-2">
          <FormField
            control={form.control}
            name="property.project"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Dự án</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Dự án Thống Nhất Complex"/>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="property.building"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Toà nhà</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Tòa nhà Thống Nhất"/>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
      <FormField
        control={form.control}
        name="property.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên nhà cho thuê <span className="ml-1 text-red-600">*</span></FormLabel>
            <FormControl>
              <Input placeholder={propertyNamePlaceholders[form.watch('property.type') as keyof typeof propertyNamePlaceholders]} {...field} />
            </FormControl>
            <FormDescription>Tên của nhà cho thuê phân biệt các nhà cho thuê được quản lý.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-between gap-2">
        {["PRIVATE", "MINIAPARTMENT"].includes(propertyType) && (
          <FormField
            control={form.control}
            name="property.numberOfFloors"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>
                  Số tầng
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!(["APARTMENT", "ROOM"].includes(propertyType) && form.watch("property.multiUnit")) && (
          <FormField
            control={form.control}
            name="property.area"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>
                  Diện tích (m<sup>2</sup>)<span className="ml-1 text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      <FormField
        control={form.control}
        name="property.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Editor
                {...field}
                placeholder="Nhập mô tả chung về nhà cho thuê của bạn. Ví dụ: Khu nhà có vị trí thuận lợi, gần công viên, gần trường học ... "
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Fragment>
  );
}
