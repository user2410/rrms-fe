import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { backendAPI } from "@/libs/axios";
import { getRentalPaymentReasonText, getTotalAmount, Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { RentalPaymentItem } from "./rent-arrear-tile";
import { Property } from "@/models/property";
import Link from "next/link";
import { Table, TableCell, TableRow } from "@/components/ui/table";

type Data = {
  rental: Rental;
  property: Property;
  unit: Unit;
};

export default function ArrearItem({ 
  item,
  sessionData,
} : { 
  item: RentalPaymentItem; 
  sessionData: Session;
}) {
  const query = useQuery<Data>({
    queryKey: ["manage", "arrears", "rental", item.id, item.rentalId, sessionData!.user.accessToken],
    queryFn: async ({queryKey}) => {
      const rental = (await backendAPI.get<Rental>(`/api/rentals/rental/${queryKey.at(4)}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data;
      const property = (await backendAPI.get<Property>(`/api/properties/property/${rental.propertyId}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data;
      const unit = (await backendAPI.get<Unit>(`/api/units/unit/${rental.unitId}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data;
      return { rental, property, unit } as Data;
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });

  return (
    <Card className={`${item.expiryDuration < 0 ? "bg-purple-200" : ""}`}>
      <Table>
        <TableRow>
          <TableCell>
            <div className="flex flex-row items-center gap-2">
              <Avatar>
                <AvatarFallback>{item.tenantName.split(" ").slice(-2).map(i => i[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-base font-semibold">{item.tenantName}</h3>
                <p className="font-light text-sm">
                  {query.isSuccess && (<Link href={`/manage/properties/property/${query.data.property.id}`}>{`${query.data.property.name} Phòng ${query.data.unit.name}`}</Link>)}
                </p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <p>Tiền {query.isSuccess && getRentalPaymentReasonText(item, query.data.rental.services)}</p>
          </TableCell>
          <TableCell>
            <p>{getTotalAmount(item).toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}</p>
          </TableCell>
          <TableCell>
            <div>{item.expiryDuration < 0 ? "Đã hết hạn" : `Còn ${item.expiryDuration} ngày`}</div>
          </TableCell>
        </TableRow>
      </Table>
    </Card>
  );
}
