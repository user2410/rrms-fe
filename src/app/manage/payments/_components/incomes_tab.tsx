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
      const pendingPayments = (await backendAPI.get<RentalPayment[]>("/api/rental-payments/managed-payments", {
        params: {
          limit: pagination.pageSize,
          offset: pagination.pageIndex,
          status: ['PLAN', 'ISSUED', 'PENDING', 'REQUEST2PAY', 'PARTIALLYPAID', 'PAYFINE'],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);

      const rids = new Set<number>();
      pendingPayments.forEach((payment) => rids.add(payment.rentalId));
      // Promise all to get rentals
      const rPromises = [...rids].map((id) => (backendAPI.get<Rental>(`/api/rentals/rental/${id}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })));
      const rentals = (await Promise.all(rPromises)).map((res) => res.data);
      
      const propIds = new Set<string>();
      rentals.forEach((rental) => propIds.add(rental.propertyId));
      const properties = (await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          fields: "name,city,district,ward,managers",
          propIds: [...propIds],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);

      const unitIds = new Set<string>();
      rentals.forEach((rental) => unitIds.add(rental.unitId));
      const units = (await backendAPI.get<Unit[]>("/api/units/ids", {
        params: {
          fields: "name",
          unitIds: [...unitIds],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);

      // assemble the result
      return pendingPayments.map((payment) => {
        const rental = rentals.find((r) => r.id === payment.rentalId)!;
        const property = properties.find((p) => p.id === rental.propertyId);
        const unit = units.find((u) => u.id === rental.unitId);
        return {
          payment: {
            ...payment,
            startDate: new Date(payment.startDate),
            endDate: new Date(payment.endDate),
            paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : undefined,
            expiryDate: payment.expiryDate ? new Date(payment.expiryDate) : undefined,
          },
          rental: {
            ...rental,
            startDate: new Date(rental.startDate),
            moveinDate: new Date(rental.moveinDate),
            createdAt: new Date(rental.createdAt),
            updatedAt: new Date(rental.updatedAt),
          },
          property,
          unit,
        } as RentalPaymentItem;
      });
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });
  
  const finishedQuery = useQuery<RentalPaymentItem[]>({
    queryKey: ["manage", "payments", "incomes", finishedPaginationState, sessionData.user.accessToken],
    queryFn: async ({queryKey}) => {
      const pagination = queryKey.at(2) as PaginationState;
      const finishedPayments = (await backendAPI.get<RentalPayment[]>("/api/rental-payments/managed-payments", {
        params: {
          limit: pagination.pageSize,
          offset: pagination.pageIndex,
          status: ['PAID', 'CANCELLED'],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);

      const rids = new Set<number>();
      finishedPayments.forEach((payment) => rids.add(payment.rentalId));
      // Promise all to get rentals
      const rPromises = [...rids].map((id) => (backendAPI.get<Rental>(`/api/rentals/rental/${id}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })));
      const rentals = (await Promise.all(rPromises)).map((res) => res.data);
      
      const propIds = new Set<string>();
      rentals.forEach((rental) => propIds.add(rental.propertyId));
      const properties = (await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          fields: "name,city,district,ward,managers",
          propIds: [...propIds],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);

      const unitIds = new Set<string>();
      rentals.forEach((rental) => unitIds.add(rental.unitId));
      const units = (await backendAPI.get<Unit[]>("/api/units/ids", {
        params: {
          fields: "name",
          unitIds: [...unitIds],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);

      // assemble the result
      return finishedPayments.map((payment) => {
        const rental = rentals.find((r) => r.id === payment.rentalId)!;
        const property = properties.find((p) => p.id === rental.propertyId);
        const unit = units.find((u) => u.id === rental.unitId);
        return {
          payment: {
            ...payment,
            startDate: new Date(payment.startDate),
            endDate: new Date(payment.endDate),
            paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : undefined,
            expiryDate: payment.expiryDate ? new Date(payment.expiryDate) : undefined,
          },
          rental: {
            ...rental,
            startDate: new Date(rental.startDate),
            moveinDate: new Date(rental.moveinDate),
            createdAt: new Date(rental.createdAt),
            updatedAt: new Date(rental.updatedAt),
          },
          property,
          unit,
        } as RentalPaymentItem;
      });
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
