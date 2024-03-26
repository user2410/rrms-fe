import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "../../search_box";

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
    return "Diện tích...";
  }, [_min, _max]);

  return (
    <Popover open={open} onOpenChange={(open) => {
      setMin(form.getValues("pminArea"));
      setMax(form.getValues("pmaxArea"));
      setOpen(open);
      setError(false);
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between text-ellipsis"
        >
          {label}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
            <FormDescription>m<sup>2</sup></FormDescription>
          </FormItem>
          <FormItem className="flex gap-2">
            <FormControl>
              <Input
                type="number"
                className="w-20"
                value={max || ""}
                onChange={(e) => setMax(e.target.valueAsNumber)} />
            </FormControl>
            <FormDescription>m<sup>2</sup></FormDescription>
          </FormItem>
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
              if((min as number) > (max as number)) {
                setError(true);
                return;
              }
              form.setValue("pminArea", min);
              form.setValue("pmaxArea", max);
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
