import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { IconBadge } from "@/components/ui/icon-badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { backendAPI } from "@/libs/axios";
import { OrientationItems, Property, PropertyFeature, pFeatures } from "@/models/property";
import { zodResolver } from "@hookform/resolvers/zod";
import { LayoutDashboard, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { DeepPartial, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import * as z from "zod";
import { usePropDataCtx } from "../../_context/property_data.context";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { Unit } from "@/models/unit";

const formSchema = z.object({
  orientation: z
    .string()
    .optional(),
  entranceWidth: z
    .number()
    .optional(),
  facade: z
    .number()
    .optional(),
  yearBuilt: z
    .number()
    .optional(),
  features: z
    .array(
      z.object({
        propertyId: z.string(),
        featureId: z.number(),
        description: z.string().optional(),
      })
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function ExtraInfoForm(){
  const {property, units} = usePropDataCtx();
  const session = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const { setPropData } = usePropDataCtx();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: property,
  });

  const { isSubmitting, isValid } = form.formState;
  const { fields, append, remove } = useFieldArray({
    name: "features",
    control: form.control,
  });

  async function onSubmit(d: FormValues) {
    try {
      await backendAPI.patch(`/api/properties/property/${property.id}`, d, {
        headers: {
          Authorization: `Bearer ${session.data!.user.accessToken}`,
        }
      });
      setPropData({
        property: {
          ...property,
          ...d,
        },
        units,
      });
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
          <IconBadge icon={Plus} />
          <h2 className="text-xl">
            Thông tin thêm
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
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <div className="font-medium">
                  Hướng nhà
                </div>
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="orientation"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="n">Bắc</SelectItem>
                              <SelectItem value="e">Đông</SelectItem>
                              <SelectItem value="w">Tây</SelectItem>
                              <SelectItem value="s">Nam</SelectItem>
                              <SelectItem value="ne">Đông Bắc</SelectItem>
                              <SelectItem value="nw">Tây Bắc</SelectItem>
                              <SelectItem value="se">Đông Nam</SelectItem>
                              <SelectItem value="sw">Tây Nam</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <p className="text-sm mt-2">
                    {OrientationItems.find(i => i.value === property.orientation)?.label || "N/A"}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="font-medium">
                  Năm xây dựng
                </div>
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="yearBuilt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            min={1000}
                            {...field}
                            onChange={(e) => {
                              if (e.target.value === "") { form.resetField("yearBuilt"); }
                              field.onChange(e.target.valueAsNumber);
                            }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <p className="text-sm mt-2">
                    {property.yearBuilt || "N/A"}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="font-medium">
                  Lối vào (m)
                </div>
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="entranceWidth"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => {
                              if (e.target.value === "") { form.resetField("entranceWidth"); }
                              field.onChange(e.target.valueAsNumber);
                            }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <p className="text-sm mt-2">
                    {property.entranceWidth || "N/A"}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="font-medium">
                  Mặt tiền (m<sup>2</sup>)
                </div>
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="facade"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            onChange={(e) => {
                              if (e.target.value === "") { form.resetField("facade"); }
                              field.onChange(e.target.valueAsNumber);
                            }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <p className="text-sm mt-2">
                    {property.facade || "N/A"}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full">
              <div className="font-medium">
                Tiện ích nhà cho thuê
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiện ích</TableHead>
                    <TableHead>Mô tả</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isEditing ? (
                    fields.map((_f, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`features.${index}.featureId`}
                            render={({ field }) => (
                              <FormItem className="flex-grow">
                                <FormControl>
                                  <Select 
                                    onValueChange={(e) => field.onChange(parseInt(e))} 
                                    defaultValue={field.value.toString()}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Chọn tiện ích" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {pFeatures.map((item) => (
                                        <SelectItem
                                          key={item.id}
                                          disabled={fields.map((f) => f.featureId).includes(item.id)}
                                          value={item.id.toString()}
                                        >
                                          {item.text}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="flex flex-row items-start gap-1 my-2">
                          <FormField
                            control={form.control}
                            name={`features.${index}.description`}
                            render={({ field }) => (
                              <FormItem className="flex-grow">
                                <FormControl>
                                  <Textarea
                                    placeholder="Mô tả tiện ích"
                                    rows={2}
                                    {...field}
                                    className="overflow-y-scroll"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className=""
                            onClick={() => remove(index)}
                          >
                            <IoClose size={24} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    property.features.map((feature, index) => (
                      <TableRow key={index}>
                        <TableCell>{pFeatures.find(f => f.id === feature.featureId)?.text}</TableCell>
                        <TableCell>{feature.description}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {isEditing && (
                <Button type="button" variant="outline" onClick={() => append({ propertyId: property.id, featureId: NaN })}>Thêm tiện ích</Button>
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
