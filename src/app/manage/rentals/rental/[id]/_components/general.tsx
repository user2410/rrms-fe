import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/models/property";
import { Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { nMonthsToYears } from "@/utils/time";
import { addMonths } from "date-fns";
import Link from "next/link";

export default function GeneralCard({
  rental,
  property,
  unit,
} : {
  rental: Rental;
  property: Property;
  unit: Unit;
}) {
  const expiryDate = addMonths(new Date(rental.startDate), rental.rentalPeriod);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{rental.tenantName}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2">
        <div className="space-y-2">
          <div className="text-lg font-medium">Ngày bắt đầu thuê</div>
          <div className="text-base font-normal">{new Date(rental.startDate).toLocaleDateString("vi-VN")} (chuyển tới thuê ngày {new Date(rental.moveinDate).toLocaleDateString("vi-VN")})</div>
        </div>
        <div className="space-y-2">
          <div className="text-lg font-medium">Thời hạn thuê</div>
          <div className="text-base font-normal">{nMonthsToYears(rental.rentalPeriod)} ({
            rental.status === "END" 
            ? "Đã chấm dứt thuê"
            : expiryDate.getTime() > new Date().getTime() ? `Hết hạn ${expiryDate.toLocaleDateString("vi-VN")}` : "Đã hết hạn thuê"
          })</div>
        </div>
        <div className="space-y-2">
          <div className="text-lg font-medium">Nhà cho thuê</div>
          <div>
            <Link 
              href={`/manage/properties/property/${property.id}`} 
              target="_blank"
              className="text-base font-normal hover:underline text-blue-400"
            >
              {property.name} (phòng {unit.name})
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
