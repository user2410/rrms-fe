"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Fragment, useState } from "react";
import { ListingDetail } from "../page";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { ApplicationForm } from "./main_form";
import { Checkbox } from "@/components/ui/checkbox";

export default function SelectedUnits({
  data
}: {
  data: ListingDetail;
}) {
  const form = useFormContext<ApplicationForm>();
  const unitIds = form.watch("unitIds");

  const { property } = data;
  const unitTypeText =
    ['APARTMENT', 'PRIVATE'].includes(property.type)
      ? "Căn hộ"
      : ['ROOM', 'STUDIO'].includes(property.type)
        ? "Phòng trọ"
        : null;
  const units = form.getValues("units").map(u => {
    const lu = data.units.find(_u => _u.id === u.unitId)!;
    return {
      ...u,
      ...lu,
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
              <TableHead />
              <TableHead className="text-left max-w-[50%]">{unitTypeText}</TableHead>
              <TableHead className="text-left">Tầng</TableHead>
              <TableHead className="text-left">Diện tích (m<sup>2</sup>)</TableHead>
              <TableHead className="text-left">Giá thuê (tháng)</TableHead>
              <TableHead className="text-left">Giá thuê đề nghị (tháng)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={unitIds.includes(unit.id)}
                    onCheckedChange={() => form.setValue("unitIds", unitIds.includes(unit.id) ? [] : [unit.id])}
                  />
                </TableCell>
                <TableCell className="text-left">{unit.name}</TableCell>
                <TableCell className="text-left">{unit.floor}</TableCell>
                <TableCell className="text-left">{unit.area}</TableCell>
                <TableCell className="text-left">{unit.listingPrice}</TableCell>
                <TableCell className="text-left">
                  <FormField
                    control={form.control}
                    name={`units.${index}.offeredPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!unitIds.includes(unit.id)}
                            type="number"
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Tổng giá thuê</TableCell>
              <TableCell className="text-left">{units.reduce((acc, u) => {
                if (!unitIds.includes(u.id)) return acc;
                return acc + u.listingPrice;
              }, 0)}</TableCell>
              <TableCell className="text-left">{units.reduce((acc, u) => {
                if (!unitIds.includes(u.id)) return acc;
                return acc + u.offeredPrice;
              }, 0)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Fragment>
  );
}
