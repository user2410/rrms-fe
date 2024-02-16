import DivisionSelector from "@/components/complex/division-selector";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { backendAPI } from "@/libs/axios";
import { User } from "@/models/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const personalSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
});

type PersonalForm = z.infer<typeof personalSchema>;

export function PersonalInfoForm({
  accessToken,
  user,
} : {
  accessToken: string,
  user: User,
}) {
  
  const form = useForm<PersonalForm>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      ...user,
      avatar: user.avatar ? user.avatar : undefined,
      phone: user.phone ? user.phone : undefined,
      address: user.address ? user.address : undefined,
      city: user.city ? user.city : undefined,
      district: user.district ? user.district : undefined,
      ward: user.ward ? user.ward : undefined,
    },
  });

  function onSubmit(data: PersonalForm) {
    console.log(data);
    backendAPI.patch("/api/auth/credential/update", data, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then(() => {
      toast.success("Cập nhật thông tin thành công");
    }).catch((err) => {
      console.error(err);
      toast.error("Cập nhật thông tin thất bại");
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="w-full flex flex-row gap-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DivisionSelector
            cityFieldName="city"
            districtFieldName="district"
            wardFieldName="ward"
          />
        </div>
        <Button type="submit">Lưu</Button>
      </form>
    </Form>
  );
};
