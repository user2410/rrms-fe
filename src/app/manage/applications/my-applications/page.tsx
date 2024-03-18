"use client";

import { useQuery } from "@tanstack/react-query";
import { FetchedApplication } from "../_models/fetched_application";
import { backendAPI } from "@/libs/axios";
import { useSession } from "next-auth/react";
import ApplicationList from "../_components/application_list";
import Spinner from "@/components/ui/spinner";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function MyApplicationsPage() {
  const session = useSession();
  
  const query = useQuery<FetchedApplication[]>({
    queryKey: ["manage", "applications", "my-applications"],
    queryFn: async ({queryKey}) => {
      return (await backendAPI.get<FetchedApplication[]>("/api/applications/my-applications", {
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
    <div className="h-full container pt-10">
      <h1 className="text-2xl lg:text-3xl font-light">Đơn ứng tuyển của tôi</h1>
      {applications.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <p>Không có đơn ứng tuyển nào</p>
        </div>
      ) : (
        <ApplicationList
          applications={applications}
          listName="my-applications"
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
