import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rental } from "@/models/rental";
import { nMonthsToYears } from "@/utils/time";
import { addMonths } from "date-fns";

export default function GeneralCard({
  rental,
} : {
  rental: Rental;
}) {
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
          <div className="text-base font-normal">{nMonthsToYears(rental.rentalPeriod)} (Hết hạn {addMonths(new Date(rental.startDate), rental.rentalPeriod).toLocaleDateString("vi-VN")})</div>
        </div>
      </CardContent>
    </Card>
  );
};
