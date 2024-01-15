"use client";

import { Button } from "@/components/ui/button";
import * as Tabs from "@radix-ui/react-tabs";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { GetLocationName } from "@/utils/dghcvn";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { backendAPI } from "@/libs/axios";
import { Application, ManagedApplication, TransformApplicationRESTResponse } from "@/models/application";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import styles from "../../_components/application_list.module.css";
import StatusCard from "../../_components/status_card";
import BasicInfo from "./_components/basic";
import Personal from "./_components/personal";

export default function ApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const session = useSession();

  const [data, setData] = useState<ManagedApplication>({} as ManagedApplication);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();

  const { id } = params;

  useEffect(() => {
    if(session.status !== "authenticated") return;
    (async () => {
      try {
        setIsLoading(true);
        const applicationQuery = await backendAPI.get<Application>("/api/applications/application/" + id, {
          headers: {
            Authorization: `Bearer ${session.data.user.accessToken}`,
          },
          transformResponse: TransformApplicationRESTResponse,
        });
        const application = applicationQuery.data;
        const listingQuery = await backendAPI.get<Listing>("/api/listings/listing/" + application.listingId);
        const propertyQuery = await backendAPI.get<Property>("/api/properties/property/" + application.propertyId);
        const unitsQuery = await backendAPI.get("api/units/ids/", {
          params: {
            unitIds: application.unitIds.join(","),
            fields: "name,number_of_bedrooms,area,price",
          }
        });
        setData({
          application,
          listing: listingQuery.data,
          property: propertyQuery.data,
          units: unitsQuery.data.items,
        });
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [session.status]);

  return isLoading ? (
    <Loading/>
  ) : error ? (
    <div className="w-full h-full flex justify-center items-center">
      <p className="text-red-500">Error: {JSON.stringify(error)}</p>
    </div>
  ) : (
    <div className="container h-full py-10 space-y-4">
      <div className="flex flex-row items-center gap-2">
        <Button variant="ghost" onClick={() => router.back()}>
          <MoveLeft className="w-8 h-8" />
        </Button>
        <div className="space-y-2">
          <h1 className="text-2xl ">{data?.property.fullAddress}</h1>
          <h2 className="text-xl">
            {GetLocationName(
              data.property.city,
              data.property.district,
              data.property.ward ? data.property.ward : "",
            )}
          </h2>
        </div>
      </div>

      <div className="px-4 py-6 border space-y-4 bg-card">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-2xl font-medium">{data?.application.fullName}</h1>
          <div className="flex flex-row gap-2">
            {/* <Button variant="outline">Đồngy ý 1 phần</Button> // To get applicant's allowance to view his/her criminal report */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">Chấp nhận</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="flex flex-col items-center space-y-3">
                  <FaCheckCircle size={32} color="green" />
                  <DialogTitle>Đơn ứng tuyển đã được thông qua</DialogTitle>
                  <DialogDescription>Tin tốt sẽ được thông báo tới các ứng viên.</DialogDescription>
                </DialogHeader>
                <Separator className="my-6"/>
                <div className="flex flex-col items-center space-y-3">
                  <h2 className="text-center">Tiếp theo, cung cấp một số thông tin về nơi ở mới của bạn</h2>
                  <ul className="list-disc">
                    <li>Thiết lập, quản lý thông tin thanh toán</li>
                    <li>Lưu trữ tài liệu cho thuê</li>
                  </ul>
                  <div className="space-y-2">
                    <Button variant="default">Thiết đặt</Button>
                    <Button variant="link">Tôi sẽ xem xét sau</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Từ chối</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Từ chối đơn thuê nhà</DialogTitle>
                  <DialogDescription>Ứng viên sẽ được thông báo và bạn không còn xem được đơn ứng tuyển này. </DialogDescription>
                </DialogHeader>
                <div className="flex flex-row justify-end gap-2">
                  <Button variant="ghost">Hủy</Button>
                  <Button variant="destructive">Từ chối</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 w-full">
          <div className="space-y-2">
            <div className="text-lg font-medium">Submitted</div>
            <div className="text-base font-normal">10/24/19 @ 2:27</div>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium">Hộ gia đình</div>
            <div className="text-base font-normal">1 người</div>
          </div>
          <div className="space-y-2 col-span-2">
            <div className="text-lg font-medium">Thời gian chuyển đến dự kiến</div>
            <div className="text-base font-normal">{data?.application.moveinDate.toDateString()}, Dự kiến thuê {data?.application.preferredTerm} tháng</div>
          </div>
          <StatusCard title="Thu nhập" value={`${data.application.employmentMonthlyIncome/data.listing.price}x giá thuê`} className="border-red-400" />
          <StatusCard title="Nghề nghiệp" value={"Ky sư"} className="border-green-400" />
          <StatusCard title="Trạng thái" value="Đang chờ" className="border-gray-400" />
        </div>
      </div>

      <Tabs.Root defaultValue="basic" className={styles.TabsRoot}>
        <Tabs.List className={styles.TabsList}>
          <Tabs.Trigger value="basic" className={styles.TabsTrigger}>
            Thông tin cơ bản
          </Tabs.Trigger>
          <Tabs.Trigger value="personal" className={styles.TabsTrigger}>
            Thông tin cá nhân
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className={styles.TabsContent} value="basic">
          <BasicInfo data={data}/>
        </Tabs.Content>
        <Tabs.Content className={styles.TabsContent} value="personal">
          <Personal data={data}/>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};
