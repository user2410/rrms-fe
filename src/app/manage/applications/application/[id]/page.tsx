"use client";

import { Button } from "@/components/ui/button";
import * as Tabs from "@radix-ui/react-tabs";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { backendAPI } from "@/libs/axios";
import { Application, ApplicationUnit, ManagedApplication, MapRentalIntentionToText, TransformApplicationRESTResponse } from "@/models/application";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { GetLocationName } from "@/utils/dghcvn";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { FaCheckCircle } from "react-icons/fa";
import StatusCard from "../../_components/status_card";
import styles from "../../_styles/application_list.module.css";
import BasicInfo from "./_components/basic";
import AcceptDiaglog from "./_components/accept_diaglog";
import RejectDiaglog from "./_components/reject_diaglog";

export default function ApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const session = useSession();

  const { id } = params;

  const query = useQuery<ManagedApplication>({
    queryKey: ["manage", "rental", "applications", "application", id, session.data?.user.accessToken],
    queryFn: async ({queryKey}) => {
      const application = (await backendAPI.get<Application>(`/api/applications/application/${queryKey.at(4)}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(5)}`,
        },
        transformResponse: TransformApplicationRESTResponse,
      })).data;
      if(application.status === "PENDING") {
        await backendAPI.patch(`/api/applications/application/status/${application.id}`, {
          status: "CONDITIONALLY_APPROVED",
        }, {
          headers: {
            Authorization: `Bearer ${queryKey.at(5)}`,
          },
        });
        application.status = "CONDITIONALLY_APPROVED";
      }
      const listing = (await backendAPI.get<Listing>("/api/listings/listing/" + application.listingId)).data;
      const property = (await backendAPI.get<Property>("/api/properties/property/" + application.propertyId)).data;
      const units = (await backendAPI.get<Unit[]>("api/units/ids/", {
        params: {
          unitIds: application.units.map((u: ApplicationUnit) => u.unitId).join(","),
          fields: "name,number_of_bedrooms,area",
        }
      })).data;
      return {
        application,
        listing,
        property,
        units,
      };
    },
    enabled: session.status === "authenticated",
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 30,
  });

  if(query.isLoading) {
    return (<Loading/>);
  }

  if(query.isError) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-red-500">Error: {JSON.stringify(query.error)}</p>
      </div>
    );
  }

  const {application, listing, property} = query.data;

  return (
    <div className="container h-full py-10 space-y-4">
      <div className="flex flex-row items-center gap-2">
        <Button variant="ghost" onClick={() => router.back()}>
          <MoveLeft className="w-8 h-8" />
        </Button>
        <div className="space-y-2">
          <h1 className="text-2xl ">{query.data.property.fullAddress}</h1>
          <h2 className="text-xl">
            {GetLocationName(
              property.city,
              property.district,
              property.ward ? property.ward : "",
            )}
          </h2>
        </div>
      </div>

      <div className="px-4 py-6 border space-y-4 bg-card">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-2xl font-medium">{application.fullName}</h1>
          <div className="flex flex-row gap-2">
            {/* <Button variant="outline">Đồngy ý 1 phần</Button> // To get applicant's allowance to view his/her criminal report */}
            <AcceptDiaglog
              data={query.data}
              accessKey={session.data!.user.accessToken}
              refresh={() => query.refetch()}
            />
            <RejectDiaglog
              data={query.data}
              accessKey={session.data!.user.accessToken}
              refresh={() => query.refetch()}
            />
          </div>
        </div>
        <div className="w-3/4 grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <div className="text-lg font-medium">Submitted</div>
            <div className="text-base font-normal">{new Date(application.createdAt).toLocaleDateString("vi-VN")}</div>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium">Số người thuê</div>
            <div className="text-base font-normal">{application.minors!.length + application.coaps!.length + 1} người</div>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium">Mục đích thuê</div>
            <div className="text-base font-normal">{MapRentalIntentionToText[application.rentalIntention]}</div>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium">Thời gian chuyển đến dự kiến</div>
            <div className="text-base font-normal">{new Date(application.moveinDate).toLocaleDateString("vi-VN")}</div>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium">Thời gian dự kiến thuê</div>
            <div className="text-base font-normal">{application.preferredTerm} tháng</div>
          </div>
          {application.status === "PENDING" || application.status === "CONDITIONALLY_APPROVED" ? (
            <StatusCard title="Trạng thái" value="Đang xét duyệt" className="border-yellow-400" />
          ) : application.status === "APPROVED" ? (
            <StatusCard title="Trạng thái" value="Đã chấp thuận" className="border-green-400" />
          ) : application.status === "REJECTED" ? (
            <StatusCard title="Trạng thái" value="Đã từ chối" className="border-red-600" />
          ) : null}
        </div>
      </div>

      <Tabs.Root defaultValue="basic" className={styles.TabsRoot}>
        <Tabs.List className={styles.TabsList}>
          <Tabs.Trigger value="basic" className={styles.TabsTrigger}>
            Đơn ứng tuyển
          </Tabs.Trigger>
          <Tabs.Trigger value="chat" className={styles.TabsTrigger}>
            Trao đổi
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className={styles.TabsContent} value="basic">
          <BasicInfo data={query.data}/>
        </Tabs.Content>
        <Tabs.Content className={styles.TabsContent} value="chat">
          Cửa sổ chat
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};
