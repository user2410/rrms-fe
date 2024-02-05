import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Property } from "@/models/property";
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

const applicationFormSchema = z.object({
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
  // A guarantor guarantees your lease, by promising that if you fall behind on payments, they will also be responsible for the payments.
  // guarantors: z.array(z.object({
  //   fullName: z.string(),
  //   email: z.string().email(),
  //   phone: z.string(),
  //   dob: z.date(),
  // })),

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

const defaultValues: DeepPartial<ApplicationForm> = {
  ao: {
    minors: [],
    coaps: [],
    pets: [],
  },
  yd: {
    vehicles: [],
  },
};

export default function MainForm({
  data
} : {
  data: ListingDetail;
}) {
  const [tab, setTab] = useState<string>("1");
  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      ...defaultValues, 
      listingId: data.listing.id,
      propertyId: data.property.id,
      unitIds: data.units.map((unit: Unit) => unit.id),
    },
  });

  // useEffect(() => {
  //   form.setValue('propertyId', property.id);
  //   form.setValue('unitIds', units.map((unit: Unit) => unit.id));
  //   form.setValue('listingId', listingId);
  // }, []);

  function onSubmit(data: ApplicationForm) {
    console.log('onSubmit page', data);
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs.Root defaultValue="1" value={tab} className={styles.TabsRoot}>
            <Tabs.List className={styles.TabsList}>
              <Tabs.Trigger disabled className={styles.TabsTrigger} value="1">Thông tin cơ bản</Tabs.Trigger>
              <Tabs.Trigger disabled className={styles.TabsTrigger} value="2">Thông tin cá nhân</Tabs.Trigger>
              <Tabs.Trigger disabled className={styles.TabsTrigger} value="3">Tổng kết</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className={styles.TabsContent} value="1">
              <div className="container">
                <ApplicationOccupants data={data}/>
              </div>
            </Tabs.Content>
            <Tabs.Content className={styles.TabsContent} value="2">
              <div className="container">
                <YourDetails />
              </div>
            </Tabs.Content>
            <Tabs.Content className={styles.TabsContent} value="3">
              <div className="container">
                <Finish />
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </form>
        <div className="container flex flex-row justify-between gap-4">
          <div className="text-sm font-medium text-destructive">{form.formState.errors && JSON.stringify(form.formState.errors)}</div>
          {(() => {
            const index = parseInt(tab);
            return (
              <div className="flex flex-row gap-4">
                {index > 1 && (
                  <Button variant="outline" className="" onClick={() => setTab((index - 1).toString())}>Prev</Button>
                )}
                {index < 3 && (
                  <Button className="" onClick={() => { 
                    console.log("current form: ", form.getValues());
                    const screen = tab === "1" ? "ao" : tab === "2" ? "yd" : "";
                    console.log(screen);
                    form.trigger(screen as any)
                      .then((valid) => {
                        if(!valid) return;
                        setTab((index + 1).toString()); 
                      })
                      .catch((reason) => {
                        console.log(reason);
                      });
                  }}>Next</Button>
                )}
              </div>
            );
          })()}
        </div>
      </Form>
  );
};
