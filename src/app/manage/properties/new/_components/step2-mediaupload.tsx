"use client";

import { PropertyForm } from "@/app/manage/properties/new/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export interface FileUpload {
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface FormFileUpload extends FileUpload {
  id: string;
}

function displayFileSize(fsize: number): string {
  return fsize > 1024
    ? fsize > 1048576
      ? Math.round(fsize / 1048576) + "mb"
      : Math.round(fsize / 1024) + "kb"
    : fsize + "b";
}

export default function Step2MediaUpload({
  accept,
  multiple,
  nth,
}: {
  accept?: string;
  multiple?: boolean;
  nth: number;
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const form = useFormContext<PropertyForm>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `units.${nth}.media`,
  });
  const images = fields.filter((item) => item.type.startsWith("IMAGE"));

  // const [isDragEnter, setIsDragEnter] = useState<boolean>(false);

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    Object.entries(event.target.files!).forEach((e) => {
      const { name, size, type } = e[1];
      append({
        name, size,
        type: type.toUpperCase(),
        url: URL.createObjectURL(e[1])
      });
    });
  }

  function handleRemoveFile(fileUrl: string, i: number) {
    remove(i);
    URL.revokeObjectURL(fileUrl);
  }

  return (
    <Card className="border-none">
      <CardHeader className="flex flex-row justify-between items-center px-0">
        <CardTitle>Upload ảnh (tối đa 3 ảnh)</CardTitle>
        <Button type="button" onClick={() => inputFileRef.current && inputFileRef.current.click()}>
          Upload ảnh
        </Button>
      </CardHeader>
      <CardContent
        onClick={() => fields.length === 0 && inputFileRef.current && inputFileRef.current.click()}
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
              <CardDescription className="text-xs">{displayFileSize(file.size)}</CardDescription>
            </CardContent>
            <Separator />
            <CardFooter className="p-0">
              <Button className="w-full h-full bg-secondary text-secondary-foreground rounded-none" onClick={() => handleRemoveFile(file.url, index)}>Remove</Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
