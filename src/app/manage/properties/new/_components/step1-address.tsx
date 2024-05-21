"use client";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDebounce from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { UseFormReturn, useFormContext } from "react-hook-form";
import DivisionSelector from "./division-selector";
import { ScrollArea } from "@/components/ui/scroll-area";

function Location({
  form
}: {
  form: UseFormReturn<PropertyForm, any, undefined>
}) {
  // on field placeUrl change -> send get request
  const [input, setInput] = useState<string>(form.getValues('property.placeUrl'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const debouncedValue = useDebounce<string>(input, 1500);

  // BUG: too many requests
  useEffect(() => {
    if (!debouncedValue) {
      setMessage("");
      setError("");
      return;
    }

    setLoading(true);
    // bypass cors
    axios.get('/api/location/url', {
      params: { url: debouncedValue }
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.coord) {
          const { lat, lng } = res.data.coord;
          form.setValue('property.lat', lat);
          form.setValue('property.lng', lng);
          setMessage(`Toạ độ: ${lat}, ${lng}`);
        } else {
          setMessage('Không lấy được toạ độ');
        }
        setError("");
      })
      .catch((err) => {
        console.log(err);
        form.setValue('property.placeUrl', "");
        switch (err.response.status) {
          case 400: case 404:
            setError("Link không hợp lệ");
            break;
          default:
            setError("Lỗi mạng");
            break;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [form, debouncedValue]);

  return (
    <FormField
      control={form.control}
      name="property.placeUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Link vị trí
            <span className="ml-1 text-red-600">*</span>
          </FormLabel>
          <FormControl>
            <Input
              placeholder="VD: https://maps.app.goo.gl/iKH3YbWLUVyFApp78"
              {...field}
              disabled={loading}
              onChange={(e) => {
                setInput(e.target.value);
                field.onChange(e);
              }}
            />
          </FormControl>
          <FormDescription>
            {message && (<span className="italic text-muted-foreground">{message}</span>)}
            {error && (<span className="text-red-600">{error}</span>)}
            <br></br>
            Chọn vị trí nhà cho thuê trên <a target="_blank" rel="noopener noreferrer" className="underline hover:text-primary" href="https://www.google.com/maps">bản đồ</a> và gán link vào đây. <a target="_blank" rel="noopener noreferrer" className="underline hover:text-primary" href="#">Hướng dẫn chi tiết</a>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export interface Project {
  id: number;
  name: string;
  street?: {
    id: number;
    name: string;
  };
  ward: {
    id: number;
    name: string;
  };
  lat: number;
  lng: number;
}

export default function Step1Address() {
  const [openProjectList, setOpenProjectList] = useState<boolean>(false);
  const form = useFormContext<PropertyForm>();
  const cityCode = form.watch('property.city');
  const districtId = form.watch('property.district');

  const projectQuery = useQuery<Project[]>({
    queryKey: ['manage', 'properties', 'new', 'projects', cityCode, districtId],
    queryFn: async ({ queryKey }) => {
      return (await axios.get<Project[]>('/api/location/project', {
        params: {
          cityCode: queryKey.at(4),
          districtId: queryKey.at(5),
        },
      })).data;
    },
    enabled: !!cityCode && !!districtId,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60,
  });

  return (
    <Fragment>
      <FormField
        control={form.control}
        name="property.fullAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Địa chỉ (số nhà + tên đường / ngõ ngách)
              <span className="ml-1 text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="VD: Số 1, Đại Cồ Việt" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <DivisionSelector />
      <FormField
        control={form.control}
        name="property.project"
        render={({ field }) => (
          <FormItem className="grow">
            <FormLabel>Dự án</FormLabel>
            <FormControl>
              {projectQuery.isSuccess ? (
                <div>
                  <Popover open={openProjectList} onOpenChange={setOpenProjectList}>
                    <PopoverTrigger asChild className="w-full">
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        <span className="text-oneline text-ellipsis">
                          {field.value ?? "Dự án..."}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandInput placeholder="Lọc nhanh..." />
                        {/* <ScrollArea className="w-full h-72"> */}
                        <CommandList>
                          <CommandEmpty>Không tìm thấy.</CommandEmpty>
                          {projectQuery.data.map((item, index) => (
                            <CommandItem
                              key={index}
                              value={item.id.toString()}
                              onSelect={() => {
                                field.onChange(item.name);
                                setOpenProjectList(v => !v);
                              }}
                            >
                              {item.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                        {/* </ScrollArea> */}
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <Input disabled placeholder="Chọn thành phố và quận trước" />
              )}
            </FormControl>
          </FormItem>
        )
        }
      />
      < Location form={form} />
    </Fragment >
  );
}
