import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import Link from "next/link";
import { ManagedRental } from "../rentals/page";
import { useState } from "react";
import { backendAPI } from "@/libs/axios";
import { Rental } from "@/models/rental";
import { getPrimaryImage, Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { addMonths } from "date-fns";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Empty from "@/components/complex/empty";
import { IconBadge } from "@/components/ui/icon-badge";
import { Home } from "lucide-react";

export default function CurrentRentals({
  className,
  sessionData,
}: {
  className?: string;
  sessionData: Session;
}) {
  const [limit, setLimit] = useState<number>(2);
  const [offset, setOffset] = useState<number>(0);

  const query = useQuery<ManagedRental[]>({
    queryKey: ["managed", "rentals", "my-rentals", "nonexpired", limit, offset, sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const rentals = (await backendAPI.get<Rental[]>(`/api/rentals/${queryKey.at(2)}`, {
        params: {
          fields: "property_id,unit_id,tenant_id,tenant_name,tenant_email,tenant_phone,profile_image,organization_name,start_date,movein_date,rental_period",
          limit: queryKey.at(4),
          offset: queryKey.at(5),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);
      if (rentals.length === 0) {
        return [] as ManagedRental[];
      }
      const propIds = new Set<string>();
      rentals.forEach((rental) => propIds.add(rental.propertyId));
      const properties = (await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          fields: "name",
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
      return rentals.map((rental) => {
        const property = properties.find((property) => property.id === rental.propertyId);
        const unit = units.find((unit) => unit.id === rental.unitId);
        return ({
          rental: {
            ...rental,
            startDate: new Date(rental.startDate),
            moveinDate: new Date(rental.moveinDate),
            expiryDate: addMonths(new Date(rental.startDate), rental.rentalPeriod),
            timeLeft: ((addMonths(new Date(rental.startDate), rental.rentalPeriod).getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
          },
          property,
          unit,
        }) as ManagedRental;
      });
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <IconBadge icon={Home} />
          <CardTitle className="text-lg">Nhà thuê hiện tại</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {query.isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner size={32} />
          </div>
        ) : query.isError ? (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-red-500">Đã có lỗi xảy ra</p>
          </div>
        ) : (
          query.data.length === 0 ? (
            <Empty />
          ) : (
            query.data.length === 1 ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={getPrimaryImage(query.data[0].property)}
                  alt={query.data[0].property.name}
                  className="w-10 h-10"
                />
                <div>
                  <Link
                    href={`/manage/rentals/rental/${query.data[0].rental.id}`}
                    className="text-center block"
                  >
                    {query.data[0].property.name} ({query.data[0].unit.name})
                  </Link>
                  <p className="text-center">
                    <strong>Thời gian thuê:</strong> Từ {query.data[0].rental.moveinDate.toLocaleDateString("vi-VN")} -{query.data[0].rental.expiryDate!.toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead />
                    <TableHead>Bắt đầu thuê</TableHead>
                    <TableHead>Hết hạn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {query.data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="flex flex-row items-center gap-1">
                        <img
                          src={getPrimaryImage(item.property)}
                          alt={item.property.name}
                          className="w-10 h-10"
                        />
                        <Link
                          href={`/manage/rentals/rental/${item.rental.id}`}
                        >
                          {item.property.name} ({item.unit.name})
                        </Link>
                      </TableCell>
                      <TableCell>{item.rental.moveinDate.toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>{item.rental.expiryDate!.toLocaleDateString("vi-VN")} ({item.rental.timeLeft.toFixed(0)} ngày)</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          )
        )}
      </CardContent>
    </Card>
  );
};
