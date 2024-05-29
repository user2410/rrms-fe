import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BsChevronDown } from "react-icons/bs";
import { SearchFormValues } from "../../_components/search_box";
import areaRanges from "@configs/area_ranges.json";
import { Badge } from "@/components/ui/badge";

export default function AreaFilter() {
  const form = useFormContext<SearchFormValues>();
  const [open, setOpen] = useState(false);

  const [min, setMin] = useState<number | undefined>(form.getValues("pminArea"));
  const [max, setMax] = useState<number | undefined>(form.getValues("pmaxArea"));
  const [error, setError] = useState<boolean>(false);

  const _min = form.watch("pminArea");
  const _max = form.watch("pmaxArea");

  const label = useMemo(() => {
    if (_min) {
      if (_max) {
        return `${_min} m2 - ${_max} m2`;
      }
      return `Trên ${_min} m2`;
    }
    if (_max) {
      return `Dưới ${_max} m2`;
    }
    return "Giá thuê...";
  }, [_min, _max]);

  return (
    <Popover open={open} onOpenChange={(open) => {
      setMin(form.getValues("pminArea"));
      setMax(form.getValues("pmaxArea"));
      setOpen(open);
      setError(false);
    }}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" className="block text-left rounded-none h-full">
          <div className="flex items-center gap-2 text-md font-medium">
            Diện tích
            <BsChevronDown size={16} />
          </div>
          <div className="text-sm font-light">
            {label}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-2 space-y-4">
        <div className="flex flex-row justify-between">
          <FormItem className="flex-grow flex flex-row gap-2">
            <Input
              type="number"
              min={0}
              className="w-20"
              value={min ? min : ""}
              onChange={(e) => setMin(e.target.valueAsNumber)} />
            <FormDescription>m<sup>2</sup></FormDescription>
          </FormItem>
          <FormItem className="flex-grow flex flex-row gap-2">
            <FormControl>
              <Input
                type="number"
                min={0}
                className="w-20"
                value={max ? max : ""}
                onChange={(e) => setMax(e.target.valueAsNumber)} />
            </FormControl>
            <FormDescription>m<sup>2</sup></FormDescription>
          </FormItem>
        </div>
        <div className="flex flex-row items-center flex-wrap gap-2">
          {areaRanges.map((item, index) => (
            <Badge
              key={index}
              onClick={() => {
                // @ts-ignore
                setMin(item.min);
                // @ts-ignore
                setMax(item.max);
              }}
              className="cursor-pointer"
            >
              {item.title}&nbsp;m<sup>2</sup>
            </Badge>
          ))}
        </div>
        {error && (
          <p className="text-sm font-medium text-destructive">
            Diện tích tối thiểu phải nhỏ hơn diện tích tối đa
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
              form.setValue("pminArea", min);
              form.setValue("pmaxArea", max);
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
