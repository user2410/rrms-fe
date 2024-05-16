import { readMoneyVi } from "@/utils/currency";
import { FormDescription } from "../ui/form";

export default function FieldMoneyDescription({value} : {value?: number}) {
  return (
    <FormDescription>{value ? `${value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}` : ""} {value ? `(${readMoneyVi(value)})` : ""}</FormDescription>
  );
};

export function MoneyDescription({value} : {value?: number}) {
  return (
    <p className="text-sm text-muted-foreground">{value ? `${value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}` : ""} {value ? `(${readMoneyVi(value)})` : ""}</p>
  );
};
