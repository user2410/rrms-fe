import DivisionSelector from "@/components/complex/division-selector";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GetLocationName } from "@/utils/dghcvn";
import { ChevronDown } from "lucide-react";
import { useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "../../search_box";

export default function LocationFilter() {
  const form = useFormContext<SearchFormValues>();
  const triggerBtnRef = useRef<HTMLButtonElement>(null);

  const pcity = form.watch('pcity');
  const pdistrict = form.watch('pdistrict');
  const pward = form.watch('pward');

  const locationName = useMemo(() => GetLocationName(pcity || "", pdistrict || "", pward || ""), [pcity, pdistrict, pward]);

  function handleResetFields() {
    form.resetField("pcity");
    form.resetField("pdistrict");
    form.resetField("pward");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button ref={triggerBtnRef} type="button" role="combobox" variant="outline" className="justify-between text-ellipsis">
          {locationName ? locationName : "Toàn quốc"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] md:w-[480px]">
        <DivisionSelector
          cityFieldName="pcity"
          districtFieldName="pdistrict"
          wardFieldName="pward"
        />
        <div className="mt-3 flex flex-row justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleResetFields}>
            Đặt lại
          </Button>
          <Button type="button" onClick={() => triggerBtnRef.current?.click()}>
            Áp dụng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
