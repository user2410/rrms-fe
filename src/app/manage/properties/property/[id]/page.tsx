"use client";

import { backendAPI } from "@/libs/axios";
import { Property, getPropertyTypeText } from "@/models/property";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import * as Tabs from "@radix-ui/react-tabs";
import styles from "./_styles/page.module.css";
import PropertyTab from "./_components/property";
import PaymentTab from "./_components/payment";
import ListingsTab from "./_components/listings";
import ApplicationsTab from "./_components/applications";
import Image from "next/image";
import { GetLocationName } from "@/utils/dghcvn";

export type Data = {
  property: Property;
  units: Unit[];
};

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const session = useSession();
  const query = useQuery<Data>({
    queryKey: ['manage', 'properties', 'property', params.id],
    queryFn: async ({queryKey}) => {
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
      } as Data;
    },
    cacheTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    enabled: session.status === "authenticated",
  });

  return query.isLoading ? (
    <div>Loading...</div>
  ) : query.isError ? (
    <div>Error: {JSON.stringify(query.error)}</div>
  ) : (
    <div className="container mx-auto py-10 space-y-8">
      <div className="space-y-4">
        <Link href="/manage/properties" className="flex flex-row items-center gap-1">
          <FaArrowLeft size={16}/>
          <span>Properties</span>
        </Link>
        <div className="w-full flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium capitalize">{query.data.property.name}</h2>
            <h3 className="text-sm font-normal">{query.data.property.fullAddress}</h3>
            <h4 className="text-sm font-light">{GetLocationName(
              query.data.property.city,
              query.data.property.district,
              query.data.property.ward || "",
            )}</h4>
          </div>
          <div className="relative w-80 aspect-video">
            <Image
              src={query.data.property.media[0].url}
              // @ts-ignore
              alt={query.data.property.media[0].description || query.data.property.name}
              fill
              objectFit="cover"
            />
          </div>
        </div>
      </div>
      <Tabs.Root defaultValue="listings" className={styles.TabsRoot}>
        <Tabs.List className={styles.TabsList}>
          <Tabs.Trigger value="property" className={styles.TabsTrigger}>
            {getPropertyTypeText(query.data.property)}
          </Tabs.Trigger>
          <Tabs.Trigger value="payment" className={styles.TabsTrigger}>
            Thu chi
          </Tabs.Trigger>
          <Tabs.Trigger value="listings" className={styles.TabsTrigger}>
            Tin đăng
          </Tabs.Trigger>
          <Tabs.Trigger value="applications" className={styles.TabsTrigger}>
            Đơn ứng tuyển
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className={styles.TabsContent} value="property">
          <PropertyTab data={query.data} />
        </Tabs.Content>
        <Tabs.Content className={styles.TabsContent} value="payment">
          <PaymentTab data={query.data} />
        </Tabs.Content>
        <Tabs.Content className={styles.TabsContent} value="listings">
          <ListingsTab data={query.data} />
        </Tabs.Content>
        <Tabs.Content className={styles.TabsContent} value="applications">
          <ApplicationsTab data={query.data} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};
