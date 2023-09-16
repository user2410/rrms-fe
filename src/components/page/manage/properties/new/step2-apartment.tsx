"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import Step2Amenities from "./step2-amenities";
import Step2NRooms from "./step2-nrooms";

const unitFormSchema = z.object({
  units: z.array(
    z.object({
      building: z
        .string(),
      project: z
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
    })
  ),
});

export type ApartmentUnitFormSchema = z.infer<typeof unitFormSchema>;

export default function Step2Apartment({
  initialValue,
  handleSubmit,
  onPrev,
}: {
  initialValue: Partial<ApartmentUnitFormSchema>;
  handleSubmit: (data: ApartmentUnitFormSchema) => void;
  onPrev: () => void;
}) {
  const form = useForm<ApartmentUnitFormSchema>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: initialValue,
  });

  function onSubmit(data: ApartmentUnitFormSchema) {
    console.log(data);
    handleSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Thông tin về căn hộ</CardTitle>
              <CardDescription>Chi tiết về căn hộ giúp tìm kiếm khi đăng tin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="units.0.building"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Tòa nhà</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Gold Mark City" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="units.0.project"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Dự án</FormLabel>
                    <FormControl>
                      <Input placeholder="Project" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card className="">
            <CardHeader>
              <CardTitle>Phòng</CardTitle>
              <CardDescription>Số phòng trong căn hộ</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Step2NRooms control={form.control} />
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Tiện nghi</CardTitle>
              <CardDescription>Tiện nghi có sẵn trong căn hộ</CardDescription>
            </CardHeader>
            <CardContent>
              <Step2Amenities 
                nth={0} 
                control={form.control}
                getFields={() => form.getValues('units.0.amenities').map((item, idx) => ({
                  ...item,
                  id: idx.toString(),
                }))}
                {...useFieldArray({name: `units.0.amenities`, control: form.control})}
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