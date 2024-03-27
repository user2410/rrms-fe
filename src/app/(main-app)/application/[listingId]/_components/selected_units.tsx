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
  const unitId = form.watch("unitId");

  const { listing, property } = data;
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
        <CardTitle>{form.getValues("ld.property.type") === "OFFICE" ? "Văn phòng" : "Phòng / căn hộ"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead className="text-left max-w-[50%]">{unitTypeText}</TableHead>
              <TableHead className="text-left">Diện tích (m<sup>2</sup>)</TableHead>
              {!listing.priceNegotiable && (
                <TableHead className="text-left">Giá thuê (tháng)</TableHead>
              )}
              <TableHead className="text-left">Giá thuê đề nghị (tháng)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={unitId.includes(unit.id)}
                    onCheckedChange={() => form.setValue("unitId", unit.id)}
                  />
                </TableCell>
                <TableCell className="text-left">{unit.name}</TableCell>
                <TableCell className="text-left">{unit.area}</TableCell>
                {!listing.priceNegotiable && (
                  <TableCell className="text-left">{unit.listingPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                )}
                <TableCell className="text-left">
                  <FormField
                    control={form.control}
                    name={`units.${index}.offeredPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!unitId.includes(unit.id)}
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
              <TableCell colSpan={3}>Tổng giá thuê</TableCell>
              {!listing.priceNegotiable && (
                <TableCell className="text-left">{units.reduce((acc, u) => {
                  if (!unitId.includes(u.id)) return acc;
                  return acc + u.listingPrice;
                }, 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
              )}
              <TableCell className="text-left">{units.reduce((acc, u) => {
                if (!unitId.includes(u.id)) return acc;
                return acc + u.offeredPrice;
              }, 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Fragment>
  );
}
