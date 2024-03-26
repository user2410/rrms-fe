"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import DetailedStepper from "@/components/ui/stepper/detailed-stepper";
import { backendAPI } from "@/libs/axios";
import { PreRental } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import CreateContract from "./_components/create_contract";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useSearchParams } from "next/navigation";
import { Session } from "next-auth";

const formSchema = z.object({
  applicationId: z.string(),
  propertyId: z.string(),
  contractType: z.string(),
  contractContent: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

export default function NewRentalPage() {
  const searchParams = useSearchParams();
  const session = useSession();

  const query = useQuery<PreRental | null>({
    queryKey: ["manage", "rentals", "new", "application", searchParams?.get("id"), "prerental", "applicationId"],
    queryFn: async ({ queryKey }) => {
      const res = await backendAPI.get<PreRental | null>(`/api/prerentals/prerental/${queryKey.at(4)}`, {
        headers: {
          Authorization: `Bearer ${session.data!.user.accessToken}`,
        },
        validateStatus: (status) => status === 200 || status === 404,
      });
      return res.data;
    },
    enabled: session.status === "authenticated",
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <div className="container py-10 space-y-4">
      <h1 className="text-2xl font-medium">Tạo mới thông tin thuê nhà</h1>
      {query.isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : query.isError ? (
        <div className="flex justify-center">
          <p>Đã có lỗi xảy ra</p>
        </div>
      ) : query.data ? (
        <PreRentalForm data={query.data} sessionData={session.data!}/>
      ) : (
        <div className="flex justify-center">
          <Button type="button">Bắt đầu tạo thông tin thuê nhà</Button>
        </div>
      )}
    </div>
  );
}

function PreRentalForm({
  data,
  sessionData,
} : {
  data: PreRental;
  sessionData: Session;
}) {
  const [step, setStep] = useState<number>(2);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <div>
      <div className="space-y-4">
        <DetailedStepper
          steps={[
            {
              title: "Tổng quan",
              description: "Thông tin liên quan đến quá trình cho thuê",
            },
            {
              title: "Hợp đồng",
              description: "Chi tiết hợp đồng thuê nhà",
            },
            {
              title: "Tổng kết",
            },
          ]}
          currentStep={step}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === 0 ? (
              <></>
            ) : step === 1 ? (
              <></>
            ) : step === 2 ? (
              <CreateContract 
                sessionData={sessionData}
                preRental={data} />
            ) : (
              <></>
            )}
          </form>
        </Form>
      </div>
      <div className="flex justify-between w-full mt-4">
        {step > 0 && (
          <Button type="button" onClick={() => setStep(step - 1)}>Quay lại</Button>
        )}
        {step < 2 && (
          <Button type="button" onClick={() => setStep(step + 1)}>Tiếp tục</Button>
        )}
      </div>
    </div>
  );
}
