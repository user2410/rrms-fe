import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { mapTenantType2Text } from "@/models/application";
import { getPrimaryImage, getPropertyFullAddress, mapPropertyTypeToText } from "@/models/property";
import { ToMillion } from "@/utils/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Tabs from '@radix-ui/react-tabs';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ListingDetail, Query } from "../page";
import ApplicationOccupants from "./application_occupants";
import Finish from "./finish";
import YourDetails from "./your_details";
import { Unit } from "@/models/unit";
import toast from "react-hot-toast";
import { PropertyTypeBadge } from "@/components/complex/property";

const applicationFormSchema = z.object({
  ld: z.object({
    listing: z.any(),
    property: z.any(),
    units: z.array(z.any()),
  }),
  propertyId: z.string(),
  units: z.array(
    z.object({
      unitId: z.string(),
      listingPrice: z.number(),
      offeredPrice: z.number(),
    })
  ),
  unitId: z.string(), // ids of selected units
  k: z.string().optional(),
  listingId: z.string(),
  ao: z.object({
    tenantType: z.enum(["INDIVIDUAL", "FAMILY", "ORGANIZATION"]),
    // individual applicant
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    dob: z.date().optional(),
    profileImage: z.object({
      url: z.string(),
      name: z.string(),
      size: z.number(),
      type: z.string(),
    }),
    moveinDate: z.date(),
    preferredTerm: z.number(),
    rentalIntention: z.string(),
    minors: z.array(z.object({
      fullName: z.string(),
      dob: z.date(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      description: z.string().optional(),
    })),
    coaps: z.array(z.object({
      fullName: z.string(),
      dob: z.date(),
      job: z.string(),
      income: z.number().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      description: z.string().optional(),
    })),
    pets: z.array(z.object({
      type: z.enum(["dog", "cat", "other"]),
      weight: z.number().optional(),
      description: z.string().optional(),
    })),
    // organization
    organizationName: z.string().optional(),
    organizationHqAddress: z.string().optional(),
    organizationScale: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]).optional(),
  }).refine(data => (
    data.tenantType !== "ORGANIZATION" ||
    (data.tenantType === "ORGANIZATION" && !!data.organizationName && !!data.organizationHqAddress && !!data.organizationScale)
  ), { message: "Thiếu thông tin tổ chức" }),
  yd: z.object({
    rhAddress: z.string().optional(),
    rhCity: z.string().optional(),
    rhDistrict: z.string().optional(),
    rhWard: z.string().optional(),
    rhRentalDuration: z.number().optional(),
    rhMonthlyPayment: z.number().optional(),
    rhReasonForLeaving: z.string().optional(),

    employmentStatus: z.enum(["EMPLOYED", "STUDENT", "SELF-EMPLOYED", "UNEMPLOYED", "RETIRED"]).optional(),
    employmentCompanyName: z.string().optional(),
    employmentPosition: z.string().optional(),
    employmentMonthlyIncome: z.number().optional(),
    employmentComment: z.string().optional().optional(),

    // identityType: z.enum(["ID", "CITIZENIDENTIFICATION", "PASSPORT", "DRIVERLICENSE"]),
    // identityNumber: z.string(),

    vehicles: z.array(z.object({
      type: z.enum(["car", "motorbike", "bicycle"]),
      model: z.string().optional(),
      code: z.string(),
    })),
  }),
});

export type ApplicationForm = z.infer<typeof applicationFormSchema>;

export default function MainForm({
  data,
  query,
}: {
  data: ListingDetail;
  query: Query;
}) {
  const router = useRouter();
  const { listing, property, units } = data;
  const [tab, setTab] = useState<string>("1");
  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      ld: data,
      ao: {
        tenantType: property.type === "OFFICE" ? "ORGANIZATION" : "INDIVIDUAL",
        fullName: query.fullName,
        email: query.email,
        phone: query.phone,
        minors: [],
        coaps: [],
        pets: [],
        rentalIntention: property.type === "OFFICE" ? "OFFICE" : undefined,
        preferredTerm: listing.leaseTerm,
      },
      yd: {
        vehicles: [],
      },
      listingId: listing.id,
      propertyId: property.id,
      units: units.map((unit: Unit) => {
        const lu = listing.units.find(_u => unit.id === _u.unitId)!;
        return {
          unitId: unit.id,
          listingPrice: lu.price,
          offeredPrice: lu.price,
        };
      }),
      unitId: query.unitId,
      k: query.k,
    },
    // defaultValues: {
    //   ao: {
    //     "tenantType": "FAMILY",
    //     "fullName": "Graham Gamma",
    //     "email": "gamma@email.com",
    //     "phone": "1231341235",
    //     "minors": [
    //       {
    //         "fullName": "Nguyễn Minh Đức",
    //         "dob": new Date("2009-12-06T00:00:00.000Z"),
    //         "description": "THCS Lương Thế Vinh"
    //       }
    //     ],
    //     "coaps": [
    //       {
    //         "fullName": "Nguyễn Thị An",
    //         "dob": new Date("2006-04-06T00:00:00.000Z"),
    //         "email": "johndoe@email.com",
    //         "phone": "0912341512",
    //         "job": "Kế toán",
    //         "income": 20000000,
    //         "description": "Ngân hàng VCB"
    //       },
    //       {
    //         "fullName": "Nguyễn Đức Anh",
    //         "dob": new Date("2006-04-06T00:00:00.000Z"),
    //         "email": "alpha@email.com",
    //         "phone": "0932313543",
    //         "job": "Sinh viên",
    //         "income": 4000000,
    //         "description": "Đại học Bách Khoa Hà Nội"
    //       }
    //     ],
    //     "pets": [],
    //     "rentalIntention": "RESIDENCE",
    //     "preferredTerm": 6,
    //     "profileImage": {
    //       url: "http://localhost:4566/rrms-image/32d322e2-e72f-442e-ab21-bf9208db5b1a/Mona_Lisa-restored-1712727955368",
    //     },
    //     "moveinDate": new Date("2024-04-19T00:00:00.000Z"),
    //   },
    //   yd: {
    //     "vehicles": [
    //       {
    //         "type": "motorbike",
    //         "model": "SH",
    //         "code": "29G2-05465"
    //       },
    //       {
    //         "type": "motorbike",
    //         "model": "Wave-RSX",
    //         "code": "29G2-03462"
    //       }
    //     ],
    //     "employmentStatus": "STUDENT",
    //     "employmentCompanyName": "HUST",
    //     "employmentPosition": "Sinh viên",
    //     "employmentMonthlyIncome": 4,
    //     "employmentComment": "hasd sdaf",
    //   },
    //   "listingId": "aa60713a-c2f6-44f6-88e2-3974e5f8d517",
    //   "propertyId": "99fa1b5b-c410-4d09-8564-2db0e5c00161",
    //   "units": [
    //     {
    //       "unitId": "35ca3216-29a0-4243-a9df-4b1a6f43fa58",
    //       "listingPrice": 2000000,
    //       "offeredPrice": 2000000,
    //     }
    //   ],
    //   "k": ""
    // }
  });

function onSubmit(data: ApplicationForm) {
  console.log('onSubmit page', data);
}

return (
  <Form {...form}>
    {/* Top info bar */}
    <div className="space-y-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-4">
          <div className="relative aspect-video w-52">
            <Image
              src={getPrimaryImage(property)}
              alt={property.name}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold">{getPropertyFullAddress(property)}</h2>
            <h3>{property.area}m<sup>2</sup>, {ToMillion(listing.price)}</h3>
            <PropertyTypeBadge property={property} />
          </div>
        </div>
        <div className="mx-2 flex flex-row gap-2">
          <AlertDialog>
            <AlertDialogTrigger>Hủy đăng ký</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn hủy đăng ký?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tất cả thông tin bạn đã nhập sẽ bị mất.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No</AlertDialogCancel>
                <AlertDialogAction onClick={() => router.replace(`/listings/${listing.id}`)}>OK</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
    {/* Main form */}
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Tabs.Root defaultValue="1" value={tab} className="TabsRoot">
        <Tabs.List className="TabsList">
          <Tabs.Trigger disabled className="TabsTrigger" value="1">Thông tin cơ bản</Tabs.Trigger>
          <Tabs.Trigger disabled className="TabsTrigger" value="2">Thông tin {mapTenantType2Text[form.watch("ao.tenantType")].toLowerCase()}</Tabs.Trigger>
          <Tabs.Trigger disabled className="TabsTrigger" value="3">Tổng kết</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="TabsContent" value="1">
          <div className="container">
            <ApplicationOccupants data={data} />
          </div>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="2">
          <div className="container">
            <YourDetails data={data} />
          </div>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="3">
          <div className="container">
            <Finish />
          </div>
        </Tabs.Content>
      </Tabs.Root>
      <div className="container flex flex-row justify-end gap-4">
        {(() => {
          const index = parseInt(tab);
          return (
            <div className="flex flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                className=""
                disabled={index <= 1}
                onClick={() => setTab((index - 1).toString())}
              >
                Trước
              </Button>
              <Button
                type="button"
                disabled={index === 3}
                onClick={() => {
                  const screen = (tab === "1" ? "ao" : tab === "2" ? "yd" : "");
                  form.trigger(screen as any)
                    .then((valid) => {
                      if (!valid) {
                        toast.error("Thông tin chưa hợp lệ, hãy kiểm tra lại");
                        console.error(form.formState.errors);
                        return;
                      }
                      setTab((index + 1).toString());
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                }}
              >
                Tiếp theo
              </Button>
            </div>
          );
        })()}
      </div>
    </form>
  </Form>
);
};
