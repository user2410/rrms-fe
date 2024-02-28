"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Fragment } from "react";
import { ListingDetail } from "../page";

export default function SelectedUnits({
  data
}: {
  data: ListingDetail;
}) {
  const { property, listing } = data;
  const unitTypeText =
    ['APARTMENT', 'PRIVATE'].includes(property.type)
      ? "Căn hộ"
      : ['ROOM', 'STUDIO'].includes(property.type)
        ? "Phòng trọ"
        : null;
  const units = data.units.map(u => {
    const lu = listing.units.find(_u => u.id === _u.unitId)!;
    return {
      ...u,
      price: lu.price,
    };
  });

  return (
    <Fragment>
      <CardHeader>
        <CardTitle>Phòng / căn hộ</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left max-w-[50%]">{unitTypeText}</TableHead>
              <TableHead className="text-left">Tầng</TableHead>
              <TableHead className="text-left">Diện tích (m<sup>2</sup>)</TableHead>
              <TableHead className="text-right">Giá thuê (tháng)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit, index) => (
              <TableRow key={index}>
                <TableCell className="text-left">{unit.name}</TableCell>
                <TableCell className="text-left">{unit.floor}</TableCell>
                <TableCell className="text-left">{unit.area}</TableCell>
                <TableCell className="text-right">{unit.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Tổng giá thuê 1 tháng</TableCell>
              <TableCell className="text-right">{units.reduce((acc, u) => {
                return acc + u.price;
              }, 0)}</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </CardContent>
    </Fragment>
  );
}
