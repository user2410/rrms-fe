"use client";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import ApplicationList from "../_components/application_list";
import { FetchedApplication } from "../_models/fetched_application";

export default function ApplicationToMePage() {
  const session = useSession();

  const query = useQuery<FetchedApplication[]>({
    queryKey: ["manage", "applications", "to-me"],
    queryFn: async ({ queryKey }) => {
      return (await backendAPI.get<FetchedApplication[]>("/api/applications/to-me", {
        params: {
          fields: "listing_id,property_id,units,status,full_name,movein_date,preferred_term,employment_status,employment_position,employment_monthly_income,created_at"
        },
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`,
        },
      })).data || [];
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
      {applications.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <p>Không có đơn ứng tuyển nào</p>
        </div>
      ) : (
        <ApplicationList
          applications={query.data!}
          listName="to-me"
        />
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
