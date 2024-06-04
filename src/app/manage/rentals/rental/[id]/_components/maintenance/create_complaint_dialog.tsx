import { AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/models/file";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useDataCtx } from "../../_context/data.context";

import { backendAPI } from "@/libs/axios";
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';
import toast from "react-hot-toast";
import { uploadFileWithPresignedURL } from "@/actions/upload-file";
import { Session } from "next-auth";
import { useQuery } from "@tanstack/react-query";
import { ManagedRental, Rental } from "@/models/rental";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property } from "@/models/property";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function CreateComplaintDialog({
  rentalId,
  sessionData
}: {
  rentalId?: number;
  sessionData: Session;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rentalId,
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

  const query = useQuery<ManagedRental[]>({
    queryKey: ["manage", "rentals", sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const rentals = (await backendAPI.get<Rental[]>("/api/rentals/my-rentals", {
        params: {
          fields: "property_id,tenant_name,tenant_type",
          expired: false,
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        },
      })).data;
      if (rentals.length === 0) {
        return [] as ManagedRental[];
      }
      const properties = (await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          fields: "name",
          propIds: rentals.map(r => r.propertyId),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        },
      })).data;
      return rentals.map(r => {
        const property = properties.find(p => p.id === r.propertyId)!;
        return {
          rental: r,
          property,
        } as ManagedRental;
      }
      );
    },
    enabled: !rentalId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  async function submitHandler(data: FormValues) {
    try {
      var id = 1;
      const originalMedia = data.media.map((file) => ({
        id: id++,
        ...file,
      }));
      const complaintData = (await backendAPI.post(
        "/api/rental-complaints/create/_pre",
        {
          media: originalMedia,
        }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`
        },
      })).data;
      const mediaUrls: string[] = [];
      for (const media of complaintData.media) {
        const om = originalMedia.find((m) => m.id === media.id);
        const newUrl = await uploadFileWithPresignedURL(om!, media.url);
        mediaUrls.push(newUrl);
      }

      // create complaint
      const res = await backendAPI.post("/api/rental-complaints/create", {
        ...data,
        media: mediaUrls,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`
        }
      });
      toast.success("Tạo thành công");
      closeBtnRef.current?.click();
      form.reset();
    } catch (err) {
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
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-lg">Báo cáo / đề xuất</CardTitle>
      </CardHeader>
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
              {!rentalId  && (
                <FormField
                  control={form.control}
                  name="rentalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabelRequired>Nhà cho thuê thuê</FormLabelRequired>
                      <Select 
                        onValueChange={(v) => field.onChange(parseInt(v, 10))} 
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nhà cho thuê" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {query.isSuccess && (
                            query.data.map((r, i) => (
                              <SelectItem key={i} value={r.rental.id.toString()}>{r.property.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
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
            <Button type="submit">Tạo</Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </Card>
  );
}
