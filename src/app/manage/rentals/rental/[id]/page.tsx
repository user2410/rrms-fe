"use client";

import { backendAPI } from "@/libs/axios";
import { Application } from "@/models/application";
import { Property } from "@/models/property";
import { Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { User } from "@/models/user";
import * as Tabs from '@radix-ui/react-tabs';
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import ContractCard from "./_components/contract_card";
import GeneralCard from "./_components/general";
import Payments from "./_components/payments";
import TenantCard from "./_components/tenant_card";
import { DataProvider, RentalData, useDataCtx } from "./_context/data.context";
import Maintenance from "./_components/maintenance";

export default function RentalPageWrapper({ params: { id } }: { params: { id: string } }) {
  const session = useSession();
  const query = useQuery<RentalData>({
    queryKey: ["manage", "rentals", "rental", id, session.data?.user.accessToken],
    queryFn: async ({queryKey}) => {
      const rental = (await backendAPI.get<Rental>("/api/rentals/rental/" + id, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        },
      })).data;
      const property = (await backendAPI.get<Property>("/api/properties/property/" + rental.propertyId, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        }
      })).data;
      const unit = (await backendAPI.get<Unit>("/api/units/unit/" + rental.unitId, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        }
      })).data;
      var application: Application | undefined;
      if (rental.applicationId) {
        application = (await backendAPI.get<Application>(`/api/applications/application/${rental.applicationId}`, {
          headers: {
            Authorization: `Bearer ${queryKey.at(-1)}`
          },
        })).data;
      }
      const userIds = new Set([...property.managers.map(pm => pm.managerId)]);
      if (rental.creatorId !== '00000000-0000-0000-0000-000000000000') {
        userIds.add(rental.creatorId);
      }
      if(rental.tenantId && rental.tenantId !== '00000000-0000-0000-0000-000000000000') {
        userIds.add(rental.tenantId);
      }
      const users = (await backendAPI.get<User[]>("/api/auth/credential/ids", {
        params: {
          ids: [...userIds],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
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
        users,
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
      <Tabs.Root defaultValue="payment" className="TabsRoot">
        <Tabs.List className="TabsList">
          <Tabs.Trigger className="TabsTrigger" value="detail">Khách thuê</Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="payment">Thu chi</Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="maintenance">Bảo trì / Đề xuất</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="TabsContent" value="detail">
          <div className="grid grid-cols-4 gap-4">
            <ContractCard/>
            <div className="col-span-3">
              <TenantCard/>
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="payment">
          <Payments/>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="maintenance">
          <Maintenance/>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
