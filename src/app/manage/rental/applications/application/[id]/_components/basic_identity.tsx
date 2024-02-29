import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ManagedApplication, MapIdentityTypeToText } from "@/models/application";

export default function BasicIdentity({
  data,
}: {
  data: ManagedApplication;
}) {
  return (
    <Card>
      <CardHeader className="!p-4 lg:!p-6 bg-gray-400">
        Giấy tờ tùy thân
      </CardHeader>
      <CardContent className="!p-4 lg:!p-6">
        <div className="w-full grid grid-cols-2">
          <div className="space-y-2">
            <div className="text-base font-normal">Loại</div>
            <div className="text-lg font-medium">{MapIdentityTypeToText[data.application.identityType as keyof typeof MapIdentityTypeToText]}</div>
          </div>
          <div className="space-y-2">
            <div className="text-base font-normal">Mã số</div>
            <div className="text-lg font-medium">{data.application.identityNumber}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
