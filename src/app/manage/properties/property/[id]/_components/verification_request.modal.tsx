import { uploadFileWithPresignedURL } from "@/actions/upload-file";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { backendAPI } from "@/libs/axios";
import { FileUpload } from "@/models/file";
import { getYoutubeVideoID } from "@/utils/youtube-video";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import { Session } from "next-auth";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  videoUrl: z.string(),
  houseOwnershipCertificate: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    url: z.string(),
  }).optional(),
  certificateOfLanduseRight: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    url: z.string(),
  }).optional(),
  frontIdcard: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    url: z.string(),
  }),
  backIdcard: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    url: z.string(),
  }),
  note: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateVerificationRequestModal({
  propertyId,
  sessionData,
  refresh,
} : {
  propertyId: string;
  sessionData: Session;
  refresh: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [videoID, setVideoID] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  async function handleSubmit(values: FormValues) {
    // Send request to backend
    console.log(values);
    try {
      const pre = (await backendAPI.post<{
        houseOwnershipCertificate: FormValues["houseOwnershipCertificate"],
        certificateOfLanduseRight: FormValues["certificateOfLanduseRight"],
        frontIdcard: FormValues["frontIdcard"],
        backIdcard: FormValues["backIdcard"],
      }>(`/api/properties/property/${propertyId}/verifications/_pre`, {
        propertyId,
        houseOwnershipCertificate: values.houseOwnershipCertificate,
        certificateOfLanduseRight: values.certificateOfLanduseRight,
        frontIdcard: values.frontIdcard,
        backIdcard: values.backIdcard,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      })).data;
      const uploadData = {
        ...values,
        houseOwnershipCertificate: pre.houseOwnershipCertificate ? (await uploadFileWithPresignedURL(values.houseOwnershipCertificate! as FileUpload, pre.houseOwnershipCertificate.url)) : undefined,
        certificateOfLanduseRight: pre.certificateOfLanduseRight ? (await uploadFileWithPresignedURL(values.certificateOfLanduseRight! as FileUpload, pre.certificateOfLanduseRight.url)) : undefined,
        frontIdcard: (await uploadFileWithPresignedURL(values.frontIdcard, pre.frontIdcard.url)),
        backIdcard: (await uploadFileWithPresignedURL(values.backIdcard, pre.backIdcard.url)),
      };
      await backendAPI.post(`/api/properties/property/${propertyId}/verifications`, uploadData, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      });
      toast.success("Yêu cầu xác minh đã được gửi");
      closeBtnRef.current?.click();
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }

  const ImageField = ({ 
    name,
    label,
  } : { 
    name: string;
    label: string;
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) {
        form.resetField(name as any);
        return;
      }
      const newImg = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      };
      console.log("about to set", name, newImg);
      form.setValue(name as any, newImg);
    }

    return (
      <FormField
        control={form.control}
        name={name as any}
        render={({ field }) => (
          <FormItem className="p-1 aspect-video">
            <FormLabel>{label}</FormLabel>
            <div className="cursor-pointer" onClick={() => inputRef.current?.click()}>
              {field.value?.url ? (
                <div className="relative">
                  <img
                    src={field.value.url}
                    alt={field.value.name}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="bg-blue-200 p-1">
                  <div className="border border-dashed p-1 border-black flex flex-col items-center gap-2">
                    <ImageIcon className="w-8 h-8"/>
                    <h4>Chưa có ảnh nào</h4>
                  </div>
                </div>
              )}
            </div>
            <input type="file" hidden ref={inputRef} onChange={handleFieldChange} />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Dialog onOpenChange={(_open) => {form.reset();}}>
      <DialogTrigger asChild>
        <Button>Yêu cầu xác minh</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[40vw]">
        <DialogHeader>
          <DialogTitle>Gửi thông tin xác minh</DialogTitle>
          <DialogDescription>
            Xác minh thông tin nhà cho thuê giúp tăng độ tin cậy của tin đăng về nhà cho thuê của bạn.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-2.5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelRequired>Video nhà cho thuê</FormLabelRequired>
                    <FormControl>
                      <Input 
                        {...field} 
                        onChange={(e) => {
                          const videoID = getYoutubeVideoID(e.target.value);
                          if (videoID) {
                            setVideoID(videoID);
                            field.onChange(e);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>Link Youtube của video quay nhà cho thuê, quay từ bên ngoài và bên trong, lên trên tầng nếu có có gắn định vị vị trí và thời gian</FormDescription>
                    {!!videoID  && (
                      <div className="flex flex-row justify-center">
                        <iframe width="420" height="236" src={`https://www.youtube.com/embed/${videoID}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="origin-when-cross-origin" allowFullScreen></iframe>
                      </div>
                    )}
                  </FormItem>
                )}
              />
              
              <div className="space-y-1.5">
                <Label>Giấy tờ pháp lý</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <ImageField name="houseOwnershipCertificate" label="Sổ hồng hoặc giấy tờ sở hữu nhà" />
                  <ImageField name="certificateOfLanduseRight" label="Giấy tờ quyền sử dụng đất" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Ảnh chụp 2 mặt của CMND/CCCD của chính chủ BĐS <span className="text-red-600 ml-2">*</span></Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <ImageField name="frontIdcard" label="Mặt trước" />
                  <ImageField name="backIdcard" label="Mặt sau" />
                </div>
              </div>

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>Thông tin bổ sung hoặc yêu cầu khác</FormDescription>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button ref={closeBtnRef} type="button" variant="outline">Hủy</Button>
                </DialogClose>
                {/* {JSON.stringify(form.formState.errors)} */}
                <Button type="submit">Gửi yêu cầu xác minh</Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
