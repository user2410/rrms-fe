"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import Step2Amenities from "./step2-amenities";
import { Checkbox } from "@/components/ui/checkbox";

const unitFormSchema = z.object({
  units: z.array(
    z.object({
      name: z
        .string()
        .optional(),
      floor: z
        .number()
        .optional(),
      numberOfBedrooms: z
        .number()
        .optional(),
      numberOfToilets: z
        .number()
        .optional(),
      hasBalcony: z
        .boolean()
        .optional(),
      amenities: z
        .array(
          z.object({
            amenityId: z.string(),
            description: z.string().optional(),
          })
        ),
    })
  ),
});

export type RoomUnitFormSchema = z.infer<typeof unitFormSchema>;

export default function Step2Room({
  initialValue,
  handleSubmit,
  onPrev,
}: {
  initialValue: Partial<RoomUnitFormSchema>;
  handleSubmit: (data: RoomUnitFormSchema) => void;
  onPrev: () => void;
}) {
  const form = useForm<RoomUnitFormSchema>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: initialValue,
  });

  function onSubmit(data: RoomUnitFormSchema) {
    console.log(data);
    handleSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Thông tin phòng</CardTitle>
              <CardDescription>Chi tiết về phòng trọ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full flex justify-between gap-2">
                <FormField
                  control={form.control}
                  name="units.0.name"
                  render={({ field }) => (
                    <FormItem className="flex-grow-[2]">
                      <FormLabel>Tên phòng</FormLabel>
                      <FormControl>
                        <Input placeholder="D9-401" {...field} />
                      </FormControl>
                      <FormDescription>Nếu không có, bỏ qua trường này</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="units.0.floor"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Tầng</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full flex justify-between gap-2">
                <FormField
                  control={form.control}
                  name="units.0.numberOfBedrooms"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Số phòng ngủ</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="units.0.numberOfToilets"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Số toilet</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="units.0.hasBalcony"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>
                      Có ban công
                    </FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Tiện nghi</CardTitle>
              <CardDescription>Tiện nghi có sẵn trong phòng trọ</CardDescription>
            </CardHeader>
            <CardContent>
              <Step2Amenities
                nth={0}
                control={form.control}
                getFields={() => form.getValues('units.0.amenities').map((item, idx) => ({
                  ...item,
                  id: idx.toString(),
                }))}
                {...useFieldArray({ name: `units.0.amenities`, control: form.control })}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-between w-full mt-4">
          <Button type="button" variant="outline" onClick={onPrev}>Previous</Button>
          <Button type="submit" variant="default">Next</Button>
        </div>
      </form>
    </Form>
  );
}