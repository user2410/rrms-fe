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
import { ListingDetail, Query } from "../page";
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
  units: z.array(
    z.object({
      unitId: z.string(),
      listingPrice: z.number(),
      offeredPrice: z.number(),
    })
  ),
  unitIds: z.array(z.string()), // ids of selected units
  k: z.string().optional(),
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
    employmentCompanyName: z.string(),
    employmentPosition: z.string(),
    employmentMonthlyIncome: z.number(),
    employmentComment: z.string().optional(),
    // employmentProofsOfIncome: z.array(z.object({
    //   url: z.string(),
    //   name: z.string(),
    //   size: z.number(),
    //   type: z.string(),
    // })),

    identityType: z.enum(["ID", "CITIZENIDENTIFICATION", "PASSPORT", "DRIVERLICENSE"]),
    identityNumber: z.string(),

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
  query,
}: {
  data: ListingDetail;
  query: Query;
}) {
  const { listing, property, units } = data;
  const [tab, setTab] = useState<string>("1");
  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationFormSchema),
    // defaultValues: {
    //   ld: data,
    //   ao: {
    //     fullName: query.fullName,
    //     email: query.email,
    //     phone: query.phone,
    //     minors: [],
    //     coaps: [],
    //     pets: [],
    //   },
    //   yd: {
    //     vehicles: [],
    //   },
    //   listingId: listing.id,
    //   propertyId: property.id,
    //   units: units.map((unit: Unit) => {
    //     const lu = listing.units.find(_u => unit.id === _u.unitId)!;
    //     return {
    //       unitId: unit.id,
    //       listingPrice: lu.price,
    //       offeredPrice: lu.price,
    //     };
    //   }),
    //   unitIds: query.unitIds || [],
    //   k: query.k,
    // },
    defaultValues: {
      ld: data,
      ao: {
        fullName: query.fullName,
        email: query.email,
        phone: query.phone,
        moveinDate: new Date("2024-10-01"),
        preferredTerm: 12,
        rentalIntention: "RESIDENCE",
        minors: [
          {
            fullName: "mdvskm qwe",
            dob: new Date("2013-01-01"),
            email: "abc@email.com",
            phone: "012948759",
            description: "asjnwemkg weqmo qerfm",
          },
          {
            fullName: "qwklqr qwekwe",
            dob: new Date("2014-01-01"),
            email: "asq@email.com",
            phone: "022948759",
            description: "awgk qwom sjnwemkg weqmo qerfm",
          },
        ],
        coaps: [
          {
            fullName: "fwoem qewqpk a",
            job: "qwekqwe",
            income: 50,
            dob: new Date("1992-01-01"),
            email: "rqkp@email.com",
            phone: "012948759",
            description: "asjnwemkg weqmo qerfm",
          },
          {
            fullName: "qewmoekm admk",
            job: "qwekqwe",
            income: 4,
            dob: new Date("2006-01-01"),
            email: "afkow@email.com",
            phone: "012948759",
            description: "asjnwemkg weqmo qerfm",
          },
        ],
        pets: [
          {
            type: "dog",
            weight: 10,
            description: "qwekqwe",
          },
          {
            type: "cat",
            weight: 5,
            description: "qewkmfq",
          }
        ],
      },
      yd: {
        employmentStatus: "EMPLOYED",
        employmentCompanyName: "Viettel",
        employmentPosition: "Engineer",
        employmentMonthlyIncome: 100,
        employmentComment: "Tien tiet kiem 50 trieu moi thang",
        vehicles: [
          {
            type: "car",
            model: "qw,pf",
            code: "gromg",
          },
          {
            type: "motorbike",
            model: "rtgf",
            code: "rmeew",
          }
        ],
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
      unitIds: query.unitIds || [],
      k: query.k,
    },
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
                  type={index < 3 ? "button" : "submit"}
                  className=""
                  disabled={index === 3}
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
