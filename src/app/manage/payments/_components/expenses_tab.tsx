import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { backendAPI } from "@/libs/axios";
import { Payment } from "@/models/payment";
import { useQuery } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { Session } from "next-auth";
import { useState } from "react";
import { DataTable } from "./data_table";
import { expensesColumns } from "./expenses-column";

export default function ExpensesTab({
  sessionData,
}: {
  sessionData: Session;
}) {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const query = useQuery<Payment[]>({
    queryKey: ["manage", "payments", "expenses", sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      return (await backendAPI.get<Payment[]>("/api/payments/my-payments", {
        params: {
          limit: 100,
          offset: 0,
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <Card>
      <CardHeader/>
      <CardContent>
        <DataTable
          columns={expensesColumns}
          data={query.data || ([])}
          query={query}
          onPaginationChange={setPaginationState}
        />
      </CardContent>
    </Card>
  );
};
