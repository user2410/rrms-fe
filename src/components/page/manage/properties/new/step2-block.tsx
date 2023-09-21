"use client";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import Step2Amenities from "./step2-amenities";
import Step2MediaUpload from "./step2-mediaupload";

const emptyValue = {
  name: "",
  floor: 0,
  area: 0,
  numberOfLivingRooms: 0,
  numberOfBedrooms: 0,
  numberOfBathrooms: 0,
  numberOfKitchens: 0,
  numberOfToilets: 0,
  numberOfBalconies: 0,
  amenities: [],
  media: [],
};

export default function Step2Block() {
  const form = useFormContext<PropertyForm>();

  const { fields, append, remove } = useFieldArray({
    name: "units",
    control: form.control
  });

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 1 floor => no need to specify floor */}
      {/* multiple floors => specify floor */}
      {fields.map((unit, index) => (
        <Card
          key={unit.id}
          className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{`Phòng ${index + 1}`}</CardTitle>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => append(unit)}
              >
                Thêm phòng tương tự
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={() => remove(index)}
              >
                <IoClose size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 justify-between gap-4">
            <div className="space-y-4">
              <FormField
                name={`units.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên phòng</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Phòng 201" {...field} defaultValue={unit.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-between gap-2">
                <FormField
                  name={`units.${index}.area`}
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Diện tích (m<sup>2</sup>)<span className="ml-1 text-red-600">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="VD: 25" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          defaultValue={unit.name} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name={`units.${index}.floor`}
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Tầng</FormLabel>
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
              </div>
              <div>
                <CardTitle className="text-xl my-2">Tiện nghi</CardTitle>
                <Step2Amenities nth={index}/>
              </div>
            </div>
            <div className="">
              <Step2MediaUpload
                accept="image/*"
                multiple={true}
                nth={index}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="ghost"
        type="button"
        onClick={() => append(emptyValue)}
      >
        <span className="text-xl mr-2">+</span> Add new room
      </Button>
    </div>
  );
}
