"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext, useWatch } from "react-hook-form";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GetCities, GetDistricts, GetWards } from "@/utils/dghcvn";
import { Fragment, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandSeparator } from "@/components/ui/command";
import clsx from "clsx";

function CityPopover() {
  const [open, setOpen] = useState(false);
  const form = useFormContext<PropertyForm>();

  const cityCode = useWatch({
    control: form.control,
    name: "property.city",
  });

  const cities = useMemo(() => GetCities(), []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <span className="text-oneline text-ellipsis">
            {cityCode ? cities.find(c => c.id === cityCode)?.name :"Thành phố ..."}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Lọc nhanh..." />
          <CommandEmpty>Không tìm thấy.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="w-full h-72">
              {cities.map((c, i) => (
                <CommandItem 
                  key={i} 
                  value={c.id}
                  onSelect={() => {
                    form.setValue("property.district", "");
                    form.setValue("property.ward", "");
                    form.setValue('property.city', c.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={clsx(
                      "mr-2 h-4 w-4",
                      c.id === cityCode ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {c.name}
                </CommandItem>
              ))}
            </ScrollArea>
            <CommandSeparator />
          </CommandGroup>
        </Command>
        <div className="w-full flex flex-row justify-end gap-2 p-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.setValue("property.city", "");
              form.setValue("property.district", "");
              form.setValue("property.ward", "");
              setOpen(false);
            }}
          >
            Đặt lại
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => setOpen(false)}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DistrictPopover() {
  const [open, setOpen] = useState(false);
  const form = useFormContext<PropertyForm>();

  const cityCode = useWatch({
    control: form.control,
    name: "property.city",
  });
  const districtId = useWatch({
    control: form.control,
    name: "property.district",
  });

  const districts = useMemo(() => GetDistricts(cityCode), [cityCode]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={!cityCode}
          aria-expanded={open}
          className="justify-between"
        >
          <span className="text-oneline text-ellipsis">
            {districtId ? districts.find(d => d.id === districtId)?.name : "Quận, huyện ..."}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Lọc nhanh..." />
          <CommandEmpty>Không tìm thấy.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="w-full h-72">
              {districts.map((d, i) => (
                <CommandItem 
                  key={i} 
                  value={d.id}
                  onSelect={() => {
                    form.setValue("property.ward", "");
                    form.setValue('property.district', d.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={clsx(
                      "mr-2 h-4 w-4",
                      d.id === districtId ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {d.name}
                </CommandItem>
              ))}
            </ScrollArea>
            <CommandSeparator />
          </CommandGroup>
        </Command>
        <div className="w-full flex flex-row justify-end gap-2 p-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.setValue("property.district", "");
              form.setValue("property.ward", "");
              setOpen(false);
            }}
          >
            Đặt lại
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => setOpen(false)}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function WardPopover() {
  const [open, setOpen] = useState(false);
  const form = useFormContext<PropertyForm>();
  
  const districtId = useWatch({
    control: form.control,
    name: "property.district",
  });
  const wardCode = useWatch({
    control: form.control,
    name: "property.ward",
  });

  const wards = useMemo(() => GetWards(districtId), [districtId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={!districtId}
          aria-expanded={open}
          className="justify-between"
        >
          <span className="text-oneline text-ellipsis">
            {wardCode ? wards.find(w => w.id === wardCode)?.name : "Phường, xã ..."}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Lọc nhanh..." />
          <CommandEmpty>Không tìm thấy.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="w-full h-72">
              {wards.map((w, i) => (
                <CommandItem 
                  key={i} 
                  value={w.id}
                  onSelect={() => {
                    form.setValue('property.ward', w.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={clsx(
                      "mr-2 h-4 w-4",
                      w.id === wardCode ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {w.name}
                </CommandItem>
              ))}
            </ScrollArea>
            <CommandSeparator />
          </CommandGroup>
        </Command>
        <div className="w-full flex flex-row justify-end gap-2 p-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.setValue("property.ward", "");
              setOpen(false);
            }}
          >
            Đặt lại
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => setOpen(false)}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function DivisionSelector() {

  return (
    <Fragment>
      <CityPopover />
      <div className="grid grid-cols-2 gap-1">
        <DistrictPopover />
        <WardPopover />
      </div>
    </Fragment>
  );
}
