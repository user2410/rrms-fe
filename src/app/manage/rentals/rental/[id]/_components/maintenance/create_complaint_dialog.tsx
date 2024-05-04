import { AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useDataCtx } from "../../_context/data.context";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRef } from "react";
import { FileUpload } from "@/models/file";
import { ScrollArea } from "@/components/ui/scroll-area";

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';
import { backendAPI } from "@/libs/axios";
import { uploadFile } from "@/actions/upload-file";
import toast from "react-hot-toast";

const formSchema = z.object({
  rentalId: z.number(),
  creatorId: z.string(),
  title: z.string(),
  content: z.string(),
  occurredAt: z.date(),
  suggestion: z.string().optional(),
  media: z.array(
    z.object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
      url: z.string(),
    })
  ),
  type: z.enum(["REPORT", "SUGGESTION"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateComplaintDialog() {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { sessionData, rental } = useDataCtx();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rentalId: rental.id,
      creatorId: sessionData.user.user.id,
      occurredAt: new Date(),
      type: "REPORT",
      media: [],
    }
  });
  const type = form.watch("type");
  const { fields: mediaFields, append, remove } = useFieldArray({
    control: form.control,
    name: "media",
  });

  async function submitHandler(data: FormValues) {
    console.log(data);
    try {
      // upload images
      const media : string[] = [];
      for(const image of data.media) {
        media.push(await uploadFile({
          name: image.name as string,
          size: image.size as number,
          type: image.type.toLowerCase(),
          url: image.url,
        }));
      }
      // create complaint
      const res = await backendAPI.post("/api/rental-complaints", {
        ...data,
        media,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`
        }
      });
      toast.success("Tạo thành công");
      closeBtnRef.current?.click();
      form.reset();
    } catch(err) {
      console.error(err);
      toast.error("Có lỗi xảy ra");
    }
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    Object.entries(event.target.files!).forEach((e) => {
      const { name, size, type } = e[1];
      const newFile: FileUpload = {
        name, size, type,
        url: URL.createObjectURL(e[1])
      };
      append(newFile);
      return newFile;
    });
  }

  function handleRemoveMedia(index: number) {
    URL.revokeObjectURL(mediaFields[index].url);
    remove(index);
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Tạo báo cáo / đề xuất</AlertDialogTitle>
      </AlertDialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)}>
          <ScrollArea className="h-[70vh]">
            <div className="space-y-4 px-2 pb-2">
            
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="REPORT" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Báo cáo
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="SUGGESTION" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Đề xuất
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelRequired>Tiêu đề</FormLabelRequired>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelRequired>Mô tả chi tiết</FormLabelRequired>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="media"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Ảnh đính kèm</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file" multiple
                        accept="image/*"
                        onChange={handleFileInputChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <LightGallery
                speed={500}
                mode="lg-fade"
                plugins={[lgThumbnail, lgZoom]}
                elementClassNames="flex flex-row flex-wrap justify-start gap-2"
              >
                {mediaFields.map((field, index) => (
                  <a
                    key={index}
                    className="relative"
                    data-src={field.url}
                    data-sub-html={`<h4>${field.name}</h4>`}
                  >
                    <img
                      src={field.url}
                      alt={`media-${index}`}
                      className="w-24 h-16 object-cover rounded-md"
                    />
                    <button
                      className="absolute top-0 right-0 w-4 h-4 rounded-full"
                      onClick={() => handleRemoveMedia(index)}
                    >
                      x
                    </button>
                  </a>
                ))}
              </LightGallery>
              {type === "REPORT" && (
                <FormField
                  control={form.control}
                  name="occurredAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabelRequired>Thời điểm xảy ra</FormLabelRequired>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value.toISOString().slice(0, 16)}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="suggestion"
                render={({ field }) => (
                  <FormItem>
                    {type === "REPORT" ? (
                      <FormLabel>Đề nghị</FormLabel>
                    ) : (
                      <FormLabelRequired>Đề nghị</FormLabelRequired>
                    )}
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>
          <AlertDialogFooter>
            <AlertDialogCancel ref={closeBtnRef}>Hủy</AlertDialogCancel>
            <Button type="submit">Lưu</Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </>
  );
};
