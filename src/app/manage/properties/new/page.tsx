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
  property: {"name":"Căn hộ chung cư Thống Nhất","fullAddress":"82 Nguyễn Tuân","city":"HN","district":"5","ward":"9339","multiUnit":false,"primaryImage": 1,"placeUrl":"https://maps.app.goo.gl/1HfXsR4d5ZDjrVcW9","description":"<p class=\"ql-align-center\"><strong>Chung cư Thống Nhất</strong></p><p class=\"ql-align-center\"><br></p><p>Nằm tại trung tâm thủ đô Hà Nội, chung cư Thống Nhất là lựa chọn thích hợp chọn làm nơi định cư, thuê văn phòng.</p>","media":[{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","type":"VIDEO"},{"name":"Screenshot from 2024-02-13 17-27-05.png","size":284984,"type":"IMAGE/PNG","url":"blob:http://localhost:3000/46e0db59-e90a-4d42-b139-b13ce5ba936c"},{"name":"Screenshot from 2024-02-08 01-04-44.png","size":490497,"type":"IMAGE/PNG","url":"blob:http://localhost:3000/ed3994db-cc2b-4c04-8a38-c1ddf44dbd0a"},{"name":"Screenshot from 2024-02-05 00-58-33.png","size":674574,"type":"IMAGE/PNG","url":"blob:http://localhost:3000/f838e190-a0ec-4fdc-b9e4-a405b278a67a"},{"name":"Screenshot from 2024-02-03 17-51-08.png","size":552216,"type":"IMAGE/PNG","url":"blob:http://localhost:3000/3417059a-0f70-4a3f-9b86-a63d36f950b5"}],"features":[{"featureId":"1","description":"Bảo vệ 24/7"},{"featureId":"3","description":"Gym love 24"}],"type":"APARTMENT","area":120,"orientation":"se","yearBuilt":2019,"entranceWidth":5,"facade":12,"project":"Thống Nhất Complex","building":"Thống Nhất","lat":20.9972238,"lng":105.8021945},
  units: [{
    name: "Căn hộ chung cư Thống Nhất",
    area: 120,
    numberOfBedrooms: 3,
    numberOfBathrooms: 2,
    numberOfBalconies: 2,
    type: "APARTMENT",
    amenities: [
      {amenityId: "1", description: "Bàn ghế"},
      {amenityId: "2", description: "Tủ lạnh"},
    ],
    media: []
  }],
};

export default function CreatePropertyPage() {
  const [step, setStep] = useState<number>(2);
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);

  const form = useForm<PropertyForm>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
  });

  async function onSubmit(data: PropertyForm) {
    console.log('submit data', step, data);
    if (step < 2) {
      return;
    }
    setOpenUploadDialog(true);
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
          <span className="font-light text-md">Properties /</span>
          <span className="font-bold text-lg"> Add property </span>
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
          <form>
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
                Previous
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={(e) => {
                  switch (step) {
                    case 0:
                      form.trigger('property')
                        .then(res => {
                          if(res) {
                            setStep(step + 1);
                          } else {
                            console.log(form.formState.errors);
                          }
                        });
                      break;
                    case 1:
                      form.trigger('units')
                        .then(res => {
                          if(res) {
                            setStep(step + 1);
                          } else {
                            console.log(form.formState.errors);
                          }
                        });
                      break;
                    default:
                      onSubmit(form.getValues());
                      break;
                  }
                }}
              >
                {step === 2 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Fragment>
  );
}
