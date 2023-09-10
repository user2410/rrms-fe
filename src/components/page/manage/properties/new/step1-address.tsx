"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Fragment } from "react";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "./step1";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoLocation } from "react-icons/io5";
import DivisionSelector from "./division-selector";

export default function Step1Address({
  form
} : {
  form: UseFormReturn<PropertyFormValues, any, undefined>
}) {
  return (
    <Fragment>
      <FormField
        control={form.control}
        name="fullAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full address</FormLabel>
            <FormControl>
              <Input placeholder="Full address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <DivisionSelector control={form.control} />
      <Button
        variant="default"
        type="button"
        onClick={() => console.log('Launch map modal')}
      >
        <IoLocation size={24} />
        <span className="ml-1">Pick location on map</span>
      </Button>
    </Fragment>
  )
}