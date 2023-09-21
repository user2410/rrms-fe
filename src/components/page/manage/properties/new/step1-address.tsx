"use client";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { UseFormReturn, useFormContext } from "react-hook-form";
import DivisionSelector from "./division-selector";
import { PropertyForm } from "@/app/manage/properties/new/page";

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

  useEffect(() => {
    if (!debouncedValue) {
      setMessage("");
      setError("");
      return;
    }

    setLoading(true);
    // bypass cors
    axios.get('/api/location/url', {
      params: {url: debouncedValue}
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.coord) {
          const {lat, lng} = res.data.coord;
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
            setError("Network error");
            break;
        }
      })
      .finally(() => {
        setLoading(false);
      })
  }, [debouncedValue]);

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
            Chọn vị trí bất động sản trên <a target="_blank" rel="noopener noreferrer" className="underline hover:text-primary" href="https://www.google.com/maps">bản đồ</a> và gán link vào đây. <a target="_blank" rel="noopener noreferrer" className="underline hover:text-primary" href="#">Hướng dẫn chi tiết</a>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default function Step1Address() {
  const form = useFormContext<PropertyForm>();

  return (
    <Fragment>
      <FormField
        control={form.control}
        name="property.fullAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Địa chỉ đầy đủ
              <span className="ml-1 text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="VD: Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <DivisionSelector/>
      <Location form={form} />
    </Fragment>
  )
}
