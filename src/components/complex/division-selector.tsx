"use client";

import { FieldValues, useFormContext, useWatch } from "react-hook-form";

import { ScrollArea } from "@/components/ui/scroll-area";
import { GetCities, GetDistricts, GetWards } from "@/utils/dghcvn";
import { Button } from "@components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandSeparator } from "@components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import { Fragment, useMemo, useState } from "react";


function CityPopover({
  cityFieldName,
  districtFieldName,
  wardFieldName,
}: {
  cityFieldName: string;
  districtFieldName: string;
  wardFieldName: string;
}) {
  const [open, setOpen] = useState(false);
  const form = useFormContext<FieldValues>();

  const cityCode = useWatch({
    control: form.control,
    name: cityFieldName,
  });

  const cities = useMemo(() => GetCities(), []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          <span className="text-oneline text-ellipsis">
            {cityCode ? cities.find(c => c.id === cityCode)?.name : "Thành phố ..."}
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
                    form.setValue(districtFieldName, "");
                    form.setValue(wardFieldName, "");
                    form.setValue(cityFieldName, c.id);
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
              form.setValue(cityFieldName, "");
              form.setValue(districtFieldName, "");
              form.setValue(wardFieldName, "");
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

function DistrictPopover({
  cityFieldName,
  districtFieldName,
  wardFieldName,
}: {
  cityFieldName: string;
  districtFieldName: string;
  wardFieldName: string;
}) {
  const [open, setOpen] = useState(false);
  const form = useFormContext<FieldValues>();

  const cityCode = useWatch({
    control: form.control,
    name: cityFieldName,
  });
  const districtId = useWatch({
    control: form.control,
    name: districtFieldName,
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
                    form.setValue(wardFieldName, "");
                    form.setValue(districtFieldName, d.id);
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
              form.setValue(districtFieldName, "");
              form.setValue(wardFieldName, "");
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

function WardPopover({
  cityFieldName,
  districtFieldName,
  wardFieldName,
}: {
  cityFieldName: string;
  districtFieldName: string;
  wardFieldName: string;
}) {
  const [open, setOpen] = useState(false);
  const form = useFormContext<FieldValues>();

  const districtId = useWatch({
    control: form.control,
    name: districtFieldName,
  });
  const wardCode = useWatch({
    control: form.control,
    name: wardFieldName,
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
                    form.setValue(wardFieldName, w.id);
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
              form.setValue(wardFieldName, "");
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

export default function DivisionSelector({
  cityFieldName,
  districtFieldName,
  wardFieldName,
}: {
  cityFieldName: string;
  districtFieldName: string;
  wardFieldName: string;
}) {
  return (
    <Fragment>
      <CityPopover
        cityFieldName={cityFieldName}
        districtFieldName={districtFieldName}
        wardFieldName={wardFieldName}
      />
      <div className="grid grid-cols-2 gap-1">
        <DistrictPopover
          cityFieldName={cityFieldName}
          districtFieldName={districtFieldName}
          wardFieldName={wardFieldName}
        />
        <WardPopover
          cityFieldName={cityFieldName}
          districtFieldName={districtFieldName}
          wardFieldName={wardFieldName}
        />
      </div>
    </Fragment>
  );
}
