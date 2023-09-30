"use client";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { pFeatures } from "@/models/property";
import { Fragment } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IoClose } from "react-icons/io5";

export default function Step1Features() {
  const form = useFormContext<PropertyForm>();

  const { fields, append, remove } = useFieldArray({
    name: "property.features",
    control: form.control,
  });

  return (
    <Fragment>
      <div className="w-full flex mt-4 mb-2">
        <div className="w-[40%] text-xs font-medium">Tiện ích</div>
        <div className="flex-grow text-xs font-medium">Mô tả</div>
      </div>
      {fields.map((f, index) => (
        <div key={f.id} className="flex items-start gap-1 my-2">
          <FormField
            control={form.control}
            name={`property.features.${index}.featureId`}
            render={({ field }) => (
              <FormItem className="w-[40%]">
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tiện ích" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pFeatures
                        .filter(f => !(fields.map((_f, idx) => idx !== index ? _f.featureId : '').includes(f.id.toString())))
                        .map((item, idx) => (
                          <SelectItem
                            key={idx}
                            value={item.id.toString()}
                          >
                            {item.text}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`property.features.${index}.description`}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Textarea
                    placeholder="Mô tả tiện ích"
                    rows={2}
                    {...field}
                    className="overflow-y-scroll"
                  />
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
        Thêm tiện ích
      </Button>
    </Fragment>
  )
}
