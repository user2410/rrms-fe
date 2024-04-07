"use client";

import { backendAPI } from "@/libs/axios";
import { Application } from "@/models/application";
import { Property } from "@/models/property";
import { Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { User } from "@/models/user";
import * as Tabs from '@radix-ui/react-tabs';
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import ContractCard from "./_components/contract_card";
import GeneralCard from "./_components/general";
import TenantCard from "./_components/tenant_card";
import { DataProvider, RentalData, useDataCtx } from "./_context/data.context";
import { useEffect } from "react";
import { Session } from "next-auth";

export default function RentalPageWrapper({ params: { id } }: { params: { id: string } }) {
  const session = useSession();
  const query = useQuery<RentalData>({
    queryKey: ["manage", "rentals", "rental", id],
    queryFn: async () => {
      const rental = (await backendAPI.get<Rental>("/api/rentals/rental/" + id, {
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`
        },
      })).data;
      const property = (await backendAPI.get<Property>("/api/properties/property/" + rental.propertyId, {
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`
        }
      })).data;
      const unit = (await backendAPI.get<Unit>("/api/units/unit/" + rental.unitId, {
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`
        }
      })).data;
      var application: Application | undefined;
      if (rental.applicationId) {
        application = (await backendAPI.get<Application>(`/api/applications/application/${rental.applicationId}`, {
          headers: {
            Authorization: `Bearer ${session.data!.user.accessToken}`,
          },
        })).data;
      }
      const userIds: string[] = [...property.managers.map(pm => pm.managerId)];
      if (rental.creatorId !== '00000000-0000-0000-0000-000000000000') {
        userIds.push(rental.creatorId);
      }
      const users = (await backendAPI.get<User[]>("/api/auth/credential/ids", {
        params: {
          ids: userIds,
        },
        headers: {
          Authorization: `Bearer ${session.data!.user.accessToken}`,
        },
      })).data;

      return {
        rental,
        application,
        property,
        unit,
        tenant: users.find(u => (u.id === application?.creatorId)),
        owners: users.filter(u => property.managers.find(m => m.managerId === u.id && m.role === "OWNER")),
        managers: users.filter(u => property.managers.find(m => m.role === "MANAGER" && m.managerId === u.id)),
      } as RentalData;
    },
    enabled: session.status === "authenticated",
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Đã có lỗi xảy ra</div>;
  }

  return (
    <div className="container pt-10">
      <h2 className="text-xl font-semibold">Profile thuê trọ</h2>
      <DataProvider>
        <RentalPage data={query.data} sessionData={session.data!} />
      </DataProvider>
    </div>
  );
};

function RentalPage({
  data,
  sessionData,
}: {
  data: RentalData;
  sessionData: Session;
}) {
  const { setRentalData, setSessionData, isSet } = useDataCtx();

  useEffect(() => {
    setRentalData(data);
    setSessionData(sessionData);
  }, []);

  return isSet() && (
    <>
      <GeneralCard rental={data.rental} />
      <Tabs.Root defaultValue="detail" className="TabsRoot">
        <Tabs.List className="TabsList">
          <Tabs.Trigger className="TabsTrigger" value="detail">Khách thuê</Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="payment">
            {sessionData.user.user.role === "TENANT" ? "Chi phí" : "Khoản thu"}
          </Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="maintenance">Bảo trì</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="TabsContent" value="detail">
          <div className="grid grid-cols-4 gap-4">
            <ContractCard/>
            <TenantCard/>
          </div>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="payment">
          Khoản thu
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="maintenance">
          Bảo trì
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
