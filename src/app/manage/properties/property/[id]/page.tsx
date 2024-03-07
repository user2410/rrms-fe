"use client";

import { Badge } from "@/components/ui/badge";
import { backendAPI } from "@/libs/axios";
import { Property, getPrimaryImage, getPropertyTypeText } from "@/models/property";
import { Unit } from "@/models/unit";
import * as Tabs from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import ListingsTab from "./_components/listings";
import ManagersTab from "./_components/managers";
import PropertyTab from "./_components/property";
import TenantsTab from "./_components/tenants";
import styles from "./_styles/page.module.css";
import { PropDataState, PropertyDataContext, PropertyDataProvider, usePropDataCtx } from "./_context/property_data.context";
import { useEffect } from "react";

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const session = useSession();
  const query = useQuery<PropDataState>({
    queryKey: ['manage', 'properties', 'property', params.id],
    queryFn: async ({ queryKey }) => {
      const propertyQuery = await backendAPI.get(`/api/properties/property/${queryKey.at(3)}`, {
        headers: {
          Authorization: `Bearer ${session.data!.user.accessToken}`,
        },
      });
      const unitsQuery = await backendAPI.get(`/api/properties/property/${queryKey.at(3)}/units`, {
        headers: {
          Authorization: `Bearer ${session.data!.user.accessToken}`,
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

  const { property, units } = query.data;

  return (
    <PropertyDataProvider>
      <PropertyPageContext data={query.data} />
    </PropertyDataProvider>
  );
};

function PropertyPageContext({
  data,
}: {
  data: PropDataState;
}) {
  const {property, units, setPropData} = usePropDataCtx();

  useEffect(() => {
    setPropData(data);
  }, []);

  const propTypeText = getPropertyTypeText({ ...data.property, units: data.units });

  return (
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
      <Tabs.Root defaultValue="managers" className={styles.TabsRoot}>
        <Tabs.List className={styles.TabsList}>
          <Tabs.Trigger value="property" className={styles.TabsTrigger}>
            {propTypeText}
          </Tabs.Trigger>
          <Tabs.Trigger value="managers" className={styles.TabsTrigger}>
            Quản lý nhà trọ
          </Tabs.Trigger>
          <Tabs.Trigger value="listings" className={styles.TabsTrigger}>
            Tin đăng
          </Tabs.Trigger>
          <Tabs.Trigger value="tenants" className={styles.TabsTrigger}>
            Quản lý thuê trọ
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className={styles.TabsContent} value="property">
          <PropertyTab/>
        </Tabs.Content>
        <Tabs.Content className={styles.TabsContent} value="managers">
          <ManagersTab/>
        </Tabs.Content>
        <Tabs.Content className={styles.TabsContent} value="listings">
          <ListingsTab/>
        </Tabs.Content>
        <Tabs.Content className={styles.TabsContent} value="tenants">
          <TenantsTab/>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
