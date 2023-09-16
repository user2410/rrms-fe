"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRef, useState } from "react";

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
  getFields,
  append,
  remove,
} : {
  accept?: string;
  multiple?: boolean;
  getFields: () => FormFileUpload[];
  append: (data: FileUpload) => void;
  remove: (i: number) => void;
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState(getFields());
  const [isDragEnter, setIsDragEnter] = useState<boolean>(false);

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    Object.entries(event.target.files!).forEach((e) => {
      const { name, size, type } = e[1];
      append({
        name, size, type,
        url: URL.createObjectURL(e[1])
      });
      setValues(getFields());
    });
  }

  function handleRemoveFile(fileUrl: string, i: number) {
    remove(i);
    URL.revokeObjectURL(fileUrl);
    setValues(getFields());
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
        onClick={() => values.length === 0 && inputFileRef.current && inputFileRef.current.click()}
        className="p-6 cursor-pointer w-full h-full border-2 border-dashed border-primary flex gap-2 xl:gap-4 text-base select-none"
      >
        <input
          ref={inputFileRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={handleFileInputChange} />
        {values.length === 0 && (
          <p className="w-full text-center my-3 pointer-events-none">
            Thêm một ảnh đại diện hấp dẫn sẽ giúp bài viết của bạn cuốn hút hơn với
            độc giả.
            <br />
            Kéo thả ảnh vào đây, hoặc bấm để chọn ảnh
          </p>
        )}
        {values.map((file, index) => (
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