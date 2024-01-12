import SelectedUnits from "@/app/(main-app)/application/[listingId]/_components/selected_units";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ManagedApplication } from "@/models/application";

export default function BasicUnits({
  data,
} : {
  data: ManagedApplication;
}) {
  return (
    <Card>
      <CardHeader className="!p-4 lg:!p-6 bg-gray-400">
        Căn hộ / phòng
      </CardHeader>
      <CardContent className="!p-4 lg:!p-6">
        <SelectedUnits units={data.units} />
      </CardContent>
    </Card>
  );
};
