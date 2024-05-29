import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mapPropertyTypeToText } from "@/models/property";
import { PopoverClose } from "@radix-ui/react-popover";
import clsx from "clsx";
import { Check } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { BsChevronDown } from "react-icons/bs";
import { SearchFormValues } from "../../_components/search_box";

export default function PropTypesFilter() {
  const [open, setOpen] = useState(false);
  const form = useFormContext<SearchFormValues>();
  const ptypes = form.watch('ptypes');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" className="block text-left rounded-none h-full">
          <div className="flex items-center gap-2 text-md font-medium">
            Loại nhà cho thuê
            <BsChevronDown size={16} />
          </div>
          <div className="text-sm font-light text-oneline text-ellipsis">
            {ptypes && ptypes.length > 0
              ? ptypes.map(t => mapPropertyTypeToText[t as keyof typeof mapPropertyTypeToText]).join(", ")
              : "Loaị nhà cho thuê..."}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Command>
          <CommandInput placeholder="Lọc nhanh..." />
          <CommandEmpty>Không tìm thấy.</CommandEmpty>
          <CommandGroup>
            {Object.entries(mapPropertyTypeToText).map((item) => (
              <CommandItem
                key={item[0]}
                value={item[1]}
                onSelect={() => {
                  const v = item[0].toUpperCase();
                  if (ptypes.includes(v)) {
                    form.setValue(
                      "ptypes",
                      ptypes.filter((value) => value !== v)
                    );
                  } else {
                    form.setValue("ptypes", [...ptypes, v]);
                  }
                }}
              >
                <Check
                  className={clsx(
                    "mr-2 h-4 w-4",
                    ptypes?.includes(item[0].toUpperCase()) ? "opacity-100" : "opacity-0"
                  )}
                />
                {item[1]}
              </CommandItem>
            ))}
            <CommandSeparator />
          </CommandGroup>
        </Command>
        <div className="w-full flex flex-row justify-end gap-2 p-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.setValue("ptypes", [])}
          >
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
