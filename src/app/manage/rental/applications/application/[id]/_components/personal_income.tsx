import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ManagedApplication } from "@/models/application";
import Image from "next/image";

export default function PersonalIncome({
  data,
}: {
  data: ManagedApplication;
}) {
  return (
    <Card>
      <CardHeader className="!p-4 lg:!p-6 bg-gray-400">
        Thu nhập
      </CardHeader>
      <CardContent className="!p-4 lg:!p-6">
        <div className="grid grid-cols-2">
          <div className="space-y-4">
            <div className="space-x-1">
              <span className="text-2xl font-medium">{data.application.employmentMonthlyIncome}</span>
              <span className="text-xl font-normal">triệu/tháng</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-medium">Ghi chú</div>
              <p>{data.application.employmentComment}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium">Thống kê thu nhập</div>
            <div className="grid grid-cols-4 gap-2 w-full">
              {data.application.employmentProofsOfIncome?.map((income, index) => (
                <div className="relative aspect-[3/4]" key={index}>
                  <Image
                    src={income}
                    fill
                    alt={index.toString()}
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
