import CreateReminderDialog, { FormValues as ReminderFormValues } from "@/components/complex/create_reminder";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/models/file";
import { RentalComplaint } from "@/models/rental";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Image as ImageIcon, Send } from "lucide-react";
import { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';
import { backendAPI } from "@/libs/axios";
import { useDataCtx } from "../../_context/data.context";
import { uploadFile } from "@/actions/upload-file";
import toast from "react-hot-toast";

const formSchema = z.object({
  reply: z.string().min(1),
  media: z.array(
    z.object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
      url: z.string(),
    })
  ),
  reminder: z.any(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateReply({
  disabled,
  item,
  refresh,
}: {
  disabled: boolean;
  item: RentalComplaint;
  refresh: () => void;
}) {
  const {sessionData} = useDataCtx();
  const imgInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reply: "",
      media: [],
    },
  });
  const { fields: mediaFields, append, remove } = useFieldArray({
    control: form.control,
    name: "media",
  });

  async function handleSubmit(data: FormValues) {
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
      // create complaint reply
      await backendAPI.post(`/api/rental-complaints/rental-complaint/${item.id}/replies`, {
        ...data,
        complaintId: item.id,
        media,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        },
      });
      toast.success("Phản hồi đã được gửi");
      form.reset();
      refresh();
    } catch(err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }

  function handleCreateReminder(data: ReminderFormValues) {
    form.setValue("reminder", data);
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
    <Form {...form}>
      <LightGallery
        // ref={lg}
        onInit={(detail) => console.log('init detail:', detail)}
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
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={`flex flex-row items-center gap-2 px-4 py-2 ${disabled ? "bg-gray-300" : ""}`}
      >
        <button
          type="button" className="border rounded-sm p-2"
          disabled={disabled || form.formState.isSubmitting}
          onClick={() => imgInputRef.current?.click()}
        >
          <ImageIcon className="w-6 h-6" />
        </button>
        <CreateReminderDialog
          triggerBtn={(
            <button
              type="button" className="border rounded-sm p-2"
              disabled={disabled || form.formState.isSubmitting}
              onClick={() => { }}
            >
              <Calendar className="w-6 h-6" />
            </button>
          )}
          handleCreateReminder={handleCreateReminder}
        />
        <input
          ref={imgInputRef} type="file"
          hidden multiple
          onChange={handleFileInputChange}
        />
        <FormField
          control={form.control}
          name="reply"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  placeholder={disabled ? "Đang đợi phản hồi" : "Nhập phản hồi"}
                  disabled={disabled || form.formState.isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <button
          type="submit" className="border rounded-sm p-2"
          disabled={disabled || form.formState.isSubmitting}
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
    </Form>
  );
};
