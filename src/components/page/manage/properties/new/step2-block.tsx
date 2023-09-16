"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useFormState } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import * as z from "zod";
import Step2Amenities from "./step2-amenities";
import Step2MediaUpload from "./step2-mediaupload";
import { useEffect } from "react";

const unitFormSchema = z.object({
  units: z.array(
    z.object({
      name: z
        .string(),
      floor: z
        .number()
        .optional(),
      numberOfLivingRooms: z
        .number()
        .optional(),
      numberOfBedrooms: z
        .number()
        .optional(),
      numberOfBathrooms: z
        .number()
        .optional(),
      numberOfKitchens: z
        .number()
        .optional(),
      numberOfToilets: z
        .number()
        .optional(),
      numberOfBalconies: z
        .number()
        .optional(),
      amenities: z
        .array(
          z.object({
            amenityId: z.string(),
            description: z.string().optional(),
          })
        ),
      media: z
        .array(
          z.object({
            name: z.string(),
            size: z.number(),
            type: z.string(),
            url: z.string(),
          })
        ),
    })
  ),
});

export type BlockUnitFormSchema = z.infer<typeof unitFormSchema>;

const emptyValue = {
  name: "",
  floor: 0,
  numberOfLivingRooms: 0,
  numberOfBedrooms: 0,
  numberOfBathrooms: 0,
  numberOfKitchens: 0,
  numberOfToilets: 0,
  numberOfBalconies: 0,
  amenities: [],
  media: [],
};

export default function Step2Block({
  initialValue,
  handleSubmit,
  onPrev,
}: {
  initialValue: Partial<BlockUnitFormSchema>;
  handleSubmit: (data: BlockUnitFormSchema) => void;
  onPrev: () => void;
}) {
  const form = useForm<BlockUnitFormSchema>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: initialValue,
  });

  const { fields } = useFieldArray({
    name: "units",
    control: form.control
  });
  // useFieldArray does not correctly update fields => Bug ???

  function onSubmit(data: BlockUnitFormSchema) {
    console.log(data);
    handleSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-4">
          {/* 1 floor => no need to specify floor */}
          {/* multiple floors => specify floor */}
          {fields.map((unit, index) => (
            <Card
              key={unit.id}
              className="w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{`Phòng ${index+1}`}</CardTitle>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    const current = form.getValues().units;
                    form.setValue("units", [
                      ...current.slice(0, index),
                      ...current.slice(index + 1),
                    ]);
                  }}
                >
                  <IoClose size={16} />
                </Button>
              </CardHeader>
              <CardContent className="flex flex-row justify-between gap-4">
                <div className="grow space-y-4">
                  <div className="flex flex-row justify-between gap-2">
                    <FormField
                      name={`units.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormLabel>Tên phòng</FormLabel>
                          <FormControl>
                            <Input placeholder="Room name" {...field} defaultValue={unit.name} />
                          </FormControl>
                          <FormMessage/>
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
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-xl my-2">Tiện nghi</CardTitle>
                    <Step2Amenities
                      nth={index}
                      control={form.control}
                      // {...useFieldArray({ name: `units.${index}.amenities`, control: form.control })} // render more hooks than during the previous render.
                      getFields={() => form.getValues(`units.${index}.amenities`).map((item, idx) => ({
                        ...item,
                        id: idx.toString(),
                      }))}
                      append={(data) => {
                        const current = form.getValues(`units.${index}.amenities`);
                        console.log([...current, data]);
                        form.setValue(`units.${index}.amenities`, [...current, data])
                      }}
                      remove={(i) => {
                        const current = form.getValues(`units.${index}.amenities`);
                        console.log(current);
                        console.log([
                          ...current.slice(0, i),
                          ...current.slice(i + 1),
                        ])
                        form.setValue(`units.${index}.amenities`, [
                          ...current.slice(0, i),
                          ...current.slice(i + 1),
                        ]);
                      }}
                    />
                  </div>
                </div>
                <div className="grow max-w-[50%]">
                  <Step2MediaUpload
                    accept="image/*"
                    multiple={true}
                    // {...useFieldArray({ name: `units.${index}.media`, control: form.control })} />
                    getFields={() => form.getValues(`units.${index}.media`).map((item, idx) => ({
                      ...item,
                      id: idx.toString(),
                    }))}
                    append={(data) => form.setValue(`units.${index}.media`, [...form.getValues(`units.${index}.media`), data])}
                    remove={(i) => {
                      const current = form.getValues(`units.${index}.media`);
                      console.log(current);
                      console.log([
                        ...current.slice(0, i),
                        ...current.slice(i + 1),
                      ])
                      form.setValue(`units.${index}.media`, [
                        ...current.slice(0, i),
                        ...current.slice(i + 1),
                      ]);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="ghost"
            type="button"
            onClick={() => {
              const current = form.getValues().units;
              const newUnit = current.at(-1) || emptyValue;
              console.log(newUnit);
              form.setValue("units", [
                ...current, 
                newUnit,
              ]);
            }}
          >
            <span className="text-xl mr-2">+</span> Add new room
          </Button>
        </div>
        <div className="flex justify-between w-full mt-4">
          <Button type="button" variant="outline" onClick={onPrev}>Previous</Button>
          <Button type="submit" variant="default">Next</Button>
        </div>
      </form>
    </Form>
  );
}