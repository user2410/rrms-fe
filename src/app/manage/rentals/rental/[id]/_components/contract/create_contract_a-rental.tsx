import FormLabelWithInfo from "@/components/complex/label-with-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { ContractAFormValues } from "./create_contract_a";
import { Switch } from "@/components/ui/switch";

export default function CreateContractARentalDetails() {
  const form = useFormContext<ContractAFormValues>();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thông tin hợp đồng</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="createdAtPlace"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Nơi thành lập hợp đồng</FormLabelRequired>
                <FormControl>
                  <Input {...field} placeholder="VD: Hà Nội, Đà Nắng" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nCopies"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Số bản sao hợp đồng</FormLabelRequired>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                    type="number"
                    min={1}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thanh toán tiền thuê nhà</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center gap-2">
                  <FormLabelWithInfo
                    label="Phương thức thanh toán"
                    info={(
                      <div className="space-y-2 max-w-[400px]">
                        <div>
                          <h3>Cơ sở pháp lý:</h3>
                          <ul className="list-disc list-inside">
                            <li><Link href="https://drive.google.com/file/d/1kp7MdOvkGaPS4XQb8CVZ2SQM5z4-Pf98/view?usp=sharing" className="hover:underline">Bộ luật Dân sự năm 2015</Link></li>
                            <li><Link href="https://thuvienphapluat.vn/van-ban/Thuong-mai/Luat-Thuong-mai-2005-36-2005-QH11-2633.aspx" className="hover:underline">Luật Thương mại năm 2015</Link></li>
                            <li><Link href="https://thuvienphapluat.vn/van-ban/Doanh-nghiep/Luat-thue-thu-nhap-doanh-nghiep-sua-doi-2013-197250.aspx" className="hover:underline">Luật Thuế thu nhập doanh nghiệp số 32/2013/QH13</Link></li>
                          </ul>
                        </div>
                        <div>
                          <h3>Phương thức thanh toán:</h3>
                          <ol className="list-decimal list-inside">
                            <li><strong>Tiền mặt:</strong>{" < 20 triệu VNĐ"}</li>
                            <li><strong>Cheque:</strong>{" Khách hàng của ngân hàng ký phát cho ngân hàng đó yêu cầu trích từ tài khoản của mình số tiền nhất định để trả cho người cầm tờ mệnh lệnh hoặc cho người chỉ định trên tờ mệnh lệnh đó"}</li>
                            <li><strong>Chuyển tiền:</strong>{" Yêu cầu ngân hàng chuyển tiền, áp dụng khi hai bên có lòng tin với nhau rất cao."}</li>
                            <li><strong>Nhờ thu (hối phiếu):</strong>{" Nhờ ngân hàng thu hộ tiền."}</li>
                            <li><strong>Thư tín dụng (LC):</strong>{" Là văn bản pháp lý trong đó ngân hàng cam kết trả tiền cho người bán theo yêu cầu của người mua."}</li>
                          </ol>
                        </div>
                      </div>
                    )}
                  />
                  <span className="text-red-600">*</span>
                </div>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn 1 phương thức thanh toán" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cash">Tiền mặt</SelectItem>
                    <SelectItem value="cheque">Séc</SelectItem>
                    <SelectItem value="transfer">Chuyển tiền</SelectItem>
                    <SelectItem value="draft">Nhờ thu (hối phiếu)</SelectItem>
                    <SelectItem value="lc">Thư tín dụng</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};
