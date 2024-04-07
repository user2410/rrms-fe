"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import DetailedStepper from "@/components/ui/stepper/detailed-stepper";
import { backendAPI } from "@/libs/axios";
import { Application } from "@/models/application";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { User } from "@/models/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Baseprice from "./_components/baseprice";
import BasicServices from "./_components/basic_services";
import ExtraServices from "./_components/extra_services";
import TenantDetails from "./_components/tenant_details";
import { DataProvider, RentalData, useDataCtx } from "./_context/data.context";
import UploadDialog from "./_components/upload-dialog";

const formSchema = z.object({
  applicationId: z.number().optional(),
  tenantId: z.string().optional(),
  propertyId: z.string(),
  unitId: z.string(),
  
  organizationName: z.string().optional(),
  organizationHqAddress: z.string().optional(),
  
  tenantType: z.enum(['INDIVIDUAL', 'ORGANIZATION']),
  profileImage: z.object({
    url: z.string(),
    name: z.string().optional(),
    size: z.number().optional(),
    type: z.string().optional(),
  }),
  tenantName: z.string(),
  tenantDob: z.date(),
  tenantPhone: z.string(),
  tenantEmail: z.string(),
  coaps: z.array(z.object({
    fullName: z.string(),
    dob: z.date(),
    job: z.string(),
    income: z.number().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    description: z.string().optional(),
  })),
  minors: z.array(z.object({
    fullName: z.string(),
    dob: z.date(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    description: z.string().optional(),
  })),
  pets: z.array(z.object({
    type: z.string(),
    weight: z.number().optional(),
    description: z.string().optional(),
  })),

  startDate: z.date(),
  moveinDate: z.date(),

  rentalPeriod: z.number(),
  rentalPrice: z.number(),
  rentalIntention: z.string(),
  deposit: z.number(),
  depositPaid: z.boolean(),

  electricityPaymentType: z.enum(["RETAIL", "FIXED"]),
  electricityPrice: z.number().optional(),
  waterPaymentType: z.enum(["RETAIL", "FIXED"]),
  waterPrice: z.number().optional(),

  services: z.array(z.object({
    name: z.string(),
    setupBy: z.enum(["LANDLORD", "TENANT"]),
    provider: z.string().optional(),
    price: z.number().optional(),
  })),
  note: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export default function NewRentalPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams?.get("applicationId");
  const propertyId = searchParams?.get("propertyId");
  const unitId = searchParams?.get("unitId");
  const session = useSession();

  const query = useQuery<RentalData>({
    queryKey: ["manage", "rentals", "new", "rental", applicationId, propertyId, unitId],
    queryFn: async ({ queryKey }) => {
      var application: Application | undefined;
      if (queryKey.at(4)) {
        application = (await backendAPI.get<Application>(`/api/applications/application/${queryKey.at(4)}`, {
          headers: {
            Authorization: `Bearer ${session.data!.user.accessToken}`,
          },
        })).data;
      }

      const property = (await backendAPI.get<Property>(`/api/properties/property/${queryKey.at(5)}`, {
        headers: {
          Authorization: `Bearer ${session.data!.user.accessToken}`,
        },
      })).data;

      const unit = (await backendAPI.get<Unit>(`/api/units/unit/${queryKey.at(6)}`, {
        headers: {
          Authorization: `Bearer ${session.data!.user.accessToken}`,
        },
      })).data;

      const userIds: string[] = [...property.managers.map(pm => pm.managerId)];
      if (application && application?.creatorId !== '00000000-0000-0000-0000-000000000000') {
        userIds.push(application.creatorId);
      }
      const users = (await backendAPI.get<User[]>("/api/auth/credential/ids", {
        params: {
          ids: userIds,
        },
        headers: {
          Authorization: `Bearer ${session.data!.user.accessToken}`,
        },
      })).data;

      return {
        application,
        property,
        unit,
        tenant: users.find(u => (u.id === application?.creatorId)),
        owners: users.filter(u => property.managers.find(m => m.managerId === u.id && m.role === "OWNER")),
        managers: users.filter(u => property.managers.find(m => m.role === "MANAGER" && m.managerId === u.id)),
      } as RentalData;
    },
    enabled: session.status === "authenticated",
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });

  return (
    <div className="container py-10 space-y-4">
      <h1 className="text-2xl font-medium">Tạo mới thông tin thuê nhà</h1>
      {query.isLoading ? (
        <div className="flex flex-row items-center justify-center">
          <Spinner size={24} />
        </div>
      ) : query.isError ? (
        <div className="flex flex-row items-center justify-center">
          <p>Đã có lỗi xảy ra</p>
        </div>
      ) : (
        <DataProvider>
          <RentalForm data={query.data} sessionData={session.data!} />
        </DataProvider>
      )}
    </div>
  );
}

function RentalForm({
  data,
  sessionData,
}: {
  data: RentalData;
  sessionData: Session;
}) {
  const { application, property, unit, tenant } = data;
  const [step, setStep] = useState<number>(0);
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);
  const dataCtx = useDataCtx();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyId: property.id,
      unitId: unit.id,
      applicationId: application?.id,

      profileImage: {
        url: application?.profileImage,
      },
      tenantId: application?.creatorId ? application.creatorId : undefined,
      tenantType: application?.tenantType ? application.tenantType : "INDIVIDUAL",
      tenantName: application ? application?.fullName : tenant ? `${tenant.firstName} ${tenant.lastName}` : "",
      tenantDob: application?.dob && new Date(application.dob),
      tenantPhone: application ? application?.phone : tenant?.phone,
      tenantEmail: application ? application?.email : tenant?.email,
      organizationName: application?.organizationName ? application.organizationName : undefined,
      organizationHqAddress: application?.organizationHqAddress ? application.organizationHqAddress : undefined,
      coaps: application?.coaps && application.coaps.map(m => ({
        ...m,
        dob: new Date(m.dob),
      })),
      minors: application?.minors && application.minors.map(m => ({
        ...m,
        dob: new Date(m.dob),
        email: m.email ? m.email : undefined,
        phone: m.phone ? m.phone : undefined,
        description: m.description ? m.description : undefined,
      })),
      pets: application?.pets,

      rentalPrice: application?.offeredPrice,
      rentalIntention: application?.rentalIntention,
      depositPaid: false,
      
      services: [],
    },
  });

  useEffect(() => {
    dataCtx.setRentalData(data);
  }, []);

  function onSubmit(data: FormValues) {
    console.log("submitting data:", data);
    setOpenUploadDialog(true);
  }

  return (
    <>
      <UploadDialog
        form={form}
        open={openUploadDialog}
        changeOpen={() => setOpenUploadDialog(v => !v)}
        sessionData={sessionData}
      />
      <div className="space-y-4">
        <DetailedStepper
          steps={[
            {
              title: "Bên thuê",
              description: "Đại diện bên thuê",
            },
            {
              title: "Chi phí",
              description: "Chi phí khách thuê nhà chi trả ",
            },
          ]}
          currentStep={step}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === 0 ? (
              <TenantDetails />
            ) : step === 1 ? (
              <div className="space-y-4">
                <Baseprice />
                <BasicServices />
                <ExtraServices />
              </div>
            ) : null}
          <div className="flex justify-between w-full mt-4">
            <Button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={step <= 0}
            >
              Quay lại
            </Button>
            {step < 1 && (
              <Button
                type="button"
                onClick={(e) => setStep(step + 1)}
              >
                Tiếp tục
              </Button>
            )}
            {/* {JSON.stringify(form.formState.errors)} */}
            {step === 1 && (
              <Button type="submit">Hoàn tất</Button>
            )}
          </div>
          </form>
        </Form>
      </div>
    </>
  );
}