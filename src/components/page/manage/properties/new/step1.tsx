"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Step1Address from "./step1-address";
import Step1BasicInfo from "./step1-basicinfo";
import Step1ExtraInfo from "./step1-extrainfo";
import Step1MediaUpload from "./step1-mediaupload";
import { Step1Tag } from "./step1-tag";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const propertyFormSchema = z.object({
  name: z
    .string()
    .min(3, "Property name must be at least 3 characters long")
    .max(30, "Property name must be at most 50 characters long"),
  type: z
    .string({
      required_error: "Please select a property type",
    }),
  area: z
    .number()
    .min(1, "Area must be at least 1")
  ,
  description: z
    .string()
    .optional(),
  media: z
    .array(
      z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
        url: z.string(),
      })
    )
    .nonempty(),
  fullAddress: z
    .string({
      required_error: "Please enter your property address",
    }),
  district: z
    .string(),
  city: z
    .string(),
  orientation: z
    .string(),
  yearBuilt: z
    .number(),
  features: z
    .array(
      z.object({
        featureId: z.string(),
        description: z.string(),
      })
    ),
  tags: z
    .array(
      z.object({
        tag: z.string(),
      })
    ),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const defaultValues: Partial<PropertyFormValues> = {
  features: [
    { featureId: "1", description: "lorem ipsum" },
    { featureId: "2", description: "emet dolores" },
  ]
};

export default function Step1({
  handleSubmit,
} : {
  handleSubmit: (values: PropertyFormValues) => void;
}) {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
  });

  function onSubmit(values: PropertyFormValues) {
    handleSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          <Card className="xl:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>Basic info</CardTitle>
              <CardDescription>Basic info of your property</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Step1BasicInfo form={form} />
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Address</CardTitle>
              <CardDescription>Address info of your property</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Step1Address form={form} />
            </CardContent>
          </Card>
          <Card className="xl:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Media info of your property</CardDescription>
            </CardHeader>
            <CardContent>
              <Step1MediaUpload
                accept="image/*"
                multiple={true}
                form={form} />
            </CardContent>
          </Card>
          <Card className="xl:row-span-2 shadow-md">
            <CardHeader>
              <CardTitle>Organize</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Step1Tag form={form} />
            </CardContent>
          </Card>
          <Card className="xl:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>Additional info</CardTitle>
              <CardDescription>Extra information helps others recognize your property</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Step1ExtraInfo form={form} />
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-between w-full mt-4">
          <Button type="button" variant="outline">Previous</Button>
          <Button type="submit" variant="default">Next</Button>
        </div>
      </form>
    </Form>
  );
}