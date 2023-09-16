"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import Step2Amenities from "./step2-amenities";
import Step2NRooms from "./step2-nrooms";

const unitFormSchema = z.object({
  units: z.array(
    z.object({
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

export type SRUnitFormSchema = z.infer<typeof unitFormSchema>;

export default function Step2SR({
  initialValue,
  handleSubmit,
  onPrev,
}: {
  initialValue: Partial<SRUnitFormSchema>;
  handleSubmit: (data: SRUnitFormSchema) => void;
  onPrev: () => void;
}) {
  const form = useForm<SRUnitFormSchema>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: initialValue,
  });

  function onSubmit(data: SRUnitFormSchema) {
    console.log(data);
    handleSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Phòng</CardTitle>
              <CardDescription>Số phòng trong nhà</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Step2NRooms control={form.control} />
            </CardContent>
          </Card>
          <Card className="">
            <CardHeader>
              <CardTitle>Tiện nghi</CardTitle>
              <CardDescription>Tiện nghi có sẵn trong nhà</CardDescription>
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