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
import { DataProvider, useDataCtx } from "./_context/data.context";
import UploadDialog from "./_components/upload-dialog";
import OtherPolicies from "./_components/other_policies";
import toast from "react-hot-toast";
import { getMessages } from "@/utils/error";
import PropertySelection from "./_components/property";
import ExtendLease from "./_components/extend_lease";

const formSchema = z.object({
  applicationId: z.number().optional(),
  application: z.any().optional(),
  tenantId: z.string().optional(),
  propertyId: z.string(),
  property: z.any(),
  unitId: z.string(),
  unit: z.any(),
  users: z.array(z.any()).optional(),

  tenant: z.object({
    organizationName: z.string().optional(),
    organizationHqAddress: z.string().optional(),
    tenantType: z.enum(['INDIVIDUAL', 'FAMILY', 'ORGANIZATION']),
    profileImage: z.object({
      url: z.string(),
      name: z.string().optional(),
      size: z.number().optional(),
      type: z.string().optional(),
    }),
    tenantName: z.string(),
    // tenantDob: z.date(),
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
    })).optional(),
    minors: z.array(z.object({
      fullName: z.string(),
      dob: z.date(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      description: z.string().optional(),
    })).optional(),
    pets: z.array(z.object({
      type: z.string(),
      weight: z.number().optional(),
      description: z.string().optional(),
    })).optional(),

    startDate: z.date(),
    moveinDate: z.date(),
    rentalPeriod: z.number(),
    rentalIntention: z.string(),
  }),

  services: z.object({
    paymentType: z.enum(['PREPAID', 'POSTPAID']),
    rentalPrice: z.number(),
    rentalPaymentBasis: z.number(),
    deposit: z.number(),
    depositPaid: z.boolean(),

    electricitySetupBy: z.enum(["LANDLORD", "TENANT"]),
    electricityPaymentType: z.enum(["RETAIL", "FIXED"]).optional(),
    electricityCustomerCode: z.string().optional(),
    electricityProvider: z.string().optional(),
    electricityPrice: z.number().optional(),
    waterSetupBy: z.enum(["LANDLORD", "TENANT"]),
    waterPaymentType: z.enum(["RETAIL", "FIXED"]).optional(),
    waterCustomerCode: z.string().optional(),
    waterProvider: z.string().optional(),
    waterPrice: z.number().optional(),
    services: z.array(z.object({
      name: z.string(),
      setupBy: z.enum(["LANDLORD", "TENANT"]),
      provider: z.string().optional(),
      price: z.number().optional(),
    })),
  }),

  noticePeriod: z.number().min(0).optional(),
  policies: z.object({
    policies: z.array(z.object({
      title: z.string(),
      content: z.string(),
    }))
  }),

  note: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

type Data = {
  application?: Application;
  property?: Property;
  unit?: Unit;
  tenant?: User;
  users: User[];
  owners: User[];
  managers: User[];
};

export default function NewRentalPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams?.get("applicationId");
  const propertyId = searchParams?.get("propertyId");
  const unitId = searchParams?.get("unitId");
  const session = useSession();

  const query = useQuery<Data>({
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

      const property = queryKey.at(5) ? (await backendAPI.get<Property>(`/api/properties/property/${queryKey.at(5)}`, {
        headers: {
          Authorization: `Bearer ${session.data!.user.accessToken}`,
        },
      })).data : undefined;

      const unit = queryKey.at(6) ? (await backendAPI.get<Unit>(`/api/units/unit/${queryKey.at(6)}`, {
        headers: {
          Authorization: `Bearer ${session.data!.user.accessToken}`,
        },
      })).data : undefined;

      let users: User[] = [];
      let owners: User[] = [], managers: User[] = [];
      let tenant: User | undefined;
      if (property) {
        const userIds: string[] = [...property.managers.map(pm => pm.managerId)];
        if (application && application?.creatorId !== '00000000-0000-0000-0000-000000000000') {
          userIds.push(application.creatorId);
        }
        users = (await backendAPI.get<User[]>("/api/auth/credential/ids", {
          params: {
            ids: userIds,
          },
          headers: {
            Authorization: `Bearer ${session.data!.user.accessToken}`,
          },
        })).data;
        tenant = users.find(u => (u.id === application?.creatorId));
        owners = users.filter(u => property.managers.find(m => m.managerId === u.id && m.role === "OWNER"));
        managers = users.filter(u => property.managers.find(m => m.role === "MANAGER" && m.managerId === u.id));
      } else {
        users = [];
      }

      return {
        application,
        property,
        unit,
        tenant,
        users,
        owners,
        managers,
      } as Data;
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
  data: Data;
  sessionData: Session;
}) {
  const { application, property, unit, tenant, users } = data;
  // const [step, setStep] = useState<number>(3);
  const [step, setStep] = useState<number>((property && unit) ? 1 : 0);
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);
  const dataCtx = useDataCtx();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyId: property?.id ?? "",
      property,
      unitId: unit?.id ?? "",
      unit,
      applicationId: application?.id,
      tenantId: application?.creatorId,
      users,

      tenant: {
        profileImage: {
          url: application?.profileImage,
        },
        tenantType: application?.tenantType ? application.tenantType : "INDIVIDUAL",
        tenantName: application ? application?.fullName : tenant ? `${tenant.firstName} ${tenant.lastName}` : "",
        // tenantDob: application?.dob && new Date(application.dob),
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

        rentalIntention: application?.rentalIntention,
        rentalPeriod: application?.preferredTerm,
      },

      services: {
        paymentType: 'POSTPAID',
        rentalPaymentBasis: 1,
        rentalPrice: application?.offeredPrice,
        depositPaid: false,
        services: [],
      }
    },
    // defaultValues: {
    //   "propertyId": "6bdca7ac-a3d9-4fc8-87b2-4435665fd423",
    //   "property": {
    //     "id": "6bdca7ac-a3d9-4fc8-87b2-4435665fd423",
    //     "creatorId": "00000000-0000-0000-0000-000000000000",
    //     "name": "Phòng trọ Bình Minh",
    //     "building": null,
    //     "project": null,
    //     "area": 20,
    //     "numberOfFloors": null,
    //     "yearBuilt": 2019,
    //     "orientation": "s",
    //     "entranceWidth": null,
    //     "facade": null,
    //     "fullAddress": "82 Nguyễn Tuân",
    //     "district": "",
    //     "city": "",
    //     "ward": null,
    //     "lat": 20.9972238,
    //     "lng": 105.8021945,
    //     "primaryImage": 27319,
    //     "description": null,
    //     "type": "ROOM",
    //     "isPublic": false,
    //     "createdAt": "2024-02-05T17:28:41.805551+07:00",
    //     "updatedAt": "2024-03-26T23:27:39.178409+07:00",
    //     "managers": [],
    //     "features": [],
    //     "media": [
    //       {
    //         "id": 27317,
    //         "propertyId": "6bdca7ac-a3d9-4fc8-87b2-4435665fd423",
    //         "url": "https://youtu.be/Bxdt0VI3iEg?si=XeO-h4zqDnW1Zbk3",
    //         "type": "VIDEO",
    //         "description": ""
    //       },
    //       {
    //         "id": 27318,
    //         "propertyId": "6bdca7ac-a3d9-4fc8-87b2-4435665fd423",
    //         "url": "http://localhost:4566/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/20231215143502-f59f_wm-1707128921422",
    //         "type": "IMAGE",
    //         "description": "Phòng ngủ"
    //       },
    //       {
    //         "id": 27319,
    //         "propertyId": "6bdca7ac-a3d9-4fc8-87b2-4435665fd423",
    //         "url": "http://localhost:4566/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/20231215143502-b4cb_wm-1707128921481",
    //         "type": "IMAGE",
    //         "description": "Phòng khách 1"
    //       },
    //       {
    //         "id": 27320,
    //         "propertyId": "6bdca7ac-a3d9-4fc8-87b2-4435665fd423",
    //         "url": "http://localhost:4566/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/20231215143502-8356_wm-1707128921534",
    //         "type": "IMAGE",
    //         "description": "Phòng bếp"
    //       }
    //     ],
    //     "tags": []
    //   },
    //   "unitId": "1b89ae5c-3e4e-4a6b-8873-3e49f95390b0",
    //   "unit": {
    //     "id": "1b89ae5c-3e4e-4a6b-8873-3e49f95390b0",
    //     "propertyId": "6bdca7ac-a3d9-4fc8-87b2-4435665fd423",
    //     "name": "P203",
    //     "area": 20,
    //     "floor": 2,
    //     "numberOfLivingRooms": 0,
    //     "numberOfBedrooms": 0,
    //     "numberOfBathrooms": 0,
    //     "numberOfToilets": 0,
    //     "numberOfKitchens": 0,
    //     "numberOfBalconies": 0,
    //     "type": "ROOM",
    //     "createdAt": "2024-02-05T17:28:41.895128+07:00",
    //     "updatedAt": "2024-02-05T17:28:41.895128+07:00",
    //     "amenities": [
    //       {
    //         "unitId": "1b89ae5c-3e4e-4a6b-8873-3e49f95390b0",
    //         "amenityId": 1,
    //         "description": "Đồ gỗ"
    //       },
    //       {
    //         "unitId": "1b89ae5c-3e4e-4a6b-8873-3e49f95390b0",
    //         "amenityId": 7,
    //         "description": "Panasonic"
    //       }
    //     ],
    //     "media": [
    //       {
    //         "id": 3,
    //         "unitId": "1b89ae5c-3e4e-4a6b-8873-3e49f95390b0",
    //         "url": "http://localhost:4566/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/20231215143502-80ed_wm-1707128921683",
    //         "type": "IMAGE",
    //         "description": null
    //       },
    //       {
    //         "id": 4,
    //         "unitId": "1b89ae5c-3e4e-4a6b-8873-3e49f95390b0",
    //         "url": "http://localhost:4566/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/20231215143502-36a8_wm-1707128921728",
    //         "type": "IMAGE",
    //         "description": null
    //       }
    //     ]
    //   },
    //   "tenant": {
    //     "profileImage": {
    //       "name": "Mona_Lisa.jpg",
    //       "size": 353433,
    //       "type": "image/jpeg",
    //       "url": "blob:http://localhost:3000/bb658348-bdb6-4f31-a871-ff5abd0bfdf6"
    //     },
    //     "tenantType": "INDIVIDUAL",
    //     "tenantName": "Nguyen Van A",
    //     "tenantPhone": "0912343457",
    //     "tenantEmail": "anv12234@gmail.com",
    //     "pets": [
    //       {
    //         "type": "dog",
    //         "weight": 6,
    //         "description": "asdf aer wer"
    //       }
    //     ],
    //     "rentalIntention": "RESIDENCE",
    //     "rentalPeriod": 12,
    //     "moveinDate": new Date("2024-05-18T00:00:00.000Z"),
    //     "startDate": new Date("2024-05-18T00:00:00.000Z")
    //   },
    //   "services": {
    //     "paymentType": "POSTPAID",
    //     "rentalPaymentBasis": 1,
    //     "depositPaid": false,
    //     "services": [
    //       {
    //         "name": "Internet",
    //         "setupBy": "LANDLORD",
    //         "provider": "FPT",
    //         "price": 250000
    //       },
    //       {
    //         "name": "Bãi đậu xe",
    //         "setupBy": "LANDLORD",
    //         "price": 900000
    //       }
    //     ],
    //     "rentalPrice": 4000000,
    //     "deposit": 120000,
    //     "electricitySetupBy": "TENANT",
    //     "waterSetupBy": "LANDLORD",
    //     "waterPaymentType": "FIXED",
    //     "waterPrice": 1200
    //   },
    // },

  });

  useEffect(() => {
    dataCtx.setSessionData(sessionData);
  }, []);

  function onSubmit(data: FormValues) {
    console.log("submitting data:", data);
    setOpenUploadDialog(true);
  }

  function handleNext() {
    let o: string | string[] = "";
    switch (step) {
      case 0:
        o = ["propertyId", "unitId", "property", "unit"];
        break;
      case 1:
        o = "tenant";
        break;
      case 2:
        o = "services";
        break;
      default:
    }
    form.trigger(o as any)
      .then((v) => {
        if (v) {
          console.log(form.getValues());
          setStep(step + 1);
        } else {
          console.error(form.formState.errors);
          const messages = getMessages(form.formState.errors as any);
          toast.error(messages.join("\n"));
        }
      })
      .catch((e) => {
        console.error(e);
      });
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
              title: "Nhà cho thuê",
              description: "Chọn nhà cho thuê",
            },
            {
              title: "Bên thuê",
              description: "Đại diện bên thuê",
            },
            {
              title: "Chi phí",
              description: "Chi phí khách thuê nhà chi trả ",
            },
            {
              title: "Quy định",
            }
          ]}
          currentStep={step}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === 0 ? (
              <PropertySelection />
            ) : step === 1 ? (
              <TenantDetails />
            ) : step === 2 ? (
              <div className="space-y-4">
                <Baseprice />
                <BasicServices />
                <ExtraServices />
              </div>
            ) : step === 3 ? (
              <div className="space-y-4">
                {/* <RentalPayment/> */}
                <ExtendLease/>
                <OtherPolicies />
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
              {step < 3 && (
                <Button
                  type="button"
                  onClick={handleNext}
                >
                  Tiếp tục
                </Button>
              )}
              {JSON.stringify(form.formState.errors)}
              {step === 3 && (
                <Button type="submit">Hoàn tất</Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
