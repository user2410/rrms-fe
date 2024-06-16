import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { Rental, RentalPayment } from "@/models/rental";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { Session } from "next-auth";
import { useState } from "react";
import { DataTable } from "./data_table";
import { finishedPaymentsColumns, pendingPaymentsColumns } from "./incomes_column";

export type RentalPaymentItem = {
  payment: RentalPayment;
  rental: Rental;
  property: Property;
  unit: Unit;
};

function transformResult(payments: RentalPaymentItem[]) {
  return payments.map((item: RentalPaymentItem) => ({
    payment: {
      ...item.payment,
      startDate: new Date(item.payment.startDate),
      endDate: new Date(item.payment.endDate),
      paymentDate: item.payment.paymentDate ? new Date(item.payment.paymentDate) : undefined,
      expiryDate: item.payment.expiryDate ? new Date(item.payment.expiryDate) : undefined,
    },
    rental: {
      ...item.rental,
      startDate: new Date(item.rental.startDate),
      moveinDate: new Date(item.rental.moveinDate),
      createdAt: new Date(item.rental.createdAt),
      updatedAt: new Date(item.rental.updatedAt),
    },
    property: {
      ...item.property,
      createdAt: new Date(item.property.createdAt),
      updatedAt: new Date(item.property.updatedAt),
    },
    unit: item.unit,
  })) as RentalPaymentItem[];
}

export default function IncomesTab({
  sessionData,
} : {
  sessionData: Session;
}) {
  const [pendingPaginationState, setPendingPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [finishedPaginationState, setFinishedPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pendingQuery = useQuery<RentalPaymentItem[]>({
    queryKey: ["manage", "payments", "incomes", pendingPaginationState, pendingPaginationState, sessionData.user.accessToken],
    queryFn: async ({queryKey}) => {
      const pagination = queryKey.at(2) as PaginationState;
      const pendingPayments = (await backendAPI.get<RentalPaymentItem[]>("/api/rental-payments/managed-payments", {
        params: {
          limit: pagination.pageSize,
          offset: pagination.pageIndex,
          status: ['PLAN', 'ISSUED', 'PENDING', 'REQUEST2PAY', 'PARTIALLYPAID', 'PAYFINE'],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);
      return transformResult(pendingPayments);
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });
  
  const finishedQuery = useQuery<RentalPaymentItem[]>({
    queryKey: ["manage", "payments", "incomes", finishedPaginationState, sessionData.user.accessToken],
    queryFn: async ({queryKey}) => {
      const pagination = queryKey.at(2) as PaginationState;
      const finishedPayments = (await backendAPI.get<RentalPaymentItem[]>("/api/rental-payments/managed-payments", {
        params: {
          limit: pagination.pageSize,
          offset: pagination.pageIndex,
          status: ['PAID', 'CANCELLED'],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);
      return transformResult(finishedPayments);
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Khoản thu đang xử lý</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={pendingPaymentsColumns(sessionData, pendingQuery.refetch)}
            data={pendingQuery.data || []}
            query={pendingQuery}
            onPaginationChange={setPendingPaginationState}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Khoản thu đã xử lý</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={finishedPaymentsColumns}
            data={finishedQuery.data || []}
            query={finishedQuery}
            onPaginationChange={setFinishedPaginationState}
          />
        </CardContent>
      </Card>
    </div>
  );
};
