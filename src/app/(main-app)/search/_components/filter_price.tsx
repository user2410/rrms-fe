import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BsChevronDown } from "react-icons/bs";
import { SearchFormValues } from "../../_components/landing-page/search_box";

export default function PriceFilter() {
  const form = useFormContext<SearchFormValues>();
  const [open, setOpen] = useState(false);

  const [min, setMin] = useState<number | undefined>(form.getValues("lminPrice"));
  const [max, setMax] = useState<number | undefined>(form.getValues("lmaxPrice"));
  const [error, setError] = useState<boolean>(false);

  const _min = form.watch("lminPrice");
  const _max = form.watch("lmaxPrice");

  const label = useMemo(() => {
    if (_min) {
      if (_max) {
        return `${_min} triệu - ${_max} triệu`;
      }
      return `Trên ${_min} triệu`;
    }
    if (_max) {
      return `Dưới ${_max} triệu`;
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
        <Button type="button" variant="ghost" className="block text-left rounded-none h-full">
          <div className="flex items-center gap-2 text-md font-medium">
            Mức giá
            <BsChevronDown size={16} />
          </div>
          <div className="text-sm font-light">
            {label}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-2">
        <div className="flex justify-between">
          <FormItem className="flex gap-2">
            <Input
              type="number"
              className="w-20"
              value={min || ""}
              onChange={(e) => setMin(e.target.valueAsNumber)} />
            <FormDescription>triệu</FormDescription>
          </FormItem>
          <FormItem className="flex gap-2">
            <FormControl>
              <Input
                type="number"
                className="w-20"
                value={max || ""}
                onChange={(e) => setMax(e.target.valueAsNumber)} />
            </FormControl>
            <FormDescription>triệu</FormDescription>
          </FormItem>
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
            OK
          </Button>

        </div>
      </PopoverContent>
    </Popover>
  );
}
