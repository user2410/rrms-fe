"use client";

import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PropertiesGrid from "./_components/properties_grid";
import wait from "@/utils/wait-fn";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type ManagedProperty = {
  role: string;
  property: Property;
};

export default function ManagePropertiesPage() {
  const session = useSession();
  const router = useRouter();

  const [properties, setProperties] = useState<ManagedProperty[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (session.status !== "authenticated" || properties !== null) return;
    (async () => {
      try {
        setIsLoading(true);
        const managedPropertiesQuery = await backendAPI.get("api/properties/my-properties", {
          params: {
            fields: "name,full_address,area,orientation,lat,lng,created_at",
          },
          headers: {
            Authorization: `Bearer ${session.data?.user.accessToken}`,
          },
        });
        console.log(managedPropertiesQuery.data);
        setProperties(managedPropertiesQuery.data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [session.status]);

  return (
    <div className="container h-full py-10">
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-2xl lg:text-3xl font-light">Bất động sản của bạn</h1>
          <Button type="button" variant="default" onClick={() => router.push('/manage/properties/new')}>Tạo một bất động sản mới</Button>
        </div>
        {isLoading
          ? (
            <div className="w-full h-full flex justify-center items-center">
              <Spinner size={32} />
            </div>
          ) : error ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-red-500">Error: {JSON.stringify(error)}</p>
            </div>
          ) : properties ? (
            <PropertiesGrid initialProperties={properties} />

          ) : (null)}
      </div>
    </div>
  );
};
