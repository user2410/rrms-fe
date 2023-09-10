"use client";

import Step1, { PropertyFormValues } from "@/components/page/manage/properties/new/step1";
import { Separator } from "@/components/ui/separator";
import DetailedStepper from "@/components/ui/stepper/detailed-stepper";

export default function CreatePropertyPage() {
  // function onSubmit(values: PropertyFormValues) {
  //   console.log(values);
  // }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="">
        <span className="font-light text-md">Properties /</span>
        <span className="font-bold text-lg"> Add property </span>
      </div>
      <DetailedStepper
        steps={[
          {
            title: "Property basic info",
            description: "Basic info of your property",
          },
          {
            title: "Inside your property",
            description: "Inside your property",
          },
          {
            title: "Summary",
          },
        ]}
        currentStep={0}
      />
      <Separator/>
      <Step1 handleSubmit={(values: PropertyFormValues) => { console.log(values); } }/>
    </div>
  )
}