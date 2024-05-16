import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListingUnit } from "@/models/listing";
import { useMemo, useState } from "react";
import { useDataCtx } from "../_context/data.context";
import { mapUnitTypeToText, Unit } from "@/models/unit";
import { Input } from "@/components/ui/input";
import { MoneyDescription } from "@/components/complex/field-money_desc";
import { backendAPI } from "@/libs/axios";
import { Checkbox } from "@/components/ui/checkbox";

type FormValues = {
  price: number;
  securityDeposit: number;
  units: (Unit & {
    checked: boolean;
    unitId: string;
    price: number;
  })[];
};

export default function PropUnits() {
  const { listing, property, units, sessionData, setListing } = useDataCtx();
  const defaultValues = useMemo<FormValues>(() => ({
    price: listing.price,
    securityDeposit: listing.securityDeposit,
    units: units.map((unit) => ({
      ...unit,
      checked: !!listing.units.find(u => u.unitId === unit.id),
      unitId: unit.id,
      price: listing.units.find(u => u.unitId === unit.id)?.price ?? 0,
    })),
  }), [listing, units]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [values, setValues] = useState<FormValues>(defaultValues);

  async function handleChangeEditing() {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    try {
      await backendAPI.patch(`/api/listings/listing/${listing.id}`, {
        ...values,
        units: values.units.filter(u => u.checked),
        // price is average of prices all checked units
        price: values.units.filter(u => u.checked).reduce((acc, u) => acc + u.price, 0) / values.units.filter(u => u.checked).length,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        },
      });
      setListing({
        ...listing,
        ...values,
        units: values.units.map((u) => ({
          unitId: u.unitId,
          price: u.price,
          listingId: listing.id,
        })),
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Giá thuê nhà</CardTitle>
        <span className="space-x-2">
          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setValues(defaultValues);
                setIsEditing(v => !v);
              }}
            >
              Hủy chỉnh sửa
            </Button>
          )}
          <Button
            type="button"
            onClick={handleChangeEditing}
            variant={isEditing ? 'default' : 'outline'}
          >
            {isEditing ? 'Lưu' : 'Chỉnh sửa'}
          </Button>
        </span>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Giá thuê</h3>
            {isEditing && units.length <= 1 ? (
              <div className="space-y-2">
                <Input
                  type="number"
                  min={0}
                  defaultValue={listing.price}
                  value={values.price}
                  onChange={(e) => setValues(v => ({
                    ...v,
                    price: e.target.valueAsNumber,
                  }))}
                />
                <MoneyDescription value={values.price} />
              </div>
            ) : (
              <p>
                {listing.units.length > 1 && "Trung bình"}&nbsp;{listing.price.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Tiền cọc</h3>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  type="number"
                  min={0}
                  defaultValue={listing.securityDeposit}
                  value={values.securityDeposit}
                  onChange={(e) => setValues(v => ({
                    ...v,
                    securityDeposit: e.target.valueAsNumber,
                  }))}
                />
                <MoneyDescription value={values.securityDeposit} />
              </div>
            ) : (
              <p>
                {listing.securityDeposit ? listing.securityDeposit.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' }) : "Không yêu cầu"}
              </p>
            )}
          </div>
          {(units.length > 1 || isEditing) && (
            <div className="space-y-2 col-span-2">
              <h3 className="font-semibold">Phòng / Căn hộ</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    {isEditing && (
                      <TableHead>Đăng tin</TableHead>
                    )}
                    <TableHead>Phòng / Căn hộ</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Diện tích</TableHead>
                    <TableHead>Giá thuê</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {values.units.
                    filter(u => u.checked || isEditing).
                    map((unit, index) => (
                      <TableRow key={index}>
                        {isEditing && (
                          <TableCell>
                            <Checkbox
                              checked={unit.checked}
                              onCheckedChange={(c) => setValues(v => ({
                                ...v,
                                units: v.units.map((vu, vi) => vi === index ? { ...vu, checked: !!c } : vu),
                              }))}
                            />
                          </TableCell>
                        )}
                        <TableCell>{unit.name}</TableCell>
                        <TableCell>{mapUnitTypeToText[unit.type]}</TableCell>
                        <TableCell>{unit.area} m²</TableCell>
                        {isEditing ? (
                          <TableCell>
                            <Input
                              type="number"
                              disabled={!unit.checked}
                              value={unit.price}
                              onChange={(e) => setValues(v => ({
                                ...v,
                                units: v.units.map((vu, vi) => vi === index ? { ...vu, price: e.target.valueAsNumber } : vu),
                              }))}
                            />
                            <MoneyDescription value={unit.price} />
                          </TableCell>
                        ) : (
                          <TableCell>{unit.price.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}</TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

};
