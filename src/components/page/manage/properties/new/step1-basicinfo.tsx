"use client";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mapPropertyTypeToText } from "@/models/property";
import { Fragment } from "react";
import { useFormContext } from "react-hook-form";

const propertyTypePlaceholders = {
  APARTMENT: 'VD: Căn hộ đường Giải Phóng',
  PRIVATE: 'VD: Nhà riêng đường Giang Văn Minh',
  TOWNHOUSE: 'VD: Nhà phố 108 Lò Đúc',
  SHOPHOUSE: 'VD: Shophouse đường Giải Phóng',
  VILLA: 'VD: Biệt thự song lập Phú Mỹ Hưng',
  ROOM: 'VD: Phòng trọ đường Nguyễn Văn Cừ',
  OFFICE: 'VD: Văn phòng đường Lê Văn Lương',
  STORE: 'VD: Cửa hàng đường Lê Văn Lương',
  BLOCK: 'VD: Khu nhà trọ đường Lê Văn Lương',
}

export default function Step1BasicInfo() {
  const form = useFormContext<PropertyForm>();
  
  return (
    <Fragment>
      <FormField
        control={form.control}
        name="property.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại bất động sản <span className="ml-1 text-red-600">*</span></FormLabel>
            <Select 
              defaultValue={field.value}
              value={form.watch('property.type')}
              onValueChange={(e: string) => {
                if (['APARTMENT', 'ROOM', 'STUDIO'].includes(e)) {
                  form.setValue("property.numberOfFloors", 1);
                }
                field.onChange(e);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="VD: Nhà riêng" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(mapPropertyTypeToText).map(([key, value]) => (
                  <SelectItem 
                    key={key} 
                    value={key}
                  >
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="property.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên bất động sản <span className="ml-1 text-red-600">*</span></FormLabel>
            <FormControl>
              <Input placeholder={propertyTypePlaceholders[form.watch('property.type') as keyof typeof propertyTypePlaceholders]} {...field} />
            </FormControl>
            <FormDescription>Tên của bất động sản phân biệt các bất động sản được quản lý.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-between gap-1">
        <FormField
          control={form.control}
          name="property.numberOfFloors"
          render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>
                Số tầng
                <span className="ml-1 text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  disabled={['APARTMENT', 'ROOM'].includes(form.watch('property.type'))}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="property.area"
          render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>
                Tổng diện tích (tính bằng m<sup>2</sup>)
                <span className="ml-1 text-red-600">*</span>
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
      </div>
      <FormField
        control={form.control}
        name="property.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Nhập mô tả chung về bất động sản của bạn. Ví dụ: Khu nhà có vị trí thuận lợi, gần công viên, gần trường học ... "
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Fragment>
  )
}
