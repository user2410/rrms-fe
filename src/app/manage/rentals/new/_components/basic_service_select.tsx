import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { forwardRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../page";
import { Supplier, SupplierGroup } from "../../_models/service_suppliers";
import Spinner from "@/components/ui/spinner";

type Props = {
  productId: string;
  defaultGroup: number;

  groupTitle: string;
  customerFieldName: string;
  providerFieldName: string;
};

type Data = {
  productName: string;
  suppliers: Supplier[];
  supplier_groups: SupplierGroup[];
}

export const BasicServiceSelect = forwardRef<HTMLButtonElement, Props>(function Render(
  { productId, defaultGroup, providerFieldName, customerFieldName, groupTitle },
  triggerBtnRef,
) {
  const form = useFormContext<FormValues>();
  const [selectedGroup, setSelectedGroup] = useState<number>(defaultGroup);

  const query = useQuery<Data>({
    queryKey: ["rental_services", "providers", productId],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get<Data>(`/api/payment/rental_services/providers?productId=${queryKey.at(2)}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button" ref={triggerBtnRef} variant="outline">
          Thiết đặt dịch vụ {query.data?.productName.toLowerCase() || (<Spinner size={16} />)}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[60vw]">
        <DialogHeader />
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Nhập thông tin dịch vụ {query.data?.productName.toLowerCase() || (<Spinner size={16} />)}
          </h3>
          <div className="space-y-2">
            <Label>{groupTitle}</Label>
            <div className="flex flex-row gap-2">
              {query.isSuccess ? (
                query.data.supplier_groups.map((sg: any, index: number) => (
                  <Badge key={index}
                    variant={selectedGroup === sg.supplier_group_id ? "default" : "outline"}
                    className="text-center hover:cursor-pointer p-2"
                    onClick={() => setSelectedGroup(sg.supplier_group_id)}
                  >
                    {sg.name.startsWith("Nước") ? sg.name.split("Nước ")[1] : sg.name}
                  </Badge>
                ))
              ) : query.isLoading ? (
                <Spinner size={16} />
              ) : null}
            </div>
          </div>
          <FormField
            control={form.control}
            name={providerFieldName as any}
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Nhà cung cấp</FormLabelRequired>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhà cung cấp dịch vụ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[50vh]">
                    <SelectGroup>
                      <SelectLabel>Nhà cung cấp</SelectLabel>
                      {query.isSuccess ? (
                        query.data.suppliers.
                          filter((s) => s.group_id === selectedGroup).
                          map((s, index) => (
                            <SelectItem value={s.name} key={index}>
                              <div className="flex flex-row items-center gap-2">
                                <img
                                  src={`https://stccps.zpapps.vn/input/logo/${s.icon}@3x.png?v=2051?w=3840`}
                                  alt="supplier-logo" loading="lazy" width="18" height="18" decoding="async" data-nimg="1" className="min-w-[18px]" sizes="100vw"
                                />
                                <Label>{s.name}</Label>
                              </div>
                            </SelectItem>
                          ))
                      ) : query.isLoading ? (
                        <Spinner size={16} />
                      ) : null}
                    </SelectGroup>
                  </SelectContent>
                  <FormMessage />
                </Select>
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name={customerFieldName as any}
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Mã khách hàng</FormLabelRequired>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit">Lưu</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
});
