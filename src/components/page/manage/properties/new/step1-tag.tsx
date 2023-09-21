"use client";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Fragment, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IoClose } from "react-icons/io5";

export function Step1Tag() {
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useFormContext<PropertyForm>();

  const { fields, append, remove } = useFieldArray({
    name: "property.tags",
    control: form.control,
  });

  return (
    <Fragment>
      {fields.length > 0 ? (
        <div className="flex flex-row gap-1 border rounded-sm p-2">
          {fields.map((field, i) => (
            <Badge key={field.id}>
              <span>{field.tag}</span>
              <Button
                variant="ghost"
                onClick={() => remove(i)}
                className="ml-1 p-0 hover:!bg-transparent"
              >
                <IoClose size={16} />
              </Button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="w-full text-center p-2 text-muted-foreground">Chưa gắn tag</p>
      )}
      <FormItem>
        <FormLabel>Thêm tag</FormLabel>
        <FormControl>
        <div className="flex w-full items-center space-x-2">
            <Input 
              ref={inputRef} 
              placeholder="VD: Nhà nguyên căn"
              onKeyPress={(e : React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  // onKeyup doesn't do the trick :(
                  // console.log('enter press here!');
                  e.preventDefault();
                }
              }}
            />
            <Button 
              type="button"
              variant="ghost" 
              onClick={() => {
                if(inputRef.current?.value) {
                  append({tag: inputRef.current.value});
                  inputRef.current.value = "";
                }
              }}
            >+</Button>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </Fragment>
  )
}
