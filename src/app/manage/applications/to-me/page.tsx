"use client";

import PaginationControl from "@/components/complex/pagination";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ApplicationList from "../_components/application_list";
import { FetchedApplication } from "../_models/fetched_application";

export default function ApplicationToMePage() {
  const session = useSession();
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);

  const totalQuery = useQuery<number>({
    queryKey: ["manage", "applications", "to-me", "total", session.data?.user.accessToken],
    queryFn: async ({ queryKey }) => {
      return ((await backendAPI.get<FetchedApplication[]>("/api/applications/to-me", {
        params: {
          limit: 1e9,
          offset: 0,
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || []).length;
    },
    enabled: session.status === "authenticated",
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  const query = useQuery<FetchedApplication[]>({
    queryKey: ["manage", "applications", "to-me", limit, offset, session.data?.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const res = (await backendAPI.get<FetchedApplication[]>("/api/applications/to-me", {
        params: {
          fields: "listing_id,property_id,unit_id,status,full_name,movein_date,preferred_term,employment_status,employment_position,employment_monthly_income,created_at",
          limit: queryKey.at(3),
          offset: queryKey.at(4),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || [];
      return res.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        moveinDate: new Date(item.moveinDate),
      }));
    },
    enabled: session.status === "authenticated",
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  if (query.isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-red-500">Error: {JSON.stringify(query.error)}</p>
      </div>
    );
  }

  const applications = query.data!;

  return (
    <div className="h-full container pt-10 space-y-4">
      <h1 className="text-2xl lg:text-3xl font-light">Đơn ứng tuyển thuê nhà của bạn</h1>
      {applications.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <p>Không có đơn ứng tuyển nào</p>
        </div>
      ) : (
        <>
          <ApplicationList
            applications={query.data!}
            listName="to-me"
          />
          <PaginationControl
            totalRecords={totalQuery.data!}
            recordsPerPage={limit}
            onPageChange={setOffset}
            offset={offset}
          />
        </>
      )}
    </div>
  );
};
