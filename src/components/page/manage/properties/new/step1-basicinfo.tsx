"use client";

import { PropertyFormValues } from "./step1";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Fragment } from "react";
import { UseFormReturn } from "react-hook-form";

export default function Step1BasicInfo({
  form
} : {
  form: UseFormReturn<PropertyFormValues, any, undefined>
}) {
  return (
    <Fragment>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property name</FormLabel>
            <FormControl>
              <Input placeholder="Property name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-between gap-1">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type of your property" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="APARTMENT">Căn hộ</SelectItem>
                  <SelectItem value="SINGLE_RESIDENCE">Nhà riêng</SelectItem>
                  <SelectItem value="ROOM">Phòng trọ</SelectItem>
                  <SelectItem value="BLOCK">Dãy nhà / phòng trọ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>Property area (in m<sup>2</sup>)</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Property description" {...field}
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