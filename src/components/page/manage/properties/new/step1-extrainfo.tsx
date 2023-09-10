"use client";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Fragment } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { PropertyFormValues } from "./step1";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";

const features = [
  {
    id: 1,
    name: "p-feature_security"
  },
  {
    id: 2,
    name: "p-feature_fire-alarm"
  },
  {
    id: 3,
    name: "p-feature_gym"
  },
  {
    id: 4,
    name: "p-feature_fitness-center"
  },
  {
    id: 5,
    name: "p-feature_swimming-pool"
  },
  {
    id: 6,
    name: "p-feature_community-rooms"
  },
  {
    id: 7,
    name: "p-feature_public-library"
  },
  {
    id: 8,
    name: "p-feature_parking"
  },
  {
    id: 9,
    name: "p-feature_outdoor-common-area"
  },
  {
    id: 10,
    name: "p-feature_services"
  },
  {
    id: 11,
    name: "p-feature_facilities"
  },
];

export default function Step1ExtraInfo({
  form
} : {
  form: UseFormReturn<PropertyFormValues, any, undefined>
}) {
  const { fields, append, remove } = useFieldArray({
    name: "features",
    control: form.control,
  });

  return (
    <Fragment>
      <div className="flex justify-between gap-1">
        <FormField
          control={form.control}
          name="orientation"
          render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>Main orientation</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="n">Bắc</SelectItem>
                  <SelectItem value="e">Đông</SelectItem>
                  <SelectItem value="w">Tây</SelectItem>
                  <SelectItem value="s">Nam</SelectItem>
                  <SelectItem value="ne">Đông Bắc</SelectItem>
                  <SelectItem value="nw">Tây Bắc</SelectItem>
                  <SelectItem value="se">Đông Nam</SelectItem>
                  <SelectItem value="sw">Tây Nam</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearBuilt"
          render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>Year built</FormLabel>
              <FormControl>
                <Input type="number" min={1000} {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormLabel>Features</FormLabel>
        <FormDescription>Features of your property</FormDescription>
        {fields.map((f, index) => (
          <div key={f.id} className="flex items-end gap-1 my-2">
            <FormField
              control={form.control}
              name={`features.${index}.featureId`}
              render={({ field }) => (
                <FormItem className="w-[30%]">
                  {index === 0 && (<FormLabel className="text-xs">Name</FormLabel>)}
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={f.featureId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a feature"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">An ninh</SelectItem>
                        <SelectItem value="2">Hệ thống chữa cháy</SelectItem>
                        <SelectItem value="3">Phòng gym</SelectItem>
                        <SelectItem value="4">Trung tâm thể thao</SelectItem>
                        <SelectItem value="5">Bể bơi</SelectItem>
                        <SelectItem value="6">Phòng sinh hoạt cộng đồng</SelectItem>
                        <SelectItem value="7">Thư viện cộng đồng</SelectItem>
                        <SelectItem value="8">Bãi đỗ xe</SelectItem>
                        <SelectItem value="9">Không gian ngoài trời</SelectItem>
                        <SelectItem value="10">Dịch vụ</SelectItem>
                        <SelectItem value="11">Trang thiết bị</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`features.${index}.description`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  {index === 0 && (<FormLabel className="text-xs">Description</FormLabel>)}
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className=""
              onClick={() => remove(index)}
            >
              <IoClose size={24} />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => append({ featureId: "0", description: "" })}
        >
          Add feature
        </Button>
      </div>
    </Fragment>
  )
}