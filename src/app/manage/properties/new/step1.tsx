"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Step1Address from "@components/page/manage/properties/new/step1-address";
import Step1BasicInfo from "@components/page/manage/properties/new/step1-basicinfo";
import Step1ExtraInfo from "@components/page/manage/properties/new/step1-extrainfo";
import Step1MediaUpload from "@components/page/manage/properties/new/step1-mediaupload";
import { Step1Tag } from "@components/page/manage/properties/new/step1-tag";
import { Form } from "@components/ui/form";
import { Button } from "@components/ui/button";
import { GoogleMap } from "@react-google-maps/api";
import Step1Features from "@/components/page/manage/properties/new/step1-features";

const propertyFormSchema = z.object({
  name: z
    .string()
    .min(3, "Property name must be at least 3 characters long")
    .max(30, "Property name must be at most 50 characters long"),
  type: z
    .string({
      required_error: "Please select a property type",
    }),
  numberOfFloors: z
    .number(),
  area: z
    .number()
    .min(1, "Area must be at least 1"),
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
  city: z
    .string(),
  district: z
    .string(),
  ward: z
    .string(),
  placeUrl: z
    .string(),
  lat: z
    .number()
    .optional(),
  lng: z
    .number()
    .optional(),
  orientation: z
    .string()
    .optional(),
  entranceWidth: z
    .number()
    .optional(),
  facade: z
    .number()
    .optional(),
  yearBuilt: z
    .number(),
  features: z
    .array(
      z.object({
        featureId: z.string(),
        description: z.string().optional(),
      })
    ),
  tags: z
    .array(
      z.object({
        tag: z.string(),
      })
    )
    .optional(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export default function Step1({
  initialData,
  handleSubmit,
} : {
  initialData: Partial<PropertyFormValues>;
  handleSubmit: (values: PropertyFormValues) => void;
}) {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: initialData,
  });

  function onSubmit(values: PropertyFormValues) {
    handleSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Thông tin cơ bản về bất động sản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Step1BasicInfo form={form} />
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Địa chỉ</CardTitle>
              <CardDescription>Thông tin chi tiết địa chỉ của bất động sản</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Step1Address form={form} />
            </CardContent>
          </Card>
          <Card className="xl:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Hình ảnh, video về bất động sản</CardDescription>
            </CardHeader>
            <CardContent>
              <Step1MediaUpload
                accept="image/*"
                multiple={true}
                form={form} />
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Thông tin thêm</CardTitle>
              <CardDescription>Giúp nhận diện bất động sản của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <Step1ExtraInfo form={form} />
            </CardContent>
          </Card>
          <Card className="xl:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>Tiện ích</CardTitle>
              <CardDescription>Một số tiện ích, đặc điểm nổi bật của bất động sản</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Step1Features form={form} />
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Sắp xếp</CardTitle>
              <CardDescription>Thêm thông tin tùy chỉnh mô tả bất động sản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Step1Tag form={form} />
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-between w-full mt-4">
          <Button type="button" disabled variant="outline">Previous</Button>
          <Button type="submit" variant="default">Next</Button>
        </div>
      </form>
    </Form>
  );
}
