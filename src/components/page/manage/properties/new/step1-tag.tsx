"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Fragment } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { PropertyFormValues } from "./step1";

export function Step1Tag({
  form
}: {
  form: UseFormReturn<PropertyFormValues, any, undefined>
}) {
  const { fields, append, remove } = useFieldArray({
    name: "tags",
    control: form.control,
  });

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const v = e.currentTarget.value;
      append({ tag: v });
      e.currentTarget.value = '';
    }
  }

  return (
    <Fragment>
      <div className="flex flex-row gap-1 border rounded-sm p-2">
        {fields.map((field, i) => (
          <Badge key={field.id}>
            <span>{field.tag}</span>
            <Button
              variant="ghost"
              onClick={() => remove(i)}
              className="ml-1 p-0 hover:!bg-transparent"
            >
              <IoClose size={16} />
            </Button>
          </Badge>
        ))}
      </div>
      <FormItem>
        <FormLabel>Tags</FormLabel>
        <FormDescription>Add tag to your property</FormDescription>
        <FormControl>
          <Input
            placeholder="Write new tag and press Enter"
            onKeyUp={handleKeyUp} />
        </FormControl>
        <FormMessage />
      </FormItem>
    </Fragment>
  )
}