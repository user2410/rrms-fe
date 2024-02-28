import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Property, getPrimaryImage, mapPropertyTypeToText } from "@/models/property";
import { Unit } from "@/models/unit";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Tabs from '@radix-ui/react-tabs';
import { useState } from "react";
import { DeepPartial, useForm } from "react-hook-form";
import * as z from "zod";
import styles from '../_styles/page.module.css';
import ApplicationOccupants from "./application_occupants";
import Finish from "./finish";
import YourDetails from "./your_details";
import { ListingDetail } from "../page";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Image from "next/image";
import { ToMillion } from "@/utils/currency";
import { Session } from "next-auth";

const applicationFormSchema = z.object({
  ld: z.object({
    listing: z.any(),
    property: z.any(),
    units: z.array(z.any()),
  }),
  propertyId: z.string(),
  unitIds: z.array(z.string()),
  listingId: z.string(),
  ao: z.object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    dob: z.date(),
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
  }),
  yd: z.object({
    rhAddress: z.string().optional(),
    rhCity: z.string().optional(),
    rhDistrict: z.string().optional(),
    rhWard: z.string().optional(),
    rhRentalDuration: z.number().optional(),
    rhMonthlyPayment: z.number().optional(),
    rhReasonForLeaving: z.string().optional(),

    employmentStatus: z.enum(["EMPLOYED", "STUDENT", "SELF-EMPLOYED", "UNEMPLOYED", "RETIRED"]),
    employmentCompanyName: z.string().optional(),
    employmentPosition: z.string().optional(),
    employmentMonthlyIncome: z.number().optional(),
    employmentComment: z.string().optional(),
    employmentProofsOfIncome: z.array(z.object({
      url: z.string(),
      name: z.string(),
      size: z.number(),
      type: z.string(),
    })),

    identityType: z.enum(["ID", "CITIZENIDENTIFICATION", "PASSPORT", "DRIVERLICENSE"]),
    identityNumber: z.string(),
    identityIssuedDate: z.date(),
    identityIssuedBy: z.string(),

    vehicles: z.array(z.object({
      type: z.enum(["car", "motorbike", "bicycle", "other"]),
      model: z.string().optional(),
      code: z.string(),
    })),
  }),
});

export type ApplicationForm = z.infer<typeof applicationFormSchema>;

export default function MainForm({
  data,
  sessionData,
}: {
  data: ListingDetail;
  sessionData: Session;
}) {
  const { listing, property, units } = data;
  const [tab, setTab] = useState<string>("1");
  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationFormSchema),
    // defaultValues: {
    //  ld: listingDetail,
    //   ao: {
    //     fullName: sessionData.user.user.firstName + " " + sessionData.user.user.lastName,
    //     email: sessionData.user.user.email,
    //     phone: sessionData.user.user.phone,
    //     minors: [],
    //     coaps: [],
    //     pets: [],
    //   },
    //   yd: {
    //     vehicles: [],
    //   },
    //   listingId: listing.id,
    //   propertyId: property.id,
    //   unitIds: units.map((unit: Unit) => unit.id),
    // },
    defaultValues: {
      "ld": data,
      "ao": {
          "fullName": "Albert Alpha",
          "email": "alpha@email.com",
          "phone": "0912142214",
          "minors": [
              {
                  "fullName": "Pham Đức Hiếu",
                  "dob": new Date("2009-02-02T00:00:00.000Z"),
                  "description": "Học sinh THCS Lương Thế Vinh"
              }
          ],
          "coaps": [
              {
                  "fullName": "Nguyen Minh Nguyet",
                  "dob": new Date("1992-12-12T00:00:00.000Z"),
                  "email": "alpha@email.com",
                  "phone": "0912142214",
                  "job": "Kế toán",
                  "income": 30,
                  "description": "Tập đoàn Viettel"
              },
              {
                  "fullName": "Pham Minh Đức",
                  "dob": new Date("2001-05-12T00:00:00.000Z"),
                  "email": "cyPhr@email.com",
                  "phone": "0912142214",
                  "job": "Sinh Viên",
                  "income": 4,
                  "description": "sinh viên đại học bách khoa"
              }
          ],
          "pets": [
              {
                  "type": "cat",
                  "weight": 6,
                  "description": "Đã triệt sản"
              }
          ],
          "dob": new Date("1989-10-24T00:00:00.000Z"),
          "profileImage": {
              "name": "Mona_Lisa-restored.jpg",
              "size": 353433,
              "type": "image/jpeg",
              "url": "blob:http://localhost:3000/25640691-1fdc-4e13-bca1-bb05c6ba3863"
          },
          "moveinDate": new Date("2024-12-15T00:00:00.000Z"),
          "preferredTerm": 12,
          "rentalIntention": "RESIDENCE",
      },
      "yd": {
          "vehicles": [
              {
                  "type": "car",
                  "model": "Honda Civic",
                  "code": "29G2-05465"
              },
              {
                  "type": "motorbike",
                  "model": "Honda Lead",
                  "code": "29G2-05442"
              }
          ],
          "employmentStatus": "EMPLOYED",
          "employmentCompanyName": "Tập đoàn VinGroup",
          "employmentPosition": "Kỹ sư phần mềm",
          "employmentMonthlyIncome": 100,
          "employmentComment": "Tiền tiết kiệm 50 triệu mỗi tháng",
          "identityType": "ID",
          "identityNumber": "1290148921039",
          "identityIssuedDate": new Date("2020-02-03T00:00:00.000Z"),
          "identityIssuedBy": "Hà Nội",
          // "employmentProofsOfIncome": [
          //     {
          //         "name": "Basic.jpeg",
          //         "size": 36335,
          //         "type": "image/jpeg",
          //         "url": "blob:http://localhost:3000/3a331610-784d-48f5-b2bc-534a444bbabb"
          //     }
          // ]
      },
      "listingId": "5d29802c-e9f8-4c6e-bf82-e505b1305351",
      "propertyId": "73896343-80cb-4abf-8f2c-6f5fbca59af1",
      "unitIds": [
          "705698bb-cdd4-44a8-8c09-43413a086fe9"
      ]
  }
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
              <h2 className="font-semibold">{property.fullAddress}</h2>
              <h3>{property.area}m<sup>2</sup>, {ToMillion(listing.price)}</h3>
              <p className="text-sm font-thin">{mapPropertyTypeToText[property.type as keyof typeof mapPropertyTypeToText]}</p>
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
                  <AlertDialogAction>OK</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      {/* Main form */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs.Root defaultValue="1" value={tab} className={styles.TabsRoot}>
          <Tabs.List className={styles.TabsList}>
            <Tabs.Trigger disabled className={styles.TabsTrigger} value="1">Thông tin cơ bản</Tabs.Trigger>
            <Tabs.Trigger disabled className={styles.TabsTrigger} value="2">Thông tin cá nhân</Tabs.Trigger>
            <Tabs.Trigger disabled className={styles.TabsTrigger} value="3">Tổng kết</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className={styles.TabsContent} value="1">
            <div className="container">
              <ApplicationOccupants data={data} />
            </div>
          </Tabs.Content>
          <Tabs.Content className={styles.TabsContent} value="2">
            <div className="container">
              <YourDetails data={data} />
            </div>
          </Tabs.Content>
          <Tabs.Content className={styles.TabsContent} value="3">
            <div className="container">
              <Finish />
            </div>
          </Tabs.Content>
        </Tabs.Root>
        <div className="container flex flex-row justify-between gap-4">
          <div className="text-sm font-medium text-destructive">{form.formState.errors && JSON.stringify(form.formState.errors)}</div>
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
                  type={index<3 ? "button" : "submit"}
                  className="" 
                  disabled={index===3}
                  onClick={() => {
                    console.log("current form: ", form.getValues());
                    const screen = tab === "1" ? "ao" : tab === "2" ? "yd" : "";
                    console.log(screen);
                    form.trigger(screen as any)
                      .then((valid) => {
                        if (!valid) return;
                        setTab((index + 1).toString());
                      })
                      .catch((reason) => {
                        console.log(reason);
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
