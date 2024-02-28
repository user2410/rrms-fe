"use client";

import * as z from 'zod';

import CreateListing from '@/actions/listings/create';
import { Button } from "@/components/ui/button";
import { Form } from '@/components/ui/form';
import Modal from '@/components/ui/modal';
import TimelineStepper from "@/components/ui/stepper/timeline-stepper";
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Fragment, useState } from "react";
import { useForm } from 'react-hook-form';
import PreviewModal from './_components/preview-modal';
import ListingConfig from './config';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import UploadDialog from './_components/upload_dialog';

const listingFormSchema = z.object({
  contact: z.object({
    fullName: z
      .string(),
    email: z
      .string()
      .email(),
    phone: z
      .string(),
    contactType: z
      .string(),
  }),
  propertyId: z
    .string().uuid(),
  units: z
    .array(
      z.object({
        unitId: z.string().uuid(),
        price: z.number(),
      }),
    )
    .nonempty(),
  propertyData: z
    .object({
      property: z.any(),
      units: z.array(z.any()),
    }),
  listing: z
    .object({
      title: z
        .string()
        .min(30)
        .max(99),
      description: z
        .string()
        .min(30)
        .max(3000),
      price: z
        .number(),
      priceNegotiable: z
        .boolean(),
      securityDeposit: z
        .number(),
      leaseTerm: z
        .number()
        .optional(),
      petsAllowed: z
        .boolean()
        .optional(),
      numberOfResidents: z
        .number()
        .optional(),
      policies: z
        .array(
          z.object({
            policyId: z.number(),
            note: z.string(),
          })
        ),
    }),
  config: z
    .object({
      priority: z
        .number(),
      postDuration: z
        .number(),
      // postAt: z
      //   .date(),
      // active: z
      //   .boolean(),
    }),
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;


export default function NewListingPage() {
  const [step, setStep] = useState<number>(0);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const propertyId = searchParams?.get('propertyId');

  const { data: session } = useSession();
  const userData =  session?.user.user;

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      contact: {
        fullName: userData ? (`${userData.firstName} ${userData.lastName}`) : "",
        email: userData?.email,
        phone: userData?.phone,
      },
      listing: {
        priceNegotiable: false,
        price: 0,
        securityDeposit: 0,
      },
      propertyId: propertyId || "",
      units: [],
      config: {
        priority: 1,
        postDuration: 15,
      },
    },
  });

  function onSubmit(values: ListingFormValues) {
    console.log("submit", JSON.stringify(values));
    if(step < 3) {
      return;
    }
    setOpenUploadDialog(true);
  }

  return (
    <Fragment>
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      >
        <PreviewModal form={form} />
      </Modal>
      <UploadDialog
        form={form}
        open={openUploadDialog} 
        changeOpen={() => setOpenUploadDialog(v => !v)}
      />
      <div className="container mx-auto py-10 space-y-8">
        <div className="">
          <span className="font-light text-md">Tin đăng /</span>
          <span className="font-bold text-lg"> Tin đăng mới </span>
        </div>
        <div className="text-card-foreground grid grid-cols-12">
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 p-2">
            <TimelineStepper
              steps={[
                {
                  title: 'Thông tin cá nhân',
                  description: 'Thông tin liên hệ của bạn',
                },
                {
                  title: 'Nhà cho thuê',
                  description: 'Chọn nhà cho thuê bạn muốn đăng tin',
                },
                {
                  title: 'Bài đăng',
                  description: 'Chi tiết bài đăng',
                },
                {
                  title: 'Cấu hình tin đăng',
                },
              ]}
              currentStep={step}
            />
          </div>
          <div className="col-span-12 bg-card rounded-lg shadow-sm lg:col-span-8 xl:col-span-9 p-8">
            <Form {...form}>
              <form onSubmit={(e) => { e.preventDefault(); }}>
                {
                  step === 0 ? (
                    <Step1 />
                  ) : step === 1 ? (
                    <Step2 />
                  ) : step === 2 ? (
                    <Step3 />
                  ) : step === 3 ? (
                    <ListingConfig />
                  ) : null
                }
                <div className="flex justify-between w-full mt-4">
                  <Button
                    type="button"
                    disabled={step === 0}
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Trước
                  </Button>
                  {step === 3 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setShowPreviewModal(true)}
                    >
                      Xem trước tin đăng
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => {
                      switch (step) {
                        case 0:
                          form.trigger('contact')
                            .then(res => {
                              setStep(res ? step + 1 : step);
                            });
                          break;
                        case 1:
                          Promise.all([
                            form.trigger('propertyId'),
                            form.trigger('units'),
                          ])
                            .then(res => {
                              setStep(res[0]&&res[1] ? step + 1 : step);
                            });
                          break;
                        case 2:
                          form.trigger('listing')
                            .then(res => {
                              console.log('res', res);
                              setStep(res ? step + 1 : step);
                            });
                          break;
                        default:
                          form.trigger('config')
                            .then(res => {
                              if (res) {
                                onSubmit(form.getValues());
                              }
                            });
                          break;
                      }
                      console.log("error:", form.formState.errors);
                    }}
                  >
                    {step === 3 ? "Đăng tin" : 'Tiếp tục'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
