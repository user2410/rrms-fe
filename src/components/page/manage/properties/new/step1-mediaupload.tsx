"use client";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Fragment, useRef, useState } from "react";
import { UseFormReturn, useFieldArray, useFormContext } from "react-hook-form";
import { IoClose } from "react-icons/io5";

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

function VideoInput({ form }: { form: UseFormReturn<PropertyForm> }) {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { fields, append, remove } = useFieldArray({
    name: "property.media",
    control: form.control,
  });
  const videos = fields.filter((item) => item.type .startsWith("VIDEO"));

  function addVideoHandler() {
    const regex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
    if (value.match(regex)) {
      append({ url: value, type: "VIDEO" });
      setValue('');
      setError('');
    } else {
      setError('Link video youtube không hợp lệ');
    }
  }

  return (
    <Fragment>
      <CardHeader className="px-0">
        <CardTitle>Thêm video từ Youtube</CardTitle>
        <div className="text-sm text-muted-foreground">
          <ul className="list-disc list-inside">
            <li>Video phải được chia sẻ công khai</li>
            <li>Video phải có độ dài ít nhất 30 giây</li>
          </ul>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-2 my-3">
          {videos.map((item, index) => (
            <div key={index} className="h-full flex items-center">
              <a href={item.url} className="flex-grow">{item.url}</a>
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <IoClose size={24} />
              </Button>
            </div>
          ))}
        </div>
        <div className="h-full flex gap-1 my-3">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="VD: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={addVideoHandler}
          >+</Button>
        </div>
        <FormDescription>
          {error && (<span className="text-red-600">{error}</span>)}
        </FormDescription>
        <FormMessage/>
      </CardContent>
    </Fragment>
  )
}

export default function Step1MediaUpload({
  accept,
  multiple,
}: {
  accept?: string;
  multiple?: boolean;
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const form = useFormContext<PropertyForm>();

  const { fields, append, remove } = useFieldArray({
    name: "property.media",
    control: form.control,
  });
  // const [isDragEnter, setIsDragEnter] = useState<boolean>(false);
  const images = fields.filter((item) => item.type.startsWith("IMAGE"));

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    Object.entries(event.target.files!).forEach((e) => {
      const { name, size, type } = e[1];
      append({
        name, size,
        type: type.toUpperCase(),
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
        onClick={() => images.length === 0 && inputFileRef.current && inputFileRef.current.click()}
        className="p-6 cursor-pointer w-full h-full border-2 border-dashed border-primary flex flex-wrap gap-2 xl:gap-4 text-base select-none"
      >
        <input
          ref={inputFileRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={handleFileInputChange} />
        {images.length === 0 && (
          <div className="w-full text-center my-3 pointer-events-none">
            <div className="fas fa-cloud-arrow-up m-2" />
            Bấm để chọn ảnh
          </div>
        )}
        {images.map((file, index) => (
          <Card key={file.id} className="w-[180px] shadow-md">
            <CardHeader className="h-[180px] p-2 lg:p-4">
              <img src={file.url} alt="" className="max-w-full max-h-full object-cover" />
            </CardHeader>
            <Separator />
            <CardContent className="p-2 lg:p-4">
              <CardTitle className="text-sm font-normal truncate">{file.name}</CardTitle>
              <CardDescription className="text-xs">{displayFileSize(file.size!)}</CardDescription>
            </CardContent>
            <Separator />
            <CardFooter className="p-0">
              <Button className="w-full h-full bg-secondary text-secondary-foreground rounded-none" onClick={() => handleRemoveFile(file.url, index)}>Remove</Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
      <Separator className="my-4" />
      <VideoInput form={form} />
      <CardFooter>
        <FormField
          name="property.media"
          control={form.control}
          render={() => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardFooter>
    </Card>
  );
}
