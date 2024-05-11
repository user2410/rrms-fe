"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PropertiesGrid from "./_components/properties_grid";
import { Unit } from "@/models/unit";
import { useState } from "react";

export type ManagedProperty = {
  role: string;
  property: Property & {units: Unit[]};
};

export default function ManagePropertiesPage() {
  const router = useRouter();
  const session = useSession();

  const myPropertiesQuery = useQuery<ManagedProperty[]>({
    queryKey: ['manage', 'properties'],
    queryFn: async () => {
      const properties = (await backendAPI.get("api/properties/my-properties", {
        params: {
          fields: "name,full_address,city,district,ward,area,orientation,lat,lng,media,type,primary_image,created_at",
        },
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`,
        },
      })).data || ([]);

      for(const property of properties) {
        const units = (await backendAPI.get(`/api/properties/property/${property.property.id}/units`, {
          headers: {
            Authorization: `Bearer ${session.data?.user.accessToken}`,
          },
        })).data || ([]);
        property.property.units = units;
      }

      const res = properties.map((p : any) => ({
        ...p, 
        property: {
          ...p.property,
          createdAt: new Date(p.property.createdAt),
          updatedAt: new Date(p.property.updatedAt),
        }
      })) as ManagedProperty[];
      console.log(res);
      return res;
    },
    enabled: session.status === 'authenticated',
    staleTime: 1 * 60 * 1000,
    cacheTime: 1 * 60 * 1000,
  });

  return (
    <div className="container h-full py-10">
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-2xl lg:text-3xl font-light">Nhà cho thuê của bạn</h1>
          <Button type="button" variant="default" onClick={() => router.push('/manage/properties/new')}>Tạo một nhà cho thuê mới</Button>
        </div>
        {myPropertiesQuery.isLoading
          ? (
            <div className="w-full h-full flex justify-center items-center">
              <Spinner size={32} />
            </div>
          ) : myPropertiesQuery.isError ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-red-500">
                Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
              </p>
            </div>
          ) : myPropertiesQuery.isSuccess ?(
            <PropertiesGrid initialProperties={myPropertiesQuery.data} />
          ) : null}
      </div>
    </div>
  );
};
