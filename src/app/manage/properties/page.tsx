"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { NewPropertyManagerRequest, Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PropertiesGrid from "./_components/properties_grid";
import * as Tabs from '@radix-ui/react-tabs';
import NewManagerRequests from "./_components/new_manager_requests";

export type ManagedProperty = {
  role: string;
  property: Property & { units: Unit[] };
  listings: string[];
  rentals: string[];
};

export default function ManagePropertiesPage() {
  const router = useRouter();
  const session = useSession();

  const managedPropertiesQuery = useQuery<ManagedProperty[]>({
    queryKey: ['manage', 'properties', 'managed', session.data?.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const properties = (await backendAPI.get("api/properties/managed-properties", {
        params: {
          fields: "name,full_address,city,district,ward,area,orientation,lat,lng,media,type,primary_image,created_at",
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ([]);

      for (const property of properties) {
        const units = (await backendAPI.get(`/api/properties/property/${property.property.id}/units`, {
          headers: {
            Authorization: `Bearer ${queryKey.at(-1)}`,
          },
        })).data || ([]);
        property.property.units = units;
      }

      const res = properties.map((p: any) => ({
        ...p,
        property: {
          ...p.property,
          createdAt: new Date(p.property.createdAt),
          updatedAt: new Date(p.property.updatedAt),
        },
        listings: p.listings || [],
        rentals: p.rentals || [],
      })) as ManagedProperty[];
      return res;
    },
    enabled: session.status === 'authenticated',
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  return (
    <div className="container h-full py-10">
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-2xl lg:text-3xl font-light">Nhà cho thuê của bạn</h1>
          <Button type="button" variant="default" onClick={() => router.push('/manage/properties/new')}>Tạo một nhà cho thuê mới</Button>
        </div>
        <Tabs.Root defaultValue="requests" className="TabsRoot">
          <Tabs.List className="TabsList">
            <Tabs.Trigger className="TabsTrigger" value="properties">Quản lý</Tabs.Trigger>
            <Tabs.Trigger className="TabsTrigger" value="requests">Yêu cầu quản lý</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className="TabsContent" value="properties">
            {managedPropertiesQuery.isLoading
              ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Spinner size={32} />
                </div>
              ) : managedPropertiesQuery.isError ? (
                <div className="w-full h-full flex justify-center items-center">
                  <p className="text-red-500">
                    Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
                  </p>
                </div>
              ) : managedPropertiesQuery.isSuccess && (
                <PropertiesGrid initialProperties={managedPropertiesQuery.data} />
              )}
          </Tabs.Content>
          <Tabs.Content className="TabsContent" value="requests">
            <NewManagerRequests sessionData={session.data!} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};
