import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../page";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { readMoneyVi } from "@/utils/currency";

export default function BasicServices() {
  const form = useFormContext<FormValues>();
  const eType = form.watch("electricityPaymentType");
  const wType = form.watch("waterPaymentType");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Dịch vụ cơ bản</CardTitle>
        <CardDescription> Dịch vụ sinh hoạt cơ bản chủ nhà cung cấp cho khách thuê</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <h2 className="text-lg font-semibold">Điện</h2>
          <div className="space-y-1">
            <FormField
              control={form.control}
              name="electricityPaymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabelRequired>Áp dụng cách tính giá điện:</FormLabelRequired>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="RETAIL" id="er" />
                        <div className="flex flex-row items-center gap-2">
                          <Label htmlFor="er">Giá bán lẻ điện sinh hoạt</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4" />
                              </TooltipTrigger>
                              <TooltipContent className="w-[400px]">
                                <h3 className="font-semibold">Bảng giá bán lẻ điện sinh hoạt (theo Quyết định <a href="https://luatvietnam.vn/dien-luc/quyet-dinh-1062-qd-bct-2023-gia-ban-dien-moi-nhat-tu-ngay-4-5-251425-d1.html" className="hover:underline">1062/QĐ-BTC</a>):</h3>
                                <ScrollArea className="w-full h-72">
                                  <table className="border-collapse border border-slate-500">
                                    <thead>
                                      <tr>
                                        <th className="border border-slate-600 text-center font-semibold">Định mức sử dụng điện</th>
                                        <th className="border border-slate-600 text-center font-semibold">Giá bán lẻ điện (đồng/kWh)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="border border-slate-700 text-center">Bậc 1: Cho kWh từ 0 - 50</td>
                                        <td className="border border-slate-700 text-center">1.728</td>
                                      </tr>
                                      <tr>
                                        <td className="border border-slate-700 text-center">Bậc 2: Cho kWh từ 51 - 100</td>
                                        <td className="border border-slate-700 text-center">1.786</td>
                                      </tr>
                                      <tr>
                                        <td className="border border-slate-700 text-center">Bậc 3: Cho kWh từ 101 - 200</td>
                                        <td className="border border-slate-700 text-center">2.074</td>
                                      </tr>
                                      <tr>
                                        <td className="border border-slate-700 text-center">Bậc 4: Cho kWh từ 201 - 300</td>
                                        <td className="border border-slate-700 text-center">2.612</td>
                                      </tr>
                                      <tr>
                                        <td className="border border-slate-700 text-center">Bậc 5: Cho kWh từ 301 - 400</td>
                                        <td className="border border-slate-700 text-center">2.919</td>
                                      </tr>
                                      <tr>
                                        <td className="text-center border border-slate-700">Bậc 6: Cho kWh từ 401 trở lên</td>
                                        <td className="text-center border border-slate-700">3.015</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </ScrollArea>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="FIXED" id="ef" />
                        <div className="space-y-1">
                          <Label htmlFor="ef">Giá cố định mỗi số điện</Label>
                          <FormField
                            control={form.control}
                            name="electricityPrice"
                            render={({ field: field2 }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field2}
                                    type="number"
                                    onChange={(e) => field2.onChange(e.currentTarget.valueAsNumber)}
                                    disabled={eType !== "FIXED"}
                                  />
                                </FormControl>
                                <FormDescription>{field2.value ? `${field2.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} (${readMoneyVi(field2.value)}/kWh)` : ""}</FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Nước</h2>
          <div className="space-y-1">
            <FormField
              control={form.control}
              name="waterPaymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabelRequired>Áp dụng cách tính giá nước:</FormLabelRequired>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="RETAIL" id="wr" />
                        <div className="flex flex-row items-center gap-2">
                          <Label htmlFor="wr">Giá bán lẻ nước sinh hoạt</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4" />
                              </TooltipTrigger>
                              <TooltipContent className="w-[400px]">
                                <ScrollArea className="w-full h-72">
                                  <h3 className="font-semibold">Bảng giá bán lẻ nước sinh hoạt (chưa có thuế giá trị gia tăng và phí bảo vệ môi trường):</h3>
                                  <ul className="space-y-2 mt-2">
                                    <li><span className="font-semibold">Hà Nội</span> (theo Quyết định <a href="https://luatvietnam.vn/thuong-mai/quyet-dinh-38-2013-qd-ubnd-uy-ban-nhan-dan-tp-ha-noi-81427-d2.html" className="hover:underline">38/2013/QĐ-UBND</a>)</li>
                                    <table className="border-collapse border border-slate-500">
                                      <thead>
                                        <tr>
                                          <th className="border border-slate-600 text-center font-semibold">Định mức sử dụng nước</th>
                                          <th className="border border-slate-600 text-center font-semibold">Giá bán lẻ nước (đồng/m<sup>3</sup>)</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td className="border border-slate-700 text-center">10 m3 đầu tiên</td>
                                          <td className="border border-slate-700 text-center">5.973</td>
                                        </tr>
                                        <tr>
                                          <td className="border border-slate-700 text-center">Từ trên 10 m3 đến 20 m3</td>
                                          <td className="border border-slate-700 text-center">7.052</td>
                                        </tr>
                                        <tr>
                                          <td className="border border-slate-700 text-center">Từ trên 20 m3 đến 30 m3</td>
                                          <td className="border border-slate-700 text-center">8.669</td>
                                        </tr>
                                        <tr>
                                          <td className="border border-slate-700 text-center">Trên 30 m3</td>
                                          <td className="border border-slate-700 text-center">15.929</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <li><span className="font-semibold">TP Hồ Chí Minh</span> (theo Quyết định <a href="https://thuvienphapluat.vn/van-ban/Thuong-mai/Quyet-dinh-25-2019-QD-UBND-quy-dinh-quan-ly-ve-nha-o-xa-hoi-thanh-pho-Ha-Noi-428324.aspx" className="hover:underline">25/2019/QĐ-UBND</a>)</li>
                                    <table className="border-collapse border border-slate-500">
                                      <thead>
                                        <tr>
                                          <th className="border border-slate-600 text-center font-semibold">Định mức sử dụng nước</th>
                                          <th className="border border-slate-600 text-center font-semibold">Giá bán lẻ nước (đồng/m<sup>3</sup>)</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td className="border border-slate-700 text-center">Đến 4m3/người/tháng</td>
                                          <td className="border border-slate-700 text-center">6.700</td>
                                        </tr>
                                        <tr>
                                          <td className="border border-slate-700 text-center">Trên 4m3 đến 6m3/người/tháng</td>
                                          <td className="border border-slate-700 text-center">12.900</td>
                                        </tr>
                                        <tr>
                                          <td className="border border-slate-700 text-center">Trên 6m3/người/tháng</td>
                                          <td className="border border-slate-700 text-center">14.400</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </ul>
                                </ScrollArea>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="FIXED" id="wf" />
                        <div className="space-y-1">
                          <Label htmlFor="ef">Giá cố định mỗi số nước</Label>
                          <FormField
                            control={form.control}
                            name="waterPrice"
                            render={({ field: field2 }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field2}
                                    type="number"
                                    onChange={(e) => field2.onChange(e.currentTarget.valueAsNumber)}
                                    disabled={wType !== "FIXED"}
                                  />
                                </FormControl>
                                <FormDescription>{field2.value ? `${field2.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} (${readMoneyVi(field2.value)}/m3)` : ""}</FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
