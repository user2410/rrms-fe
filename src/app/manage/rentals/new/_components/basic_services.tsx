import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../page";

import FieldMoneyDescription from "@/components/complex/field-money_desc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import basicServicesInfo from "@configs/basic_services.config.json";
import { BasicServiceSelect } from "./basic_service_select";
import { getRegion } from "@/utils/dghcvn";
import { Property } from "@/models/property";

export default function BasicServices() {
  const form = useFormContext<FormValues>();
  const property = form.watch("property") as Property;
  const eType = form.watch("services.electricityPaymentType");
  const wType = form.watch("services.waterPaymentType");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Dịch vụ cơ bản</CardTitle>
        <CardDescription> Dịch vụ sinh hoạt cơ bản chủ nhà cung cấp cho khách thuê</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <h2 className="font-semibold">Điện <span className="text-red-600 ml-1">*</span></h2>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="services.electricitySetupBy"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bên thiết lập điện" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TENANT">Bên thuê đăng ký và đóng phí trực tiếp cho nhà cung cấp dịch vụ</SelectItem>
                      <SelectItem value="LANDLORD">Bên cho thuê đăng ký và thu phí từ bên thuê</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('services.electricitySetupBy') === 'LANDLORD' && (
              <FormField
                control={form.control}
                name="services.electricityPaymentType"
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
                          <div className="space-y-1">
                            <div className="flex flex-row items-center gap-2">
                              <Label htmlFor="er">Giá bán lẻ điện sinh hoạt</Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4" />
                                  </TooltipTrigger>
                                  <TooltipContent className="w-[400px]">
                                    <ScrollArea className="w-full h-72">
                                      <div dangerouslySetInnerHTML={{ __html: basicServicesInfo.electricity }} />
                                    </ScrollArea>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            {field.value === "RETAIL" && (
                              <BasicServiceSelect 
                                productId="17"
                                defaultGroup={3}
                                groupTitle="Tập đoàn"
                                customerFieldName="services.electricityCustomerCode"
                                providerFieldName="services.electricityProvider"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="FIXED" id="ef" />
                          <div className="space-y-1">
                            <Label htmlFor="ef">Giá cố định mỗi số điện</Label>
                            <FormField
                              control={form.control}
                              name="services.electricityPrice"
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
                                  <FieldMoneyDescription value={field2.value} />
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
            )}
          </div>
        </div>
        <div>
          <h2 className="font-semibold">Nước <span className="text-red-600 ml-1">*</span></h2>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="services.waterSetupBy"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bên thiết lập nước" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TENANT">Bên thuê đăng ký và đóng phí trực tiếp cho nhà cung cấp dịch vụ</SelectItem>
                      <SelectItem value="LANDLORD">Bên cho thuê đăng ký và thu phí từ bên thuê</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('services.waterSetupBy') === 'LANDLORD' && (
              <FormField
                control={form.control}
                name="services.waterPaymentType"
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
                          <div className="space-y-1">
                            <div className="flex flex-row items-center gap-2">
                              <Label htmlFor="wr">Giá bán lẻ nước sinh hoạt</Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4" />
                                  </TooltipTrigger>
                                  <TooltipContent className="w-[400px]">
                                    <ScrollArea className="w-full h-72">
                                      <div dangerouslySetInnerHTML={{ __html: basicServicesInfo.water }} />
                                    </ScrollArea>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            {field.value === "RETAIL" && (
                              <BasicServiceSelect 
                                productId="18"
                                groupTitle="Khu vực"
                                defaultGroup={(() => {
                                  if (property.city === "SG") {
                                    return 11;
                                  } else if (property.city === "HN") {
                                    return 12;
                                  } else if (property.city === "DDN") {
                                    return 16;
                                  } else {
                                    const region = getRegion(property.city);
                                    switch (region) {
                                      case "north":
                                        return 14;
                                      case "south":
                                        return 13;
                                      default:
                                        return 15;
                                    }
                                  }
                                })()}
                                customerFieldName="services.waterCustomerCode"
                                providerFieldName="services.waterProvider"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="FIXED" id="wf" />
                          <div className="space-y-1">
                            <Label htmlFor="ef">Giá cố định mỗi số nước</Label>
                            <FormField
                              control={form.control}
                              name="services.waterPrice"
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
                                  <FieldMoneyDescription value={field2.value} />
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
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
