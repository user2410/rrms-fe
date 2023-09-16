"use client";

import Step1, { PropertyFormValues } from "@/app/manage/properties/new/step1";
import Step2, { UnitFormValues } from "./step2";
import Summary from "./summary";
import { Separator } from "@/components/ui/separator";
import DetailedStepper from "@/components/ui/stepper/detailed-stepper";
import { useState } from "react";

export interface Result {
  property: PropertyFormValues;
  units: UnitFormValues;
}

export default function CreatePropertyPage() {
  const [step, setStep] = useState<number>(0);
  const [result, setResult] = useState<Result>({} as Result);

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
      <Separator/>
      {
        step === 0 ? (
          <Step1 
            initialData={result.property}
            handleSubmit={(values: PropertyFormValues) => { 
              console.log(values); 
              setResult({ ...result, property: values });
              setStep(step + 1);
            }}
          />
        ) : step === 1 ? (
          <Step2 
            property={result.property}
            onPrev={() => setStep(step - 1)}
            handleSubmit={(values : UnitFormValues) => {
              console.log(values);
              setResult({ ...result, units: values });
              setStep(step + 1);
            }}/>
        ) : step === 2 ? (
          <Summary
            result={result}
            onPrev={() => setStep(step - 1)}
            onSubmit={() => console.log(result)}
          />
        ) : null
      }
    </div>
  )
}
