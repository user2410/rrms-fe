"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fragment, useState } from "react";
import { Control, FieldValues, UseFormReturn, useFieldArray, useFormState } from "react-hook-form";
import { IoClose } from "react-icons/io5";

interface Amenity {
  amenityId: string;
  description?: string;
}

interface FormAmenity extends Amenity {
  id: string;
}

const amenities = [
  {
    id: "1",
    amenity: "u-amenity_furniture",
    name: "Nội thất",
  },
  {
    id: "2",
    amenity: "u-amenity_fridge",
    name: "Tủ lạnh",
  },
  {
    id: "3",
    amenity: "u-amenity_air-cond",
    name: "Điều hòa",
  },
  {
    id: "4",
    amenity: "u-amenity_washing-machine",
    name: "Máy giặt",
  },
  {
    id: "5",
    amenity: "u-amenity_dishwasher",
    name: "Máy rửa chén",
  },
  {
    id: "6",
    amenity: "u-amenity_water-heater",
    name: "Nóng lạnh",
  },
  {
    id: "7",
    amenity: "u-amenity_tv",
    name: "TV"
  },
  {
    id: "8",
    amenity: "u-amenity_internet",
    name: "Internet",
  },
  {
    id: "9",
    amenity: "u-amenity_wardrobe",
    name: "Tủ quần áo",
  },
  {
    id: "10",
    amenity: "u-amenity_closet",
    name: "Tủ đồ",
  },
  {
    id: "11",
    amenity: "u-amenity_entresol",
    name: "Gác lửng",
  },
  {
    id: "12",
    amenity: "u-amenity_bed",
    name: "Giường",
  },
];

export default function Step2Amenities({
  nth,
  control,
  getFields,
  append,
  remove,
}: {
  nth: number,
  control: Control<any>;
  getFields: () => FormAmenity[];
  append: (data: Amenity) => void;
  remove: (i: number) => void;
}) {
  const [values, setValues] = useState(getFields());

  return (
    <Fragment>
      {values.map((amenity, index) => (
        <div key={amenity.id} className="flex items-end gap-1 my-2">
          <FormField
            control={control}
            name={`units.${nth}.amenities.${index}.amenityId`}
            render={({ field }) => (
              <FormItem className="w-[30%]">
                {index === 0 && (<FormLabel className="text-xs">Tên</FormLabel>)}
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tiện nghi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amenities.map((amenity) => (
                        <SelectItem 
                          key={amenity.id} 
                          value={amenity.amenity}
                          className="overflow-hidden"
                        >
                          {amenity.name}
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
                {index === 0 && (<FormLabel className="text-xs">Mô tả</FormLabel>)}
                <FormControl>
                  <Input {...field} />
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
            onClick={() => {
              remove(index);
              setValues(getFields());
            }}
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
          onClick={() => {
            append({ amenityId: "0", description: "" })
            setValues(getFields());
          }}
        >
          Thêm tiện nghi
        </Button>
    </Fragment>
  );
}
