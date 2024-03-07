import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { IconBadge } from "@/components/ui/icon-badge";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from "lightgallery/react";
import _ from "lodash";
import { usePropDataCtx } from "../../_context/property_data.context";
import { useSession } from "next-auth/react";
import { Unit } from "@/models/unit";
import { uploadFile } from "@/actions/upload-file";

const formSchema = z.object({
  primaryImage: z.number(),
  media: z.array(
    z.object({
      mediaId: z.number().optional(),
      propertyId: z.string(),
      name: z.string(),
      size: z.number(),
      type: z.string(),
      url: z.string(),
      description: z.string().max(30).optional(),
    })
  )
    .max(24)
    .nonempty(),
});

type FormValues = z.infer<typeof formSchema>;

export default function MediaFormWrapper() {
  const { property, units } = usePropDataCtx();

  return _.isEqual(property, {})
    ? (<></>)
    : (<MediaForm property={property} units={units} />);
}

function MediaForm({
  property,
  units,
}: {
  property: Property;
  units: Unit[];
}) {
  const session = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [newMedia, setNewMedia] = useState<string[]>([]);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { setPropData } = usePropDataCtx();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...property,
      media: property.media.map((m, i) => ({
        ...m,
        mediaId: m.id,
        name: `${property.id}_image_${i}`,
        size: 0,
      })),
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "media",
  });
  const images = fields.filter((item) => item.type.startsWith("IMAGE"));
  const primaryImage = form.watch('primaryImage');

  const { isSubmitting, isValid, isDirty } = form.formState;

  async function onSubmit(d: FormValues) {
    console.log("submit data", d, newMedia);
    if (!isDirty) return;
    try {
      const imgs = d.media.filter(m => m.type.startsWith("IMAGE"));
      const newImgs = imgs.filter(m => newMedia.includes(m.url));
      for(const img of newImgs) {
        const newUrl = await uploadFile(img, session.data!.user.accessToken);
        img.url = newUrl;
        img.type = "IMAGE";
      }
      await backendAPI.patch(`/api/properties/property/${property.id}`, {
        ...d,
        primaryImageUrl: (imgs.find(i => i.mediaId === primaryImage) || imgs[d.primaryImage]).url,
      }, {
        headers: {
          Authorization: `Bearer ${session.data!.user.accessToken}`,
        }
      });
      setPropData({
        property: {
          ...property,
          primaryImage: d.primaryImage,
          media: d.media.map((m, i) => ({
            ...m,
            id: i,
            type: m.type as "IMAGE" | "VIDEO",
          })),
        },
        units,
      });
      toast.success("Cập nhật thành công");
      toggleEdit();
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra");
    }
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newFiles : object[] = [];
    for(const [e, f] of Object.entries(event.target.files!)) {
      const { name, size, type } = f;
      const newFile = {
        propertyId: property.id,
        name, size,
        type: type.toUpperCase(),
        url: URL.createObjectURL(f)
      };
      append(newFile);
      newFiles.push(newFile);
    }
    setNewMedia(v => [...v, ...newFiles.map(f => (f as any).url)]);
  }

  function handleRemoveFile(fileUrl: string, i: number) {
    remove(i);
    // console.log(primaryImage, i);
    if (primaryImage === i) {
      form.setValue('primaryImage', 0);
    } else if (primaryImage > i) {
      form.setValue('primaryImage', primaryImage - 1);
    }
    URL.revokeObjectURL(fileUrl);
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
                <>
                  <div className="flex flex-row justify-between items-start px-0">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Upload ảnh</h3>
                      <div className="text-sm text-muted-foreground">
                        <ul className="list-disc list-inside">
                          <li>Đăng tối đa 24 ảnh</li>
                          <li>Hãy dùng ảnh thật, không trùng, không chèn SĐT</li>
                          <li>Mỗi ảnh kích thước tối thiểu 100x100 px, tối đa 15 MB</li>
                          <li>Mô tả ảnh tối đa 45 kí tự.</li>
                        </ul>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => inputFileRef.current && inputFileRef.current.click()}
                    >
                      Thêm ảnh
                    </Button>
                  </div>
                  <div
                    onClick={() => images.length === 0 && inputFileRef.current && inputFileRef.current.click()}
                    className="p-6 cursor-pointer w-full h-full border-2 border-dashed border-primary flex flex-wrap gap-2 xl:gap-4 text-base select-none"
                  >
                    <input
                      ref={inputFileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleFileInputChange} />
                    {images.length === 0 && (
                      <div className="w-full text-center my-3 pointer-events-none">
                        <div className="fas fa-cloud-arrow-up m-2" />
                        Bấm để chọn ảnh
                      </div>
                    )}
                    {images.map((file, index) => (
                      <Card
                        key={file.id}
                        className={clsx(
                          "w-[180px] shadow-md",
                          (primaryImage === index || primaryImage === file.mediaId) && "ring-1"
                        )}
                      >
                        <CardHeader
                          className="h-[180px] p-0"
                          onClick={() => form.setValue('primaryImage', index)}
                        >
                          <img src={file.url} alt="" className="object-contain h-full " />
                        </CardHeader>
                        <Separator />
                        <CardContent className="p-2 lg:p-4">
                          {(primaryImage === index || primaryImage === file.mediaId) && (<p className="w-full text-xs font-normal text-center text-blue-600">Ảnh chính</p>)}
                        </CardContent>
                        <Separator />
                        <FormField
                          control={form.control}
                          name={`media.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <Input {...field} placeholder="Mô tả ảnh" className="rounded-none ring-0 focus:ring-0 focus-visible:ring-0" />
                            </FormItem>
                          )}
                        />
                        <CardFooter className="p-0">
                          <Button
                            type="button"
                            className="w-full h-full bg-secondary text-secondary-foreground rounded-none"
                            onClick={() => handleRemoveFile(file.url, index)}
                          >
                            Xóa
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  {/* <VideoInput form={form} /> */}
                  <CardFooter>
                    <FormField
                      control={form.control}
                      name="media"
                      render={() => (
                        <FormItem>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardFooter>
                </>
              ) : (
                <div className="text-sm mt-2">
                  <LightGallery
                    plugins={[lgZoom, lgThumbnail]}
                    mode="lg-fade"
                    elementClassNames="flex flex-row flex-wrap gap-2"
                  >
                    {images.map((media, index) => (
                      <a
                        key={index}
                        className={clsx(
                          "gallery-item",
                          (primaryImage === media.mediaId || primaryImage === index) && "ring-1",
                        )}
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
