import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { rentalServices } from "@/models/rental";
import { readMoneyVi } from "@/utils/currency";
import { DialogClose } from "@radix-ui/react-dialog";
import { ChangeEvent, useReducer, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormValues } from "../page";

export default function ExtraServices() {
  const form = useFormContext<FormValues>();
  const { fields: services, remove } = useFieldArray({
    control: form.control,
    name: "services.services",
  });

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
                <TableCell className="text-center">{svc.name}</TableCell>
                <TableCell className="text-center">{svc.setupBy === "LANDLORD" ? "Bên cho thuê" : "Bên thuê"}</TableCell>
                <TableCell className="text-center">{svc.provider ? svc.provider : "-"}</TableCell>
                <TableCell className="text-center">{svc.price ? svc.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : "-"}</TableCell>
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
  type: string;
  name: string;
  setupBy: "TENANT" | "LANDLORD";
  provider?: string;
  price?: number;
};

type MinorFormAction =
  | { type: "type"; payload: string }
  | { type: "name"; payload: string }
  | { type: "setupBy"; payload: "TENANT" | "LANDLORD" }
  | { type: "provider"; payload: string }
  | { type: "price"; payload: number }
  | { type: "reset" };

const minorFormInitialState: MinorFormState = {
  type: '',
  name: '',
  setupBy: 'LANDLORD',
};

function minorFormReducer(state: MinorFormState, action: MinorFormAction) {
  switch (action.type) {
    case "type":
      return { ...state, type: action.payload };
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

  const [state, dispatch] = useReducer(minorFormReducer, minorFormInitialState);
  const [selectedService, setSelectedService] = useState<string>("");

  return (
    <Dialog onOpenChange={() => {
      setSelectedService("");
      dispatch({ type: "reset" });
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
            <Label>Dịch vụ <span className="text-red-600 ml-2">*</span></Label>
            <Select
              value={selectedService}
              onValueChange={(v) => {
                setSelectedService(v as string);
                dispatch({ type: "reset" });
                dispatch({ type: "type", payload: v as string });
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
            <Label>Bên lắp đặt <span className="text-red-600 ml-2">*</span></Label>
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

          {state.type === "parking" ? (
            <div className="">
              <ParkingPrice sum={state.price} setSum={(v) => dispatch({ type: "price", payload: v})}/>
            </div>
          ) : (
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
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Hủy</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={() => {
              const sName = state.type === "other" ? state.name : rentalServices[state.type as keyof typeof rentalServices];
              console.log("about to add:", {
                name: sName,
                setupBy: state.setupBy,
                provider: state.provider,
                price: state.price,
              });
              form.setValue("services.services", [...form.getValues("services.services"), {
                name: sName,
                setupBy: state.setupBy,
                provider: state.provider,
                price: state.price,
              }]);
            }}>Thêm</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ParkingPrice({
  sum,
  setSum,
} : {
  sum?: number,
  setSum: (value: number) => void,
}) {
  const [values, setValues] = useState({
    car: 0,
    nCars: 0,
    motorbike: 0,
    nMotorbikes: 0,
    bicycle: 0,
    nBicycles: 0,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newValue = {
      ...values,
      [name]: Number(value),
    };
    setValues(newValue);
    setSum(
      newValue.car * newValue.nCars
      + newValue.motorbike * newValue.nMotorbikes
      + newValue.bicycle * newValue.nBicycles
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Phương tiện</TableHead>
          <TableHead>Số lượng</TableHead>
          <TableHead>Chi phí hàng tháng</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ô tô</TableCell>
          <TableCell>
            <Input type="number" name="nCars" value={values.nCars} onChange={handleChange} />
          </TableCell>
          <TableCell>
            <Input type="number" name="car" value={values.car} onChange={handleChange} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Xe máy</TableCell>
          <TableCell>
            <Input type="number" name="nMotorbikes" value={values.nMotorbikes} onChange={handleChange} />
          </TableCell>
          <TableCell>
            <Input type="number" name="motorbike" value={values.motorbike} onChange={handleChange} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Xe đạp</TableCell>
          <TableCell>
            <Input type="number" name="nBicycles" value={values.nBicycles} onChange={handleChange} />
          </TableCell>
          <TableCell>
            <Input type="number" name="bicycle" value={values.bicycle} onChange={handleChange} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>Tổng chi phí</TableCell>
          <TableCell>{sum?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
