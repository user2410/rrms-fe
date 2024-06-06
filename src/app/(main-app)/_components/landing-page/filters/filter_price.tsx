import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "../../search_box";
import { BsChevronDown } from "react-icons/bs";
import priceRanges from "@configs/price_ranges.json";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

type CONTEXT = "LANDING" | "SEARCH";

export default function PriceFilter({
  context = "LANDING",
}: {
  context?: CONTEXT;
}) {
  const form = useFormContext<SearchFormValues>();
  const [open, setOpen] = useState(false);

  const [min, setMin] = useState<number | undefined>(form.getValues("lminPrice"));
  const [max, setMax] = useState<number | undefined>(form.getValues("lmaxPrice"));
  const [error, setError] = useState<boolean>(false);

  const _min = form.watch("lminPrice");
  const _max = form.watch("lmaxPrice");

  const label = useMemo(() => {
    if (_min) {
      const __min = _min / 1e6;
      if (_max) {
        const __max = _max / 1e6;
        return `${__min} triệu - ${__max} triệu`;
      }
      return `Trên ${__min} triệu`;
    }
    if (_max) {
      const __max = _max / 1e6;
      return `Dưới ${__max} triệu`;
    }
    return "Giá thuê...";
  }, [_min, _max]);

  return (
    <Popover open={open} onOpenChange={(open) => {
      setMin(form.getValues("lminPrice"));
      setMax(form.getValues("lmaxPrice"));
      setOpen(open);
      setError(false);
    }}>
      <PopoverTrigger asChild>
        {context === "LANDING" ? (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between text-ellipsis"
          >
            {label}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        ) : (
          <Button type="button" variant="ghost" className="block text-left rounded-none h-full">
            <div className="flex items-center gap-2 text-md font-medium">
              Mức giá
              <BsChevronDown size={16} />
            </div>
            <div className="text-sm font-light">
              {label}
            </div>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-2 space-y-4">
        <div className="flex flex-row justify-between">
          <div className="flex-grow flex flex-row items-center gap-2">
            <Label>Từ:</Label>
            <Input
              type="number"
              min={0}
              className="w-20"
              value={min ? min/1e6 : ""}
              onChange={(e) => setMin(e.target.valueAsNumber * 1e6)} />
            <FormDescription>triệu</FormDescription>
          </div>
          <div className="flex-grow flex flex-row items-center gap-2">
            <Label>Đến:</Label>
            <Input
              type="number"
              min={0}
              className="w-20"
              value={max ? max/1e6 : ""}
              onChange={(e) => setMax(e.target.valueAsNumber * 1e6)} />
            <FormDescription>triệu</FormDescription>
          </div>
        </div>
        <div className="flex flex-row items-center flex-wrap gap-2">
          {priceRanges.map((item, index) => (
            <Badge
              key={index}
              onClick={() => {
                // @ts-ignore
                setMin(item.min * 1e6);
                // @ts-ignore
                setMax(item.max * 1e6);
              }}
              className="cursor-pointer"
            >
              {item.title}&nbsp;triệu
            </Badge>
          ))}
        </div>
        {error && (
          <p className="text-sm font-medium text-destructive">
            Giá tối thiểu phải nhỏ hơn giá tối đa
          </p>
        )}
        <div className="w-full flex flex-row justify-end gap-2 py-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setMin(undefined);
              setMax(undefined);
            }}
          >
            Đặt lại
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              if ((min as number) > (max as number)) {
                setError(true);
                return;
              }
              form.setValue("lminPrice", min);
              form.setValue("lmaxPrice", max);
              setOpen(false);
            }}
          >
            Áp dụng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
