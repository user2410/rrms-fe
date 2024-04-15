import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../page";
import Link from "next/link";

export default function RentalPayment() {
  const form = useFormContext<FormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Hạn trả tiền thuê</CardTitle>
        <CardDescription>Thời gian và mức phạt nếu trả tiền thuê muộn. Bên cho thuê có quyền đơn phương chấm dứt thực hiện hợp đồng thuê nhà và thu hồi nhà ở đang cho thuê nếu bên thuê không trả tiền thuê nhà ở theo thỏa thuận từ 03 tháng trở lên mà không có lý do chính đáng theo <Link href="https://thuvienphapluat.vn/van-ban/Bat-dong-san/Luat-Nha-o-2014-259721.aspx" className="underline">Luật Nhà ở 2014 số 65/2014/QH13</Link></CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="policies.rentalPaymentGracePeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabelRequired>Thời kỳ ân hạn</FormLabelRequired>
              <FormControl>
                <Input 
                  {...field} 
                  type="number"
                  onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>
                Khoảng thời gian (ngày) sau khi có thông báo tiền thuê nhà bên thuê có thể thanh toán đúng hạn.
                Sau khoảng thời gian này bên thuê sẽ phải nộp phí phạt
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="policies.rentalPaymentLateFeePercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabelRequired>Mức phạt nộp muộn</FormLabelRequired>
              <FormControl>
                <Input 
                  {...field} 
                  onChange={e => field.onChange(e.currentTarget.valueAsNumber)}
                  type="number" 
                  min={0} max={100}
                />
              </FormControl>
              <FormDescription>Mức phạt tính bằng % tiền thuê gốc, được tính thêm mỗi ngày sau thời kỳ ân hạn</FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
