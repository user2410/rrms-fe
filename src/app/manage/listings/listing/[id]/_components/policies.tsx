import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListingPolicy, rentalPolicies } from "@/models/listing";
import { useMemo, useState } from "react";
import { useDataCtx } from "../_context/data.context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { backendAPI } from "@/libs/axios";

type FormValues = {
  numberOfResidents?: number;
  leaseTerm?: number;
  petsAllowed?: boolean;
  policies: ListingPolicy[];
}

export default function Policies() {
  const { listing, sessionData, setListing } = useDataCtx();

  const defaultValues = useMemo<FormValues>(() => ({
    numberOfResidents: listing.numberOfResidents,
    leaseTerm: listing.leaseTerm,
    petsAllowed: listing.petsAllowed,
    policies: listing.policies,
  }), [listing]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [values, setValues] = useState<FormValues>(defaultValues);

  async function handleChangeEditing() {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    try {
      await backendAPI.patch(`/api/listings/listing/${listing.id}`, values, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        },
      });
      setListing({
        ...listing,
        ...values,
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Quy định thuê nhà</CardTitle>
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
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Số khách thuê tối đa</h3>
          {isEditing ? (
            <Input
              type="number"
              defaultValue={listing.numberOfResidents}
              value={values.numberOfResidents ?? 0}
              onChange={(e) => setValues({ ...values, numberOfResidents: e.target.valueAsNumber })}
            />
          ) : (
            <p>{listing.numberOfResidents ? `${listing.numberOfResidents} người` : "N/A"} </p>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Thời hạn thuê tối thiểu (tháng)</h3>
          {isEditing ? (
            <Input
              type="number"
              defaultValue={listing.leaseTerm}
              value={values.leaseTerm ?? 0}
              onChange={(e) => setValues({ ...values, leaseTerm: e.target.valueAsNumber })}
            />
          ) : (
            <p>{listing.leaseTerm ? `${listing.leaseTerm} tháng` : "N/A"} </p>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Cho phép nuôi thú cưng</h3>
          {isEditing ? (
            <Checkbox
              checked={values.petsAllowed}
              onCheckedChange={(e) => setValues({ ...values, petsAllowed: e as boolean })}
            />
          ) : (
            <p>{listing.petsAllowed ? "Cho phép" : listing.petsAllowed === false ? "Không" : "N/A"} </p>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Quy định khác</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại</TableHead>
                <TableHead>Mô tả</TableHead>
                {isEditing && (
                  <TableHead/>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {values.policies.map((policy, index) => (
                <TableRow key={index}>
                  {isEditing ? (
                    <>
                      <TableCell>
                        <Select
                          onValueChange={(value) => setValues(v => ({
                            ...v,
                            policies: v.policies.map((p, i) => i === index ? { ...p, policyId: parseInt(value) } : p)
                          }))}
                          defaultValue={policy.policyId.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Theme" />
                          </SelectTrigger>
                          <SelectContent>
                            {rentalPolicies.map((rp, index) => (
                              <SelectItem 
                                key={index}
                                value={rp.id.toString()}
                                disabled={values.policies.some(p => p.policyId === rp.id)}
                              >
                                {rp.text}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Textarea 
                          value={policy.note}
                          onChange={(e) => setValues(v => ({
                            ...v,
                            policies: v.policies.map((p, i) => i === index ? { ...p, note: e.target.value } : p)
                          }))}
                          rows={3}
                        />
                      </TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" onClick={() => setValues(v => ({
                          ...v,
                          policies: v.policies.filter((_, i) => i !== index),
                        }))}>Xóa</Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        {rentalPolicies.find(rp => rp.id === policy.policyId)?.text}
                      </TableCell>
                      <TableCell>{policy.note}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isEditing && (
            <Button variant="outline" type="button" onClick={() => setValues(v => ({
              ...v,
              policies: [...v.policies, { listingId: listing.id, policyId: 100, note: "" }],
            }))}>
              Thêm quy định
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
