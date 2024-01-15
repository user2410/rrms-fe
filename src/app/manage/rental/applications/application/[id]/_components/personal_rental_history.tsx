import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GetLocationName } from "@/utils/dghcvn";
import { ManagedApplication } from "@/models/application";

export default function PersonalRentalHistory({
  data,
}: {
  data: ManagedApplication;
}) {
  return (
    <Card>
      <CardHeader className="!p-4 lg:!p-6 bg-gray-400">
        Lịch sử thuê nhà
      </CardHeader>
      <CardContent className="!p-4 lg:!p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-lg font-medium">Địa chỉ thuê trọ</div>
            <div className="text-base font-normal">{data.application.rhAddress}</div>
            <div className="text-base font-normal">
              {GetLocationName(
                data.property.city,
                data.property.district,
                data.property.ward ? data.property.ward : "",
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-lg font-medium">Đã thuê ở đây</div>
              <div className="text-base font-normal">{data.application.rhRentalDuration} tháng</div>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-medium">Giá thuê</div>
              <div className="text-base font-normal">{(data.application.rhMonthlyPayment! / 1e6).toFixed(1)} triệu/tháng</div>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-medium">Lý do tạm dừng thuê</div>
              <p className="text-base font-normal">{data.application.rhReasonForLeaving}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
