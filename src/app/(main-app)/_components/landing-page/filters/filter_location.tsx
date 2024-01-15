import DivisionSelector from "@/components/complex/division-selector";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GetLocationName } from "@/utils/dghcvn";
import { ChevronDown } from "lucide-react";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "../search_box";

export default function LocationFilter() {
  const form = useFormContext<SearchFormValues>();

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
        <Button type="button" role="combobox" variant="outline" className="justify-between text-ellipsis">
          {locationName ? locationName : "Toàn quốc"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <DivisionSelector
          cityFieldName="pcity"
          districtFieldName="pdistrict"
          wardFieldName="pward"
        />
        <Button type="button" variant="outline" className="mt-3" onClick={handleResetFields}>
          Đặt lại
        </Button>
      </PopoverContent>
    </Popover>
  );
};
