"use client";

import { Badge } from "@/components/ui/badge";
import { backendAPI } from "@/libs/axios";
import { getPrimaryImage, getPropertyTypeText } from "@/models/property";
import * as Tabs from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import ListingsTab from "./_components/listings";
import ManagersTab from "./_components/managers";
import PropertyTab from "./_components/property";
import TenantsTab from "./_components/tenants";
import { PropDataState, PropertyDataProvider, usePropDataCtx } from "./_context/property_data.context";
import { Session } from "next-auth";
import VerificationStatus from "./_components/veification_status";

export default function PropertyDetailPageWraper({ params }: { params: { id: string } }) {
  const session = useSession();
  const query = useQuery<PropDataState>({
    queryKey: ['manage', 'properties', 'property', params.id, session.data!.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const propertyQuery = await backendAPI.get(`/api/properties/property/${queryKey.at(3)}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      });
      const unitsQuery = await backendAPI.get(`/api/properties/property/${queryKey.at(3)}/units`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      });
      return {
        property: propertyQuery.data,
        units: unitsQuery.data,
      } as PropDataState;
    },
    cacheTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: session.status === "authenticated",
  });

  if (query.isLoading) {
    return (
      <div>Loading...</div>
    );
  }

  if (query.isError) {
    return (
      <div>Error: {JSON.stringify(query.error)}</div>
    );
  }

  return (
    <PropertyDataProvider>
      <PropertyDetailPage data={query.data} sessionData={session.data!} />
    </PropertyDataProvider>
  );
};

function PropertyDetailPage({
  data,
  sessionData,
}: {
  data: PropDataState;
  sessionData: Session;
}) {
  const {property, isSet, isManager, setPropData, setSessionData} = usePropDataCtx();
  
  useEffect(() => {
    setSessionData(sessionData);
    setPropData(data);
  }, []);

  const propTypeText = getPropertyTypeText({ ...data.property, units: data.units });

  return isSet() && (
    <div className="container mx-auto py-10 space-y-8">
      <div className="space-y-4">
        <Link href="/manage/properties" className="flex flex-row items-center gap-1">
          <FaArrowLeft size={16} />
          <span>Nhà cho thuê</span>
        </Link>
        <div className="w-full flex flex-row items-center justify-between">
          <div className="space-y-4">
            <Badge className="inline max-w-fit space-x-1">
              <span className="fa-regular fa-building" />
              <span>{propTypeText}</span>
            </Badge>
            <h2 className="text-2xl font-medium capitalize">{property.name}</h2>
            <VerificationStatus propertyId={property.id} sessionData={sessionData}/>
          </div>
          <div className="relative w-80 aspect-video">
            <Image
              src={getPrimaryImage(data.property)}
              // @ts-ignore
              alt={data.property.name}
              fill
              objectFit="cover"
            />
          </div>
        </div>
      </div>
      <Tabs.Root defaultValue="property" className="TabsRoot">
        <Tabs.List className="TabsList">
          <Tabs.Trigger value="property" className="TabsTrigger">
            {propTypeText}
          </Tabs.Trigger>
          <Tabs.Trigger value="managers" disabled={!isManager(sessionData.user.user.id)} className="TabsTrigger">
            Quản lý nhà trọ
          </Tabs.Trigger>
          <Tabs.Trigger value="listings" disabled={!isManager(sessionData.user.user.id)} className="TabsTrigger">
            Tin đăng
          </Tabs.Trigger>
          <Tabs.Trigger value="tenants" disabled={!isManager(sessionData.user.user.id)} className="TabsTrigger">
            Quản lý thuê trọ
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="TabsContent" value="property">
          <PropertyTab/>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="managers">
          <ManagersTab/>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="listings">
          <ListingsTab/>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="tenants">
          <TenantsTab/>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
