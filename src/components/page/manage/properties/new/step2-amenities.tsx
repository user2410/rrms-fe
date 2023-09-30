"use client";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uAmenities } from "@/models/unit";
import { Fragment } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IoClose } from "react-icons/io5";

export default function Step2Amenities({
  nth,
}: {
  nth: number,
}) {
  const { control } = useFormContext<PropertyForm>();

  const { fields, append, remove } = useFieldArray({
    name: `units.${nth}.amenities`,
    control,
  })

  return (
    <Fragment>
      <div className="w-full flex mt-4 mb-2">
        <div className="w-[40%] text-xs font-medium">Tiện nghi</div>
        <div className="flex-grow text-xs font-medium">Mô tả</div>
      </div>
      {fields.map((amenity, index) => (
        <div key={amenity.id} className="flex items-start gap-1 my-2">
          <FormField
            control={control}
            name={`units.${nth}.amenities.${index}.amenityId`}
            render={({ field }) => (
              <FormItem className="w-[40%]">
                <FormControl>
                  <Select 
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tiện nghi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {uAmenities.map((item, idx) => (
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
            control={control}
            name={`units.${nth}.amenities.${index}.description`}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Textarea
                    placeholder="Mô tả tiện nghi"
                    rows={2}
                    {...field} 
                    className="resize-none"
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
        onClick={() => append({ amenityId: "0", description: "" })}
      >
        Thêm tiện nghi
      </Button>
    </Fragment>
  );
}
