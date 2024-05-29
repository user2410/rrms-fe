import DivisionSelector from "@/components/complex/division-selector";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GetLocationName } from "@/utils/dghcvn";
import { PopoverClose } from "@radix-ui/react-popover";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { BsChevronDown } from "react-icons/bs";
import { SearchFormValues } from "../../_components/search_box";

export default function LocationFilter() {
  const router = useRouter();
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
        <Button type="button" variant="ghost" className="block text-left rounded-none h-full">
          <div className="flex items-center gap-2 text-md font-medium">
            Khu vực
            <BsChevronDown size={16} />
          </div>
          <div className="text-sm font-light">
            {locationName ? locationName : "Toàn quốc"}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <DivisionSelector
          cityFieldName="pcity"
          districtFieldName="pdistrict"
          wardFieldName="pward"
        />
        <div className="flex flex-row items-center mt-3 gap-2">
          <Button type="button" variant="outline" onClick={handleResetFields}>
            Đặt lại
          </Button>
          <PopoverClose asChild>
            <Button
              type="button"
              variant="default"
            >
              Áp dụng
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
