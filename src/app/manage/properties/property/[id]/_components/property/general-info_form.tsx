import { useForm } from "react-hook-form";
import { Data } from "../../page";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { IconBadge } from "@/components/ui/icon-badge";
import { LayoutDashboard, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Editor from "@/components/ui/editor";
import { backendAPI } from "@/libs/axios";
import toast from "react-hot-toast";

interface FormProps {
  initialData: {
    name: string;
    multiUnit: boolean;
    description?: string;
    area: number;
    numberOfFloors?: number;
    building?: string;
    project?: string;
    // city: string;
    // district: string;
    // ward?: string;
    // placeUrl: string;
    type: string;
  };
  propId: string;
};

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Tên nhà cho thuê phải có ít nhất 3 ký tự")
    .max(30, "Tên nhà cho thuê không được quá 30 ký tự"),
  multiUnit: z
    .boolean(),
  building: z
    .string()
    .optional(),
  project: z
    .string()
    .optional(),
  numberOfFloors: z
    .number()
    .optional(),
  area: z
    .number()
    .min(1, "Diện tích không hợp lệ")
    .optional(),
  description: z
    .string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function GeneralInfoForm({
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
          <IconBadge icon={LayoutDashboard} />
          <h2 className="text-xl">
            Thông tin cơ bản
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
                Tên nhà cho thuê
              </div>
              {isEditing ? (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <p className="text-sm mt-2">
                  {initialData.name}
                </p>
              )}
            </div>
            {initialData.type === "APARTMENT" && (
              <div className="flex flex-row justify-between gap-2">
                <div className="space-y-2">
                  <div className="font-medium">
                    Dự án
                  </div>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="project"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormControl>
                            <Input {...field} placeholder="Dự án Thống Nhất Complex" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="text-sm mt-2">
                      {initialData.project || "N/A"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="font-medium">
                    Toà nhà
                  </div>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="building"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormControl>
                            <Input {...field} placeholder="Tòa nhà Thống Nhất" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="text-sm mt-2">
                      {initialData.building || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-between gap-2">
              {["PRIVATE", "MINIAPARTMENT"].includes(initialData.type) && (
                <div className="space-y-2">
                  <div className="font-medium">
                    Số tầng
                  </div>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="numberOfFloors"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="text-sm mt-2">
                      {initialData.numberOfFloors || "N/A"}
                    </p>
                  )}
                </div>
              )}
              {!(["APARTMENT", "ROOM"].includes(initialData.type) && initialData.multiUnit) && (
                <div className="space-y-2">
                  <div className="font-medium">
                    Diện tích
                  </div>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={1}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="text-sm mt-2">
                      {initialData.area}m<sup>2</sup>
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="font-medium">
                Mô tả
              </div>
              {isEditing ? (
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Editor
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div dangerouslySetInnerHTML={{__html: initialData.description || "N/A"}} />
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
