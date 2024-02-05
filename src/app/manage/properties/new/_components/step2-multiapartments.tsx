"use client";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFieldArray, useFormContext } from "react-hook-form";
import Step2Amenities from "./step2-amenities";
import Step2NRooms from "./step2-nrooms";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
  type: "APARTMENT"
};

export default function Step2MultiApartments() {
  const form = useFormContext<PropertyForm>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "units",
  });

  return (
    <div className="my-4 space-y-4">
      <div className="space-y-3">
        {fields.map((unit, index) => (
          <Card key={unit.id} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{`Căn hộ ${index + 1}`}</CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => append({
                    ...form.getValues(`units.${index}`),
                    name: "",
                    media: [],
                  })}
                >
                  Thêm căn hộ tương tự
                </Button>
                {fields.length === 1 ? null : (
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <IoClose size={16} />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="font-semibold text-base mb-2">Thông tin căn hộ</div>
                <FormField
                  control={form.control}
                  name={`units.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Số căn hộ<span className="ml-1 text-red-600">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="B201" {...field} defaultValue={unit.name} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row justify-between gap-2">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name={`units.${index}.floor`}
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormLabel>Tầng<span className="ml-1 text-red-600">*</span></FormLabel>
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
              </div>
              <div className="space-y-3">
                <div className="font-semibold text-base mb-2">Phòng ốc</div>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`units.${index}.numberOfBedrooms`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số phòng ngủ</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`units.${index}.numberOfBathrooms`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số phòng tắm</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`units.${index}.numberOfBalconies`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số ban công</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="font-semibold text-base mb-2">Tiện nghi</div>
                <Step2Amenities nth={index} />
              </div>
              <div>
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
          <span className="text-xl mr-2">+</span> Thêm căn hộ
        </Button>
      </div>
    </div>
  );
}
