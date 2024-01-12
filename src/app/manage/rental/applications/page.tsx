"use client";

import GetManagedApplications from "@/actions/application/get_managed_applications";
import Spinner from "@/components/ui/spinner";
import { Application } from "@/models/application";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ApplicationsList from "./_components/application_list";

export type ManagedApplication = {
  application: Application;
  listing: Listing;
  property: Property;
  units: Unit[];
};

export default function ApplicationPage() {
  const session = useSession();

  const [applications, setApplications] = useState<ManagedApplication[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (session.status !== "authenticated") return;
    (async () => {
      try {
        setIsLoading(true);
        const managedApplications = await GetManagedApplications(session.data.user.accessToken);
        console.log("res", managedApplications);
        setApplications(managedApplications);
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
      <div className="space-y-4">
        <h1 className="text-2xl lg:text-3xl font-light">Tin đăng của bạn</h1>
        {isLoading
          ? (
            <div className="w-full h-full flex justify-center items-center">
              <Spinner size={32} />
            </div>
          ) : error ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-red-500">Error: {JSON.stringify(error)}</p>
            </div>
          ) : applications ? (
            <ApplicationsList initialApplications={applications} />
          ) : null}
      </div>

    </div>
  );
};
