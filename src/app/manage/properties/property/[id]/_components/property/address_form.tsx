import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { IconBadge } from "@/components/ui/icon-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDebounce from "@/hooks/use-debounce";
import { backendAPI } from "@/libs/axios";
import { GetLocationName } from "@/utils/dghcvn";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LocateFixed, Pencil } from "lucide-react";
import { Fragment, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import DivisionSelector from "./division-selector";

interface FormProps {
  initialData: {
    fullAddress: string;
    city: string;
    district: string;
    lat: number;
    lng: number;
    ward?: string
  };
  propId: string;
};

const formSchema = z.object({
  fullAddress: z
    .string({
      required_error: "Xin hãy nhập địa chỉ",
    }),
  city: z
    .string(),
  district: z
    .string(),
  ward: z
    .string()
    .optional(),
  lat: z
    .number(),
  lng: z
    .number(),
});

export type FormValues = z.infer<typeof formSchema>;

export default function AddressForm({
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
          <IconBadge icon={LocateFixed} />
          <h2 className="text-xl">
            Địa chỉ
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
                Địa chỉ
              </div>
              {isEditing ? (
                <FormField
                  control={form.control}
                  name="fullAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="VD: Số 1, Đại Cồ Việt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <p className="text-sm mt-2">
                  {initialData.fullAddress}
                </p>
              )}
            </div>
            <div className="space-y-2">
              {isEditing ? (
                <DivisionSelector />
              ) : (
                <div>{GetLocationName(
                  form.watch('city'),
                  form.watch('district'),
                  form.watch('ward') || ''
                )}</div>
              )}
            </div>
            <div className="space-y-2">
              <div className="font-medium">
                Vị trí
              </div>
              {isEditing ? (
                <LocationForm form={form} />
              ) : (
                <GoogleMap
                  mapContainerStyle={{ height: "400px" }}
                  center={{ lat: form.watch('lat'), lng: form.watch('lng') }}
                  zoom={15}
                >
                  <MarkerF
                    position={{ lat: form.watch('lat'), lng: form.watch('lng') }}
                  />
                </GoogleMap>
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

function LocationForm({
  form
}: {
  form: UseFormReturn<FormValues, any, undefined>;
}) {
  // on field placeUrl change -> send get request
  const [input, setInput] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const debouncedValue = useDebounce<string>(input, 1500);

  const locationQuery = useQuery({
    queryKey: ['nextapi', 'location', debouncedValue],
    queryFn: async ({ queryKey }) => {
      if (queryKey.at(2)!.length === 0) {
        setMessage("");
        return;
      }
      try {
        const res = await axios.get('/api/location/url', {
          params: { url: queryKey.at(2) }
        });
        console.log(res.data);
        if (res.data.coord) {
          const { lat, lng } = res.data.coord;
          form.setValue('lat', lat);
          form.setValue('lng', lng);
          setMessage(`Toạ độ: ${lat}, ${lng}`);
        } else {
          throw new Error('Không lấy được toạ độ');
        }
      } catch (err: any) {
        console.log(err);
        switch (err.response.status) {
          case 400: case 404:
            throw new Error("Link không hợp lệ");
          default:
            throw new Error("Lỗi mạng");
        }
      }
    },
    enabled: !!input && !!debouncedValue,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });

  return (
    <Fragment>
      <Label>
        Link vị trí
        <span className="ml-1 text-red-600">*</span>
      </Label>
        <Input
          placeholder="VD: https://maps.app.goo.gl/iKH3YbWLUVyFApp78"
          // disabled={locationQuery.isLoading}
          onChange={(e) => setInput(e.target.value)}
        />
      <p className="text-sm text-muted-foreground">
        {message && (<span className="italic text-muted-foreground">{message}</span>)}
        {locationQuery.isError && (<span className="text-red-600">{JSON.stringify(locationQuery.error)}</span>)}
        <br></br>
        Chọn vị trí nhà cho thuê trên <a target="_blank" rel="noopener noreferrer" className="underline hover:text-primary" href="https://www.google.com/maps">bản đồ</a> và gán link vào đây. <a target="_blank" rel="noopener noreferrer" className="underline hover:text-primary" href="#">Hướng dẫn chi tiết</a>
      </p>
    </Fragment>
  );
}
