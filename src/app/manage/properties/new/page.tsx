"use client";

import Step1 from "@/app/manage/properties/new/step1";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import DetailedStepper from "@/components/ui/stepper/detailed-stepper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useState } from "react";
import { DeepPartial, useForm } from "react-hook-form";
import * as z from "zod";
import UploadDialog from "./_components/upload-dialog";
import Step2 from "./step2";
import Summary from "./summary";

const propertyFormSchema = z.object({
  property: z.object({
    name: z
      .string()
      .min(3, "Tên nhà cho thuê phải có ít nhất 3 ký tự")
      .max(30, "Tên nhà cho thuê không được quá 30 ký tự"),
    type: z
      .string({
        required_error: "Xin hãy chọn loại nhà cho thuê",
      }),
    multiUnit: z
      .boolean(),
    building: z
      .string()
      .optional(),
    project: z
      .string()
      .optional(),
    numberOfFloors: z
      .number()
      .optional(),
    area: z
      .number()
      .min(1, "Diện tích không hợp lệ")
      .optional(),
    description: z
      .string(),
    media: z
      .array(
        z.object({
          name: z.string().optional(),
          size: z.number().optional(),
          type: z.string(),
          url: z.string(),
          description: z.string().max(30).optional(),
        })
      )
      .max(24)
      .min(4)
      .nonempty(),
    primaryImage: z
      .number(),
    fullAddress: z
      .string({
        required_error: "Xin hãy nhập địa chỉ",
      }),
    city: z
      .string(),
    district: z
      .string(),
    ward: z
      .string()
      .optional(),
    placeUrl: z
      .string(),
    lat: z
      .number(),
    lng: z
      .number(),
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
      .number()
      .optional(),
    features: z
      .array(
        z.object({
          featureId: z.string(),
          description: z.string().optional(),
        })
      ),
  }),
  units: z.array(
    z.object({
      name: z
        .string(),
      area: z
        .number(),
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
      hasBalcony: z
        .boolean()
        .optional(),
      type: z
        .string(),
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
            description: z.string().max(30).optional(),
          })
        )
        .max(3, "Tối đa 3 ảnh"),
    })
  ),
});

export type PropertyForm = z.infer<typeof propertyFormSchema>;

const defaultValues: DeepPartial<PropertyForm> = {
  "property": {
    "name": "",
    "fullAddress": "",
    "multiUnit": false,
    "primaryImage": 0,
    "placeUrl": "",
    "description": "",
    "media": [],
    "features": [],
  },
  "units": [],
};

export default function CreatePropertyPage() {
  const [step, setStep] = useState<number>(0);
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);

  const form = useForm<PropertyForm>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
  });

  function onSubmit(data: PropertyForm) {
    console.log('submit data', step, data);
    if (step < 2) {
      return;
    }
    setOpenUploadDialog(true);
  }

  function handleNext() {
    switch (step) {
      case 0:
        form.trigger('property')
          .then(res => {
            if (res) {
              setStep(step + 1);
            } else {
              console.log(form.formState.errors);
            }
          });
        break;
      case 1:
        form.trigger('units')
          .then(res => {
            if (res) {
              setStep(step + 1);
            } else {
              console.log(form.formState.errors);
            }
          });
        break;
      default:
    }
  }

  return (
    <Fragment>
      <UploadDialog
        form={form}
        open={openUploadDialog}
        changeOpen={() => setOpenUploadDialog(v => !v)}
      />
      <div className="container mx-auto py-10 space-y-8">
        <div className="">
          <span className="font-light text-md">Nhà cho thuê /</span>
          <span className="font-bold text-lg"> Tạo nhà cho thuê mới </span>
        </div>
        <DetailedStepper
          steps={[
            {
              title: "Tổng quan",
              description: "Thông tin cơ bản về nhà cho thuê của bạn",
            },
            {
              title: "Đơn vị Căn hộ / Phòng trọ",
              description: "Thông tin quỹ căn hộ / dãy phòng trọ",
            },
            {
              title: "Tổng kết",
            },
          ]}
          currentStep={step}
        />
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {
              step === 0 ? (
                <Step1 />
              ) : step === 1 ? (
                <Step2 />
              ) : step === 2 ? (
                <Summary />
              ) : null
            }
            <div className="flex justify-between w-full mt-4">
              <Button
                type="button"
                disabled={step === 0}
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Quay lại
              </Button>
              {step < 2 && (
                <Button type="button" onClick={handleNext}>Tiếp tục</Button>
              )}
              {step === 2 && (
                <Button type="submit">Hoàn tất</Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </Fragment>
  );
}
