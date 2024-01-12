"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Unit } from "@/models/unit";
import { Fragment } from "react";

export default function SelectedUnits({ units }: { units: Unit[] }) {
  
  return (
    <Fragment>
      <CardHeader>
        <CardTitle>Unit(s)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phòng / căn hộ</TableHead>
              <TableHead>Phòng ốc</TableHead>
              <TableHead>Diện tích (m<sup>2</sup>)</TableHead>
              <TableHead className="text-right">Giá thuê nhà (triệu/tháng)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{unit.name}</TableCell>
                <TableCell>{unit.number_of_bedrooms} phòng ngủ</TableCell>
                <TableCell>{unit.area}</TableCell>
                <TableCell className="text-right">{(unit.price/1e6).toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Tổng giá thuê 1 tháng</TableCell>
              <TableCell className="text-right">{(units.reduce((acc, u) => {
                return acc + u.price; 
              }, 0)/1e6).toFixed(1)} triệu</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Fragment>
  );
}
