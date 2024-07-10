import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { getTotalAmount, Rental, RentalPayment, RentalService } from "@/models/rental";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import Link from "next/link";
import { useMemo } from "react";
import ArrearItem from "./arrear_item";
import * as Tabs from '@radix-ui/react-tabs';
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { DataTable } from "@/components/complex/data_table";
import { finishedPaymentsColumns } from "../payments/_components/incomes_column";
import { IconBadge } from "@/components/ui/icon-badge";
import { TrendingUp } from "lucide-react";

export type RentalPaymentItem = RentalPayment & {
  expiryDuration: number;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  unitId: string;
  services: RentalService[];
};

type RentalPaymentArrearsItem = {
  startTime: Date;
  endTime: Date;
  payments: RentalPaymentItem[];
};

type Data = RentalPaymentArrearsItem[];

async function getArrearsQuery({ queryKey }: { queryKey: QueryKey }) {
  const startTime = new Date(queryKey.at(-2) as any);
  const res = (await backendAPI.get<Data>("/api/statistics/manager/rentals/payments/arrears", {
    params: {
      startTime,
      endTime: new Date(),
      limit: 1000,
      offset: 0,
    },
    headers: {
      Authorization: `Bearer ${queryKey.at(-1)}`,
    },
  })).data || ([]);
  return res.map((item) => ({
    ...item,
    startTime: new Date(item.startTime),
    endTime: new Date(item.endTime),
    payments: item.payments.map((payment) => ({
      ...payment,
      startDate: new Date(payment.startDate),
      endDate: new Date(payment.endDate),
      expiryDate: payment.expiryDate ? new Date(payment.expiryDate) : undefined,
      paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : undefined,
      createdAt: new Date(payment.createdAt),
      updatedAt: new Date(payment.updatedAt),
    })),
  }));
};

export default function RentPaymentTile({
  sessionData
}: {
  sessionData: Session;
}) {
  const arrearsQuery = useQuery<Data>({
    queryKey: ["manage", "statistic", "arrears", sessionData.user.user.createdAt, sessionData!.user.accessToken],
    queryFn: getArrearsQuery,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  const lastMonthArrears = useMemo(() => {
    if (arrearsQuery.data) {
      return arrearsQuery.data[arrearsQuery.data.length - 1]?.payments || [];
    }
    return [];
  }, [arrearsQuery.data]);
  const allTimeArrears = useMemo(() => {
    if (arrearsQuery.data) {
      return arrearsQuery.data.reverse().map(item => item.payments).flat();
    }
    return [];
  }, [arrearsQuery.data]);

  // console.log("allTimeArrears:", allTimeArrears);

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <IconBadge icon={TrendingUp} variant="success"/>
          <CardTitle className="text-lg">Khoản thu</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs.Root defaultValue="arrears" className="TabsRoot px-0">
          <Tabs.List className="TabsList">
            <Tabs.Trigger className="TabsTrigger" value="arrears">Còn nợ</Tabs.Trigger>
            <Tabs.Trigger className="TabsTrigger" value="paid">Đã thanh toán</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className="TabsContent !px-0 !py-0 space-y-2" value="arrears">
            <CardDescription>
              {/* Nợ tháng này: {lastMonthArrears.reduce((acc, item) => acc + (item.status === "PAYFINE" ? (item.fine || 0) : (item.amount - (item.discount || 0) - item.paid)), 0).toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}  */}
              Tổng nợ: {allTimeArrears.reduce((acc, item) => acc + (item.status === "PAYFINE" ? (item.fine || 0) : (item.amount - (item.discount || 0) - item.paid)), 0).toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}
            </CardDescription>
            {arrearsQuery.isLoading ? (
              <div className="flex items-center justify-center">
                <Spinner size={32} />
              </div>
            ) : arrearsQuery.isError ? (
              <div className="flex items-center justify-center">
                Lỗi khi tải dữ liệu
              </div>
            ) : (
              <CardContent className="px-0 pb-0">
                <div className="space-y-3">
                  {[...lastMonthArrears, ...allTimeArrears].slice(0, 5).map((item, index) => (
                      <ArrearItem key={index} item={item} sessionData={sessionData} />
                    ))
                  }
                </div>
              </CardContent>
            )}
          </Tabs.Content>
          <Tabs.Content className="TabsContent" value="paid">
            <PaidTab sessionData={sessionData} />
          </Tabs.Content>
        </Tabs.Root>
      </CardContent>

    </Card>
  );
}

type PaidPaymentItem = {
  payment: RentalPayment;
  rental: Rental;
  property: Property;
  unit: Unit;
};

function PaidTab({
  sessionData,
}: {
  sessionData: Session;
}) {
  const query = useQuery<PaidPaymentItem[]>({
    queryKey: ["manage", "dashboard", "payments", "incomes", sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const finishedPayments = (await backendAPI.get<RentalPayment[]>("/api/rental-payments/managed-payments", {
        params: {
          limit: 100,
          offset: 0,
          status: ['PAID', 'CANCELLED', 'REQUEST2PAY', 'PARTIALLYPAID', 'PAYFINE'],
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
        } as PaidPaymentItem;
      });
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    query.isLoading ? (
      <div className="flex items-center justify-center">
        <Spinner size={32} />
      </div>
    ) : query.isError ? (
      <div className="flex items-center justify-center">
        Lỗi khi tải dữ liệu
      </div>
    ) : (
      <DataTable
        columns={[
          {
            header: "Khách thuê",
            cell: ({ row }) => {
              const { rental } = row.original;
              return (
                <Link
                  href={`/manage/rentals/rental/${rental.id}`}
                  className="font-semibold text-blue-600 hover:underline "
                >
                  {rental.tenantType === "ORGANIZATION" ? rental.organizationName : rental.tenantName}
                </Link>
              );
            }
          },
          {
            header: "Nhà cho thuê",
            cell: ({ row }) => {
              const { property, unit, rental } = row.original;
              return (
                <Link
                  href={`/manage/rentals/rental/${rental.id}`}
                  className="font-semibold text-blue-600 hover:underline truncate text-ellipsis"
                >
                  {property.name} - {unit.name}
                </Link>
              );
            }
          },
          {
            header: "Số tiền",
            cell: ({ row }) => {
              const { payment, rental } = row.original;
              return (
                <span className="">
                  {getTotalAmount(payment, rental).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              );
            },
          },
        ]}
        data={query.data.slice(0, 3) || []}
      />
    )
  );
}