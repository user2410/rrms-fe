"use client";

import Step1 from "@/app/manage/properties/new/step1";
import Step2 from "./step2";
import Summary from "./summary";
import { Separator } from "@/components/ui/separator";
import DetailedStepper from "@/components/ui/stepper/detailed-stepper";
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const propertyFormSchema = z.object({
  property: z.object({
    name: z
      .string()
      .min(3, "Property name must be at least 3 characters long")
      .max(30, "Property name must be at most 50 characters long"),
    type: z
      .string({
        required_error: "Please select a property type",
      }),
    building: z
      .string()
      .optional(),
    project: z
      .string()
      .optional(),
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
          name: z.string().optional(),
          size: z.number().optional(),
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
    tags: z
      .array(
        z.object({
          tag: z.string(),
        })
      )
      .optional(),
  }),
  units: z.array(
    z.object({
      name: z
        .string()
        .optional(),
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
      amenities: z
        .array(
          z.object({
            amenityId: z.string(),
            description: z.string().optional(),
          })
        )
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
        .optional(),
    })
  ),
})

export type PropertyForm = z.infer<typeof propertyFormSchema>;

export default function CreatePropertyPage() {
  const [step, setStep] = useState<number>(0);

  const form = useForm<PropertyForm>({
    resolver: zodResolver(propertyFormSchema),
  });

  function onSubmit(data: PropertyForm) {
    console.log(data);
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="">
        <span className="font-light text-md">Properties /</span>
        <span className="font-bold text-lg"> Add property </span>
      </div>
      <DetailedStepper
        steps={[
          {
            title: "Tổng quan",
            description: "Thông tin cơ bản về bất động sản của bạn",
          },
          {
            title: "Chi tiết",
            description: "Thông tin chi tiết về bất động sản của bạn",
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
              <Step1/>
            ) : step === 1 ? (
              <Step2/>
            ) : step === 2 ? (
              <Summary/>
            ) : null
          }
          <div className="flex justify-between w-full mt-4">
            <Button 
              type="button" 
              disabled={step === 0}
              variant="outline"
              onClick={() => setStep(step-1)}
            >
              Previous
            </Button>
            <Button 
              type={step === 2 ? "submit" : "button"} 
              variant="default"
              onClick={(e) => {
                switch(step) {
                  case 0:
                    form.trigger('property')
                      .then(res => {
                        if(res) {
                          form.setValue(
                            'units', 
                            [['BLOCK', 'COMPLEX'].includes(form.getValues('property.type')) 
                              ? ({} as any) 
                              : ({area: form.getValues('property.area')} as any)
                            ]
                          );
                          setStep(step+1);
                        } else {
                          setStep(step);
                        }
                        console.log(form.getValues());
                      });
                    break;
                  case 1:
                    form.trigger('units')
                      .then(res => setStep(res ? (step+1) : step));
                    break;
                  default:
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
  )
}
