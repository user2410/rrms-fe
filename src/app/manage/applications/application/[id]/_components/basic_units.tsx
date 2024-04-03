import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ManagedApplication } from "@/models/application";

export default function BasicUnits({
  data,
}: {
  data: ManagedApplication;
}) {
  const { property } = data;
  const unitTypeText =
    ['APARTMENT', 'PRIVATE'].includes(property.type)
      ? "Căn hộ"
      : ['ROOM', 'STUDIO'].includes(property.type)
        ? "Phòng trọ"
        : null;

  const unit = {
    ...data.unit,
    listingPrice: data.application.listingPrice,
    offeredPrice: data.application.offeredPrice,
  };

  return (
    <Card>
      <CardHeader className="!p-4 lg:!p-6 bg-gray-400">
        Căn hộ / phòng
      </CardHeader>
      <CardContent className="!p-4 lg:!p-6">
        {/* <SelectedUnits units={data.units} /> */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left max-w-[50%]">{unitTypeText}</TableHead>
              <TableHead className="text-left">Diện tích (m<sup>2</sup>)</TableHead>
              <TableHead className="text-right">Giá thuê (tháng)</TableHead>
              <TableHead className="text-right">Giá thuê thoả thuận (tháng)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-left">{unit.name}</TableCell>
              <TableCell className="text-left">{unit.area}</TableCell>
              <TableCell className="text-right">{unit.listingPrice}</TableCell>
              <TableCell className="text-right">{unit.offeredPrice}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
