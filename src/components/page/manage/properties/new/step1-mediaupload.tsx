"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { PropertyFormValues } from "../../../../../app/manage/properties/new/step1";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";

export interface FileUpload {
  name: string;
  size: number;
  type: string;
  url: string;
}

function displayFileSize(fsize: number): string {
  return fsize > 1024
    ? fsize > 1048576
      ? Math.round(fsize / 1048576) + "mb"
      : Math.round(fsize / 1024) + "kb"
    : fsize + "b";
}

export default function Step1MediaUpload({ 
  accept, 
  multiple, 
  form, 
} : {
  accept?: string;
  multiple?: boolean;
  form: UseFormReturn<PropertyFormValues, any, undefined>
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const { fields, append, remove } = useFieldArray({
    name: "media",
    control: form.control,
  });
  // const [isDragEnter, setIsDragEnter] = useState<boolean>(false);

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    Object.entries(event.target.files!).forEach((e) => {
      const { name, size, type } = e[1];
      append({
        name, size, type,
        url: URL.createObjectURL(e[1])
      });
    });
    console.log(fields);
  }

  function handleRemoveFile(fileUrl: string, i: number) {
    remove(i);
    URL.revokeObjectURL(fileUrl);
  }

  return (
    <Card className="border-none">
      <CardHeader className="flex flex-row justify-between items-start px-0">
        <div className="space-y-2">
          <CardTitle>Upload ảnh</CardTitle>
          <div className="text-sm text-muted-foreground">
            <ul className="list-disc list-inside">
              <li>Đăng tối đa 24 ảnh với tất cả các loại tin</li>
              <li>Hãy dùng ảnh thật, không trùng, không chèn SĐT</li>
              <li>Mỗi ảnh kích thước tối thiểu 100x100 px, tối đa 15 MB</li>
              <li>Mô tả ảnh tối đa 45 kí tự.</li>
            </ul>
          </div>
        </div>
        <Button type="button" onClick={() => inputFileRef.current && inputFileRef.current.click()}>
          Upload ảnh
        </Button>
      </CardHeader>
      <CardContent
        onClick={() => fields.length === 0 && inputFileRef.current && inputFileRef.current.click()}
        className="p-6 cursor-pointer w-full h-full border-2 border-dashed border-primary flex gap-2 xl:gap-4 text-base select-none"
      >
        <input
          ref={inputFileRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={handleFileInputChange} />
        {fields.length === 0 && (
          <div className="w-full text-center my-3 pointer-events-none">
            <div className="fas fa-cloud-arrow-up m-2"/>
            Bấm để chọn ảnh
          </div>
        )}
        {fields.map((file, index) => (
          <Card key={file.id} className="w-[180px] shadow-md">
            <CardHeader className="h-[180px] p-2 lg:p-4">
              <img src={file.url} alt="" className="max-w-full max-h-full object-cover" />
            </CardHeader>
            <Separator />
            <CardContent className="p-2 lg:p-4">
              <CardTitle className="text-sm font-normal truncate">{file.name}</CardTitle>
              <CardDescription className="text-xs">{displayFileSize(file.size)}</CardDescription>
            </CardContent>
            <Separator />
            <CardFooter className="p-0">
              <Button className="w-full h-full bg-secondary text-secondary-foreground rounded-none" onClick={() => handleRemoveFile(file.url, index)}>Remove</Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
      <CardFooter>
        <FormField
          name="media"
          control={form.control}
          render={() => (
            <FormItem>
              <FormMessage/>
            </FormItem>
          )}
        />
      </CardFooter>
    </Card>
  );
}