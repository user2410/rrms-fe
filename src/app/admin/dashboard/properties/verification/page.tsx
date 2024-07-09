"use client";

import { DataTable } from "@/components/complex/data_table";
import { backendAPI } from "@/libs/axios";
import { GetPropertyVerificationRequestsResponse, Property, PropertyVerificationRequest } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { columns } from "./_components/columns";
import { User } from "@/models/user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Session } from "next-auth";
import PaginationControl from "@/components/complex/pagination";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";


export type RequestItem = {
  request: PropertyVerificationRequest;
  property: Property;
  creator: User;
}

type Data = {
  fullCount: number;
  items: RequestItem[];
};

export default function VerificationPage() {
  const session = useSession();

  return (
    <div className="container h-full py-10 space-y-4">
      <h1 className="text-2xl lg:text-3xl font-light">Yêu cầu xác minh nhà cho thuê</h1>
      {session.status === "authenticated" && (
        <>
          <Requests title="Yêu cầu xác minh mới" status={["PENDING"]} sessionData={session.data} />
          <Requests title="Lịch sử xác minh" status={["APPROVED", "REJECTED"]} sessionData={session.data} />
        </>
      )}
    </div>
  );
}

function Requests({
  title,
  status,
  sessionData,
}: {
  title: string;
  status: string[];
  sessionData: Session;
}) {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const query = useQuery<Data>({
    queryKey: ["admin", "properties", "verifications", limit, offset, status, sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const requestsQuery = ((await backendAPI.get<GetPropertyVerificationRequestsResponse>("api/properties/verifications", {
        params: {
          limit: queryKey.at(3),
          offset: queryKey.at(4),
          status: queryKey.at(5),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
      })).data);
      if (!requestsQuery || !requestsQuery.items || requestsQuery.items.length === 0) {
        return {
          fullCount: 0,
          items: [] as RequestItem[],
        } as Data;
      }
      const propIds = new Set<string>();
      requestsQuery.items.forEach((request) => propIds.add(request.propertyId));
      const properties = await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          propIds: [...propIds],
          fields: "name",
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      });
      const userIds = new Set<string>();
      requestsQuery.items.forEach((request) => userIds.add(request.creatorId));
      const users = await backendAPI.get<User[]>("/api/auth/credential/ids", {
        params: {
          ids: [...userIds],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      });
      // assemble the request and property data
      return {
        fullCount: requestsQuery.fullCount,
        items: requestsQuery.items.map((request) => {
          const property = properties.data.find((property) => property.id === request.propertyId);
          const creator = users.data.find((user) => user.id === request.creatorId);
          return {
            request,
            property,
            creator,
          } as RequestItem;
        }),
      } as Data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="space-y-1 5">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>
            {query.isSuccess && (
              <>Có tất cả {query.data.fullCount} yêu cầu</>
            )}
          </CardDescription>
        </div>
        <Button variant="outline" onClick={() => query.refetch()}><RefreshCcw className="w-6 h-6" /></Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns(sessionData, query.refetch)}
          data={query.data?.items || []}
          emptyElement={query.isLoading ? "Đang tải..." : "Không có yêu cầu xác minh nào"}
        />
      </CardContent>
      <CardFooter>
        {query.isSuccess && (
          <PaginationControl 
            totalRecords={query.data.fullCount}
            recordsPerPage={limit}
            offset={offset}
            onPageChange={setOffset}
          />
        )}
      </CardFooter>
    </Card>
  );
}