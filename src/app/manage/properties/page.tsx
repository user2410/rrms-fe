"use client";

import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PropertiesGrid from "./_components/properties_grid";
import wait from "@/utils/wait-fn";
import { Button } from "@/components/ui/button";

export type ManagedProperty = {
  role: string;
  property: Property;
};

export default function ManagePropertiesPage() {
  const session = useSession();

  const [properties, setProperties] = useState<ManagedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (session.status !== "authenticated") return;
    console.log(session.status, session.data?.user.accessToken);
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
  }, [session.status, session.data?.user.accessToken]);

  return (
    <div className="container h-full py-10">
      {/* Top search and filter bar */}
      {isLoading
        ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner size={32} color="green" />
          </div>
        )
        : error
          ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-red-500">Error: {JSON.stringify(error)}</p>
            </div>
          )
          : (
            <div className="space-y-4">
              <PropertiesGrid initialProperties={properties} />
              <div className="w-full flex flex-row justify-center">
                <Button variant="outline">Xem thêm</Button>
              </div>
            </div>
          )}
    </div>
  );
};
