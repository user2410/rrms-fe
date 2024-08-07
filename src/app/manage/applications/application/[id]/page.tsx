"use client";

import { Button } from "@/components/ui/button";
import * as Tabs from "@radix-ui/react-tabs";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import Loading from "@/components/ui/loading";
import { backendAPI } from "@/libs/axios";
import { Application, ManagedApplication, MapRentalIntentionToText, TransformApplicationRESTResponse } from "@/models/application";
import { Listing } from "@/models/listing";
import { getPropertyFullAddress, Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import StatusCard from "../../_components/status_card";
import AcceptDiaglog from "./_components/accept_diaglog";
import BasicInfo from "./_components/basic";
import ChatTab from "./_components/chat_tab";
import PostProcess from "./_components/post_process";
import RejectDiaglog from "./_components/reject_diaglog";
import WithdrawDiaglog from "./_components/withdraw_dialog";

export default function ApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const session = useSession();

  const { id } = params;

  const query = useQuery<ManagedApplication>({
    queryKey: ["manage", "rental", "applications", "application", id, session.data?.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const application = (await backendAPI.get<Application>(`/api/applications/application/${queryKey.at(4)}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
        transformResponse: TransformApplicationRESTResponse,
      })).data;
      if (application.status === "PENDING" && application.creatorId !== session.data!.user.user.id) {
        await backendAPI.patch(`/api/applications/application/${application.id}/status`, {
          status: "CONDITIONALLY_APPROVED",
        }, {
          headers: {
            Authorization: `Bearer ${queryKey.at(-1)}`,
          },
        });
        application.status = "CONDITIONALLY_APPROVED";
      }
      const listing = (await backendAPI.get<Listing>("/api/listings/listing/" + application.listingId, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data;
      const property = (await backendAPI.get<Property>("/api/properties/property/" + application.propertyId, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data;
      const unit = (await backendAPI.get<Unit>(`api/units/unit/${application.unitId}`)).data;
      return {
        application,
        listing,
        property,
        unit,
      };
    },
    enabled: session.status === "authenticated",
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 30,
  });

  if (query.isLoading) {
    return (<Loading />);
  }

  if (query.isError) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-red-500">Error: {JSON.stringify(query.error)}</p>
      </div>
    );
  }

  const { application, property, unit } = query.data;

  return (
    <div className="container h-full py-10 space-y-4">
      <div className="flex flex-row items-center gap-2">
        <Button variant="ghost" onClick={() => router.back()}>
          <MoveLeft className="w-8 h-8" />
        </Button>
        <div className="space-y-2">
          <h1 className="text-2xl ">{property.name}</h1>
          <h2 className="text-xl">
            {getPropertyFullAddress(query.data.property)}
          </h2>
        </div>
      </div>

      <div className="p-4 border space-y-4 bg-card">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-2xl font-medium">{application.fullName}</h1>
          <div className="flex flex-row gap-2">
            {application.creatorId === session.data!.user.user.id && ["PENDING", "CONDITIONALLY_APPROVED"].includes(application.status) && (
              <WithdrawDiaglog
                data={query.data}
                sessionData={session.data!}
              />
            )}
            {application.creatorId !== session.data!.user.user.id && !["APPROVED", "REJECTED", "WITHDRAWN"].includes(application.status) && (
              <>
                <AcceptDiaglog
                  data={query.data}
                  sessionData={session.data!}
                />
                <RejectDiaglog
                  data={query.data}
                  sessionData={session.data!}
                />
              </>
            )}
            {(application.status === "APPROVED" && application.creatorId !== session.data!.user.user.id) && (
              <PostProcess
                data={query.data}
                sessionData={session.data!}
              />
            )}
          </div>
        </div>
        <div className="w-3/4 grid grid-cols-2 lg:grid-cols-3 gap-3">
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
          ) : application.status === "WITHDRAWN" ? (
            <StatusCard title="Trạng thái" value="Đã rút đơn" className="border-slate-600" />
          ) : null}
        </div>
      </div>

      <Tabs.Root defaultValue="basic" className="TabsRoot">
        <Tabs.List className="TabsList">
          <Tabs.Trigger value="basic" className="TabsTrigger">
            Đơn ứng tuyển
          </Tabs.Trigger>
          <Tabs.Trigger value="chat" className="TabsTrigger" disabled={[ "APPROVED", "REJECTED", "WITHDRAWN"].includes(application.status)}>
            Trao đổi
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="TabsContent" value="basic">
          <BasicInfo data={query.data} />
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="chat">
          <ChatTab
            data={query.data}
            sessionData={session.data!}
          />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};
