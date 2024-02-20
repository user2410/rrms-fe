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
      "name": "Phòng trọ Bình Minh",
      "fullAddress": "Số 10, Đại Cồ Việt",
      "city": "HN",
      "district": "4",
      "ward": "74",
      "multiUnit": true,
      "primaryImage": 0,
      "placeUrl": "https://maps.app.goo.gl/1HfXsR4d5ZDjrVcW9",
      "description": "<p><strong>Phòng trọ Bình Minh giá rẻ cho sinh viên</strong></p><p>Dãy Phòng trọ giá rẻ cao cấp cho sinh viên và người lao động. Các phòng trọ có diện tích từ 20 - 30 m2, có đủ diện tích để sinh hoạt, làm việc, học tập. Tọa lạc tại Số 10 Đại Cồ Việt, nhà trọ gần các trường đại học lớn (Bách Khoa, Xây Dựng), thuận tiện cho việc đi lại của sinh viên.</p>",
      "media": [
          {
              "name": "Screenshot from 2024-02-13 17-27-05.png",
              "size": 284984,
              "type": "IMAGE/PNG",
              "url": "blob:http://localhost:3000/dfd40fb6-caef-43c4-bded-12d3d4d4bc11",
              "description": "Phòng ngủ"
          },
          {
              "name": "Screenshot from 2024-02-05 00-58-33.png",
              "size": 674574,
              "type": "IMAGE/PNG",
              "url": "blob:http://localhost:3000/368a4c46-287e-4acf-a72f-40deeeca77be",
              "description": "Phòng khách 1"
          },
          {
              "name": "Screenshot from 2024-02-03 17-51-08.png",
              "size": 552216,
              "type": "IMAGE/PNG",
              "url": "blob:http://localhost:3000/f4e7db39-2c9d-427b-80fc-de17d6f2ab15",
              "description": "Phòng khách 2"
          }
      ],
      "features": [
          {
              "featureId": "8",
              "description": "Bãi đỗ xe mở dưới sân trước khu, đủ chỗ cho 40 xe máy"
          },
          {
              "featureId": "1",
              "description": "Bảo vệ 24/7"
          }
      ],
      "type": "ROOM",
      "area": 30,
      "lat": 20.9972238,
      "lng": 105.8021945
  },
  "units": [
      {
          "name": "201",
          "type": "ROOM",
          "amenities": [
              {
                  "amenityId": "1",
                  "description": "Sàn gỗ và bàn ghế gỗ"
              },
              {
                  "amenityId": "4",
                  "description": "Máy giạt Panasonic"
              }
          ],
          "media": [
              {
                  "name": "Screenshot from 2024-02-03 17-28-09.png",
                  "size": 532174,
                  "type": "IMAGE/PNG",
                  "url": "blob:http://localhost:3000/56eec3a2-c9c6-4f91-9b4e-cd85157abfb7"
              },
              {
                  "name": "421104767_1113507463014805_3893774932420359370_n.jpg",
                  "size": 83165,
                  "type": "IMAGE/JPEG",
                  "url": "blob:http://localhost:3000/4daf7e44-80d4-4d27-9e15-c0872b299ec7"
              },
              {
                  "name": "140212504_1848317805325995_4597924637237713222_n.jpg",
                  "size": 109721,
                  "type": "IMAGE/JPEG",
                  "url": "blob:http://localhost:3000/bd093de0-ea05-4d19-a4b5-31a57f7a2750"
              }
          ],
          "area": 20,
          "floor": 2
      },
      {
          "name": "202",
          "type": "ROOM",
          "amenities": [
              {
                  "amenityId": "1",
                  "description": "Sàn gỗ và bàn ghế gỗ"
              },
              {
                  "amenityId": "4",
                  "description": "Máy giạt Panasonic"
              }
          ],
          "media": [
              {
                  "name": "Screenshot from 2024-02-01 01-02-14.png",
                  "size": 89492,
                  "type": "IMAGE/PNG",
                  "url": "blob:http://localhost:3000/6cc90e32-0099-40cb-bc0c-03fbe7aeb048"
              },
              {
                  "name": "Screenshot from 2024-02-01 00-56-39.png",
                  "size": 224979,
                  "type": "IMAGE/PNG",
                  "url": "blob:http://localhost:3000/3b08dabc-5cce-473d-9715-4f6ccfca880f"
              },
              {
                  "name": "Screenshot from 2024-02-01 00-56-26.png",
                  "size": 231868,
                  "type": "IMAGE/PNG",
                  "url": "blob:http://localhost:3000/37864c47-de6a-4a63-b1a8-bd246315abcd"
              }
          ],
          "area": 20,
          "floor": 2
      },
      {
          "name": "301",
          "type": "ROOM",
          "amenities": [
              {
                  "amenityId": "1",
                  "description": "Sàn gỗ và bàn ghế gỗ"
              },
              {
                  "amenityId": "4",
                  "description": "Máy giạt Panasonic"
              }
          ],
          "media": [
              {
                  "name": "Screenshot from 2024-01-11 12-29-15.png",
                  "size": 169081,
                  "type": "IMAGE/PNG",
                  "url": "blob:http://localhost:3000/e1225503-1bec-4c0f-af05-f1790044f4c0"
              },
              {
                  "name": "Screenshot from 2024-01-11 12-29-10.png",
                  "size": 181904,
                  "type": "IMAGE/PNG",
                  "url": "blob:http://localhost:3000/3aba727f-a0a3-4a5e-bce0-a2b0f81b3fb6"
              },
              {
                  "name": "Screenshot from 2024-01-11 11-57-16.png",
                  "size": 114953,
                  "type": "IMAGE/PNG",
                  "url": "blob:http://localhost:3000/337d31f2-138d-429d-88e4-1a28f91cb674"
              }
          ],
          "area": 25,
          "floor": 3
      },
      {
          "name": "302",
          "type": "STUDIO",
          "amenities": [
              {
                  "amenityId": "1",
                  "description": "Sàn gỗ và bàn ghế gỗ"
              },
              {
                  "amenityId": "4",
                  "description": "Máy giạt Panasonic"
              }
          ],
          "media": [
              {
                  "name": "Screenshot from 2023-12-19 12-42-31.png",
                  "size": 68083,
                  "type": "IMAGE/PNG",
                  "url": "blob:http://localhost:3000/01c9db4a-7143-4138-9c3b-073937092a40"
              },
              {
                  "name": "Screenshot from 2023-12-19 09-17-56.png",
                  "size": 256159,
                  "type": "IMAGE/PNG",
                  "url": "blob:http://localhost:3000/3e1fd6c3-c233-4fce-ad05-c1df49331bfa"
              },
              {
                  "name": "Screenshot from 2023-12-18 23-40-23.png",
                  "size": 475536,
                  "type": "IMAGE/PNG",
                  "url": "blob:http://localhost:3000/e1752326-9a14-4340-aa8f-69d873ef4d3d"
              }
          ],
          "area": 26,
          "floor": 3
      }
  ]
};

export default function CreatePropertyPage() {
  const [step, setStep] = useState<number>(2);
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
