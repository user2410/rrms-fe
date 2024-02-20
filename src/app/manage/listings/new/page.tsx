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
            note: z.string().optional(),
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const propertyId = searchParams?.get('propertyId');

  const { data: session } = useSession();
  const userData =  session?.user.user;

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    // defaultValues: {
    //   contact: {
    //     fullName: userData ? (`${userData.firstName} ${userData.lastName}`) : "",
    //     email: userData?.email,
    //     phone: userData?.phone,
    //   },
    //   listing: {
    //     priceNegotiable: false,
    //     price: 0,
    //     securityDeposit: 0,
    //   },
    //   propertyId: propertyId || "",
    //   units: [],
    //   config: {
    //     priority: 1,
    //     postDuration: 15,
    //   },
    // },
    defaultValues: {"contact":{"fullName":"Albert Alpha","email":"alpha@email.com","phone":"0912142214","contactType":"owner"},"listing":{"priceNegotiable":false,"price":0,"securityDeposit":0,"title":"Cho thuê phòng trọ giá rẻ cho sinh viên","description":"<p><strong>Phòng trọ Bình Minh giá rẻ cho sinh viên</strong></p><p>Dãy Phòng trọ giá rẻ cao cấp cho sinh viên và người lao động. Các phòng trọ có diện tích từ 20 - 30 m2, có đủ diện tích để sinh hoạt, làm việc, học tập. Tọa lạc tại Số 10 Đại Cồ Việt, nhà trọ gần các trường đại học lớn (Bách Khoa, Xây Dựng), thuận tiện cho việc đi lại của sinh viên.</p>","numberOfResidents":2,"leaseTerm":36,"petsAllowed":true,"policies":[{"policyId":1,"note":"Trả tiền thuê vào đầu mỗi tháng"},{"policyId":2,"note":"Hẹn trước lịch bảo trì 1 tuần"}]},"propertyId":"73896343-80cb-4abf-8f2c-6f5fbca59af1","units":[{"unitId":"8f1fc2ac-9083-4966-ba5f-9bd2b00a30c1","price":2000000},{"unitId":"705698bb-cdd4-44a8-8c09-43413a086fe9","price":2500000},{"unitId":"c4d38af1-1801-4bb8-ae46-4aed113ea74f","price":2500000}],"config":{"priority":1,"postDuration":15},"propertyData":{"property":{"id":"73896343-80cb-4abf-8f2c-6f5fbca59af1","creatorId":"e0a8d123-c55b-4230-91e8-bd1b7b762366","name":"Phòng trọ Bình Minh","building":null,"project":null,"area":22.75,"numberOfFloors":null,"yearBuilt":null,"orientation":null,"entranceWidth":null,"facade":null,"fullAddress":"Số 10, Đại Cồ Việt","district":"4","city":"HN","ward":"74","lat":20.9972238,"lng":105.8021945,"primaryImage":27338,"description":"<p><strong>Phòng trọ Bình Minh giá rẻ cho sinh viên</strong></p><p>Dãy Phòng trọ giá rẻ cao cấp cho sinh viên và người lao động. Các phòng trọ có diện tích từ 20 - 30 m2, có đủ diện tích để sinh hoạt, làm việc, học tập. Tọa lạc tại Số 10 Đại Cồ Việt, nhà trọ gần các trường đại học lớn (Bách Khoa, Xây Dựng), thuận tiện cho việc đi lại của sinh viên.</p>","type":"ROOM","isPublic":false,"createdAt":"2024-02-19T10:37:56.917036+07:00","updatedAt":"2024-02-19T10:37:56.962127+07:00","managers":[{"propertyId":"73896343-80cb-4abf-8f2c-6f5fbca59af1","managerId":"e0a8d123-c55b-4230-91e8-bd1b7b762366","role":"MANAGER"}],"features":[{"propertyId":"73896343-80cb-4abf-8f2c-6f5fbca59af1","featureId":8,"description":"Bãi đỗ xe mở dưới sân trước khu, đủ chỗ cho 40 xe máy"},{"propertyId":"73896343-80cb-4abf-8f2c-6f5fbca59af1","featureId":1,"description":"Bảo vệ 24/7"}],"media":[{"id":27338,"propertyId":"73896343-80cb-4abf-8f2c-6f5fbca59af1","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2023-12-30_06-49-55-1708313871723","type":"IMAGE","description":null},{"id":27339,"propertyId":"73896343-80cb-4abf-8f2c-6f5fbca59af1","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2023-12-30_06-28-03-1708313872340","type":"IMAGE","description":null},{"id":27340,"propertyId":"73896343-80cb-4abf-8f2c-6f5fbca59af1","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2024-02-03_18-00-40-1708313872567","type":"IMAGE","description":null}],"tags":[]},"units":[{"id":"8f1fc2ac-9083-4966-ba5f-9bd2b00a30c1","propertyId":"73896343-80cb-4abf-8f2c-6f5fbca59af1","name":"302","area":26,"floor":3,"numberOfLivingRooms":null,"numberOfBedrooms":null,"numberOfBathrooms":null,"numberOfToilets":null,"numberOfKitchens":null,"numberOfBalconies":null,"type":"STUDIO","createdAt":"2024-02-19T10:37:57.051021+07:00","updatedAt":"2024-02-19T10:37:57.051021+07:00","amenities":[{"unitId":"8f1fc2ac-9083-4966-ba5f-9bd2b00a30c1","amenityId":1,"description":"Sàn gỗ và bàn ghế gỗ"},{"unitId":"8f1fc2ac-9083-4966-ba5f-9bd2b00a30c1","amenityId":4,"description":"Máy giạt Panasonic"}],"media":[{"id":11,"unitId":"8f1fc2ac-9083-4966-ba5f-9bd2b00a30c1","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2023-10-31_17-34-43-1708313875986","type":"IMAGE","description":null},{"id":13,"unitId":"8f1fc2ac-9083-4966-ba5f-9bd2b00a30c1","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2023-10-31_17-33-58-1708313876228","type":"IMAGE","description":null},{"id":14,"unitId":"8f1fc2ac-9083-4966-ba5f-9bd2b00a30c1","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2023-10-31_17-33-29-1708313876546","type":"IMAGE","description":null}]},{"id":"83ec687f-78a1-4ff0-95a4-f27c003948a4","propertyId":"73896343-80cb-4abf-8f2c-6f5fbca59af1","name":"301","area":25,"floor":3,"numberOfLivingRooms":null,"numberOfBedrooms":null,"numberOfBathrooms":null,"numberOfToilets":null,"numberOfKitchens":null,"numberOfBalconies":null,"type":"ROOM","createdAt":"2024-02-19T10:37:57.050796+07:00","updatedAt":"2024-02-19T10:37:57.050796+07:00","amenities":[{"unitId":"83ec687f-78a1-4ff0-95a4-f27c003948a4","amenityId":1,"description":"Sàn gỗ và bàn ghế gỗ"},{"unitId":"83ec687f-78a1-4ff0-95a4-f27c003948a4","amenityId":4,"description":"Máy giạt Panasonic"}],"media":[{"id":12,"unitId":"83ec687f-78a1-4ff0-95a4-f27c003948a4","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2023-12-30_07-13-23-1708313875271","type":"IMAGE","description":null},{"id":15,"unitId":"83ec687f-78a1-4ff0-95a4-f27c003948a4","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2023-12-30_06-59-42-1708313875528","type":"IMAGE","description":null},{"id":16,"unitId":"83ec687f-78a1-4ff0-95a4-f27c003948a4","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2023-12-30_06-58-15-1708313875755","type":"IMAGE","description":null}]},{"id":"705698bb-cdd4-44a8-8c09-43413a086fe9","propertyId":"73896343-80cb-4abf-8f2c-6f5fbca59af1","name":"202","area":20,"floor":2,"numberOfLivingRooms":null,"numberOfBedrooms":null,"numberOfBathrooms":null,"numberOfToilets":null,"numberOfKitchens":null,"numberOfBalconies":null,"type":"ROOM","createdAt":"2024-02-19T10:37:57.032792+07:00","updatedAt":"2024-02-19T10:37:57.032792+07:00","amenities":[{"unitId":"705698bb-cdd4-44a8-8c09-43413a086fe9","amenityId":1,"description":"Sàn gỗ và bàn ghế gỗ"},{"unitId":"705698bb-cdd4-44a8-8c09-43413a086fe9","amenityId":4,"description":"Máy giạt Panasonic"}],"media":[{"id":6,"unitId":"705698bb-cdd4-44a8-8c09-43413a086fe9","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2024-01-11_12-29-10-1708313874431","type":"IMAGE","description":null},{"id":7,"unitId":"705698bb-cdd4-44a8-8c09-43413a086fe9","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2024-01-11_11-57-16-1708313874702","type":"IMAGE","description":null},{"id":9,"unitId":"705698bb-cdd4-44a8-8c09-43413a086fe9","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2024-01-11_11-57-12-1708313874986","type":"IMAGE","description":null}]},{"id":"c4d38af1-1801-4bb8-ae46-4aed113ea74f","propertyId":"73896343-80cb-4abf-8f2c-6f5fbca59af1","name":"201","area":20,"floor":2,"numberOfLivingRooms":null,"numberOfBedrooms":null,"numberOfBathrooms":null,"numberOfToilets":null,"numberOfKitchens":null,"numberOfBalconies":null,"type":"ROOM","createdAt":"2024-02-19T10:37:57.023322+07:00","updatedAt":"2024-02-19T10:37:57.023322+07:00","amenities":[{"unitId":"c4d38af1-1801-4bb8-ae46-4aed113ea74f","amenityId":1,"description":"Sàn gỗ và bàn ghế gỗ"},{"unitId":"c4d38af1-1801-4bb8-ae46-4aed113ea74f","amenityId":4,"description":"Máy giạt Panasonic"}],"media":[{"id":5,"unitId":"c4d38af1-1801-4bb8-ae46-4aed113ea74f","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2024-02-05_00-58-33-1708313873024","type":"IMAGE","description":null},{"id":8,"unitId":"c4d38af1-1801-4bb8-ae46-4aed113ea74f","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2024-02-03_18-00-40-1708313873480","type":"IMAGE","description":null},{"id":10,"unitId":"c4d38af1-1801-4bb8-ae46-4aed113ea74f","url":"https://s3.ap-southeast-1.amazonaws.com/rrms-image/e0a8d123-c55b-4230-91e8-bd1b7b762366/Screenshot_from_2024-02-03_17-51-08-1708313873981","type":"IMAGE","description":null}]}]}}
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
        isOpen={showModal}
        onClose={() => setShowModal(false)}
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
                      onClick={() => setShowModal(true)}
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
