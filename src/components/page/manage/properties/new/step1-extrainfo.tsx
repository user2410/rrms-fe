"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { PropertyFormValues } from "../../../../../app/manage/properties/new/step1";
import { Fragment } from "react";

export default function Step1ExtraInfo({
  form
}: {
  form: UseFormReturn<PropertyFormValues, any, undefined>
}) {

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="orientation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hướng nhà</FormLabel>
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
          <FormItem>
            <FormLabel>Năm xây dựng</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1000}
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="entranceWidth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Đường vào (m)</FormLabel>
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
      <FormField
        control={form.control}
        name="facade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mặt tiền (m<sup>2</sup>)</FormLabel>
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
  )
}
