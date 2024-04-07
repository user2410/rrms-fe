import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { rentalServices } from "@/models/rental";
import { readMoneyVi } from "@/utils/currency";
import { DialogClose } from "@radix-ui/react-dialog";
import { useReducer, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormValues } from "../page";

export default function ExtraServices() {
  const form = useFormContext<FormValues>();
  const { remove } = useFieldArray({
    control: form.control,
    name: "services",
  });
  const services = form.watch("services");

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-lg">Dịch vụ khác</CardTitle>
          <CardDescription>Dịch vụ khách thuê đăng ký sử dụng thêm</CardDescription>
        </div>
        <AddServiceModal />
      </CardHeader>
      <CardContent className="mx-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Dịch vụ</TableHead>
              <TableHead className="text-center">Bên lắp đặt</TableHead>
              <TableHead className="text-center">Nhà cung cấp</TableHead>
              <TableHead className="text-center">Giá thuê hàng tháng</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Chưa có dịch vụ nào</TableCell>
              </TableRow>
            )}
            {services.map((svc, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">{rentalServices[svc.name as keyof typeof rentalServices]}</TableCell>
                <TableCell className="text-center">{svc.setupBy === "LANDLORD" ? "Bên cho thuê" : "Bên thuê"}</TableCell>
                <TableCell className="text-center">{svc.provider ? svc.provider : "-" }</TableCell>
                <TableCell className="text-center">{svc.price ? svc.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : "-" }</TableCell>
                <TableCell className="text-center">
                  <Button type="button" onClick={() => remove(index)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

type MinorFormState = {
  name: string;
  setupBy: "TENANT" | "LANDLORD";
  provider: string;
  price?: number;
};

type MinorFormAction =
  | { type: "name"; payload: string }
  | { type: "setupBy"; payload: "TENANT" | "LANDLORD" }
  | { type: "provider"; payload: string }
  | { type: "price"; payload: number }
  | { type: "reset" };

const minorFormInitialState: MinorFormState = {
  name: 'internet',
  setupBy: 'LANDLORD',
  provider: '',
};

function minorFormReducer(state: MinorFormState, action: MinorFormAction) {
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload };
    case "setupBy":
      return { ...state, setupBy: action.payload };
    case "provider":
      return { ...state, provider: action.payload };
    case "price":
      return { ...state, price: action.payload };
    case "reset":
      return minorFormInitialState;
    default:
      return state;
  }
}

function AddServiceModal() {
  const form = useFormContext<FormValues>();
  const { append } = useFieldArray<FormValues>({
    control: form.control,
    name: "services",
  });

  const [state, dispatch] = useReducer(minorFormReducer, minorFormInitialState);
  const [selectedService, setSelectedService] = useState<string>("");

  return (
    <Dialog onOpenChange={() => {
      console.log(form.getValues("services"));
      setSelectedService("");
    }}>
      <DialogTrigger>
        <Button type="button">Thêm dịch vụ</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 my-2">
          <div className="space-y-2">
            <Label>Dịch vụ</Label>
            <Select
              value={selectedService}
              onValueChange={(v) => {
                setSelectedService(v as string);
                dispatch({ type: "reset" });
                dispatch({ type: "name", payload: v as string });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn dịch vụ" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(rentalServices).map((rs, i) => (
                  <SelectItem key={i} value={rs[0]}>{rs[1]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedService === "other" && (
              <Input
                value={state.name}
                onChange={(e) => dispatch({ type: "name", payload: e.currentTarget.value })}
              />
            )}
          </div>

          <div className="space-y-2">
            <FormLabel>Bên lắp đặt</FormLabel>
            <RadioGroup
              value={state.setupBy}
              onValueChange={(v) => dispatch({ type: "setupBy", payload: v as any })}
            >
              <div className="flex flex-row items-center space-x-2">
                <RadioGroupItem value="TENANT" />
                <div className="space-y-1">
                  <Label>Bên thuê</Label>
                  <p className="text-xs font-light text-gray-500">Chịu trách nhiệm đăng ký và đóng phí trực tiếp cho nhà cung cấp dịch vụ</p>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <RadioGroupItem value="LANDLORD" />
                <div className="space-y-1">
                  <Label>Bên cho thuê</Label>
                  <p className="text-xs font-light text-gray-500">Chịu trách nhiệm đăng ký và thu phí từ bên thuê</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Nhà cung cấp</Label>
            <Input
              value={state.provider}
              onChange={(e) => dispatch({ type: "provider", payload: e.currentTarget.value })}
              autoFocus={false}
            />
          </div>

          <div className="space-y-2">
            <Label>Chi phí hàng tháng</Label>
            <Input
              value={state.price}
              autoFocus={false}
              type="number"
              onChange={(e) => dispatch({ type: "price", payload: e.currentTarget.valueAsNumber })}
            />
            <p className="text-sm font-light">{state.price ? `${state.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} (${readMoneyVi(state.price)}/tháng)` : ""}</p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Hủy</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={() => append(state)}>Thêm</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ServiceItem({
  serviceName,
  slug,
}: {
  serviceName: string;
  slug: string;
}) {
  // const form = useFormContext<FormValues>();
  const [selected, setSelected] = useState<boolean>(false);
  const [setupSide, setSetupSide] = useState<"landlord" | "tenant">();

  return (
    <>
      <TableRow>
        <TableCell className="text-left">{serviceName}</TableCell>
        <TableCell className="text-right">
          <Switch checked={selected} onCheckedChange={() => setSelected(v => !v)} />
        </TableCell>
      </TableRow>
      {selected && (
        <TableRow>
          <TableCell colSpan={3}>
            <div className="w-[480px] lg:w-[512px] border rounded-sm p-2 space-y-3">
              <div className="space-y-2">
                <h3 className="font-semibold">Bên chịu trách nhiệm lắp đặt</h3>
                <RadioGroup value={setupSide} onValueChange={(v) => setSetupSide(v as any)} >
                  <div className="flex flex-row items-center space-x-2">
                    <RadioGroupItem value="tenant" id={`${slug}_tenant`} />
                    <div className="space-y-1">
                      <Label htmlFor={`${slug}_tenant`}>Bên thuê</Label>
                      <p className="text-xs font-light text-gray-500">Chịu trách nhiệm đăng ký và đóng phí trực tiếp cho nhà cung cấp dịch vụ</p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <RadioGroupItem value="landlord" id={`${slug}_landlord`} />
                    <div className="space-y-1">
                      <Label htmlFor={`${slug}_landlord`}>Bên cho thuê</Label>
                      <p className="text-xs font-light text-gray-500">Chịu trách nhiệm đăng ký và thu phí từ bên thuê</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              <div>
                {setupSide === "tenant" && (
                  <div className="space-y-2">
                    <Label>Nhà cung cấp</Label>
                    <Input placeholder="" />
                  </div>
                )}
                {setupSide === "landlord" && (
                  <div className="space-y-2">
                    <Label>Giá {serviceName.toLowerCase()} hàng tháng</Label>
                    <Input type="text" placeholder="" />
                  </div>
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
