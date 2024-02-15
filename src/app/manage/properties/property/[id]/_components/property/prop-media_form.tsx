import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { IconBadge } from "@/components/ui/icon-badge";
import { backendAPI } from "@/libs/axios";
import { PropertyMedia } from "@/models/property";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from "lightgallery/react";

interface FormProps {
  initialData: {
    media: PropertyMedia[];
  };
  propId: string;
};

const formSchema = z.object({
  media: z
    .array(
      z.object({
        name: z.string().optional(),
        size: z.number().optional(),
        type: z.string(),
        url: z.string(),
        description: z.string().max(30).optional(),
      })
    )
    .max(24)
    .nonempty(),
});

type FormValues = z.infer<typeof formSchema>;

export default function MediaForm({
  initialData,
  propId,
}: FormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(d: FormValues) {
    try {
      await backendAPI.patch(`/api/properties/property/${propId}`, d);
      toast.success("Cập nhật thành công");
      toggleEdit();
    } catch (err) {
      toast.error("Có lỗi xảy ra");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between items-center gap-x-2">
        <div className="flex flex-row items-center gap-2">
          <IconBadge icon={Image} />
          <h2 className="text-xl">
            Media
          </h2>
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Hủy</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Sửa
            </>
          )}
        </Button>
      </div>
      <div className="border bg-slate-100 rounded-md p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="space-y-2">
              <div className="font-medium">
                Hình ảnh
              </div>
              {isEditing ? (
                <div />
              ) : (
                <div className="text-sm mt-2">
                  <LightGallery plugins={[lgZoom, lgThumbnail]} mode="lg-fade" elementClassNames="flex flex-row flex-wrap gap-2">
                    {initialData.media.map((media, index) => (
                      <a
                        key={index}
                        className="gallery-item"
                        data-src={media.url}
                        data-sub-html={media.description && `<h4>${media.description}</h4>`}
                      >
                        <img
                          src={media.url}
                          alt={media.description}
                          className="m-2 max-w-[160px] aspect-video object-contain"
                        />
                      </a>
                    ))}
                  </LightGallery>
                </div>
              )}
            </div>
            {isEditing && (
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Lưu
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div >
  );
};
