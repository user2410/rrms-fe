"use client";

import * as z from 'zod';

import PreviewModal from './_components/preview-modal';
import { Button } from "@/components/ui/button";
import { Form } from '@/components/ui/form';
import Modal from '@/components/ui/modal';
import TimelineStepper from "@/components/ui/stepper/timeline-stepper";
import { zodResolver } from '@hookform/resolvers/zod';
import { Fragment, useState } from "react";
import { DeepPartial, useForm } from 'react-hook-form';
import ListingConfig from './config';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { format } from 'date-fns';
import CreateListing from '@/actions/listings/create';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

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
    .string()
    .uuid(),
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
        .number()
        .optional(),
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
            policyId: z.string(),
            note: z.string().optional(),
          })
        ),
    }),
  config: z
    .object({
      priority: z
        .string(),
      postDuration: z
        .string(),
      postAt: z
        .string(),
      active: z
        .boolean(),
    }),
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;


export default function NewListingPage() {
  const [step, setStep] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const propertyId = searchParams?.get('propertyId');

  const {data: session} = useSession();

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      listing: {
        priceNegotiable: false,
      },
      propertyId: propertyId || '',
      config: {
        priority: "1",
        postDuration: "15",
        postAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        active: true,
      },
    },
  });

  async function onSubmit(values: ListingFormValues) {
    console.log("submit", JSON.stringify(values));
    try {
      CreateListing(values, session!.user.accessToken);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Fragment>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <PreviewModal form={form}/>
      </Modal>
      <div className="container mx-auto py-10 space-y-8">
        <div className="">
          <span className="font-light text-md">Listings /</span>
          <span className="font-bold text-lg"> New listing </span>
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
                  title: 'Bất động sản',
                  description: 'Chọn bất động sản bạn muốn đăng tin',
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
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={step < 3}
                    onClick={() => setShowModal(true)}
                  >
                    Xem trước tin đăng
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    onClick={(e) => {
                      console.log(form.getValues());
                      switch (step) {
                        case 0:
                          form.trigger('contact')
                            .then(res => {
                              setStep(res ? step + 1 : step);
                            });
                          break;
                        case 1:
                          form.trigger('propertyId')
                            .then(res => {
                              setStep(res ? step + 1 : step);
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
                              if(res) {
                                onSubmit(form.getValues());
                              }
                            });
                          break;
                      }
                    }}
                  >
                    {step === 3 ? 'Submit' : 'Next'}
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
