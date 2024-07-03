import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/models/file";
import { DisplayFileSize } from "@/utils/file";
import { useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ApplicationForm } from "./main_form";
import FieldMoneyDescription from "@/components/complex/field-money_desc";

export default function Employment() {
  const form = useFormContext<ApplicationForm>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Công việc</CardTitle>
        <CardDescription>Công việc nghề nghiệp hiện tại của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <FormField
          name="yd.employmentStatus"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabelRequired>Trạng thái công việc</FormLabelRequired>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EMPLOYED">Đang làm việc</SelectItem>
                  <SelectItem value="STUDENT">Sinh viên</SelectItem>
                  <SelectItem value="SELF-EMPLOYED">Tự kinh doanh</SelectItem>
                  <SelectItem value="RETIRED">Đã nghỉ hưu</SelectItem>
                  <SelectItem value="UNEMPLOYED">Không có việc làm</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          name="yd.employmentCompanyName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabelRequired>Tên công ty / trường học / nơi công tác</FormLabelRequired>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            name="yd.employmentPosition"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Vị trí công việc</FormLabelRequired>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="yd.employmentMonthlyIncome"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Thu nhập hàng tháng</FormLabelRequired>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} />
                </FormControl>
                <FieldMoneyDescription value={field.value}/>
              </FormItem>
            )}
          />
        </div>
        {/* <FormItem className="col-span-2">
          <div className="flex flex-row justify-between">
            <div>
              <FormLabelRequired>Thống kê thu nhập (tùy chọn)</FormLabelRequired>
              <FormDescription>Tải lên phiếu lương, sao kê ngân hàng</FormDescription>
            </div>
            <Button type="button" onClick={() => filesInputRef.current && filesInputRef.current.click()}>Upload ảnh</Button>
          </div>
          <CardContent
            onClick={() => fileFields.length === 0 && filesInputRef.current && filesInputRef.current.click()}
            className="p-6 cursor-pointer w-full h-full border-2 border-dashed border-primary flex flex-wrap gap-2 xl:gap-4 text-base select-none"
          >
            <input ref={filesInputRef} type="file" accept="image/*" multiple hidden onChange={handleFilesUpload} />
            {fileFields.length === 0 && (
              <div className="w-full text-center my-3 pointer-events-none">
                <div className="fas fa-cloud-arrow-up m-2" />
                Bấm để chọn ảnh
              </div>
            )}
            {fileFields.map((file, index) => (
              <Card key={file.id} className="w-[180px] shadow-md">
                <CardHeader className="h-[180px] p-2 lg:p-4">
                  <img src={file.url} alt="" className="max-w-full max-h-full object-cover" />
                </CardHeader>
                <Separator />
                <CardContent className="p-2 lg:p-4">
                  <CardTitle className="text-sm font-normal truncate">{file.name}</CardTitle>
                  <CardDescription className="text-xs">{DisplayFileSize(file.size!)}</CardDescription>
                </CardContent>
                <Separator />
                <CardFooter className="p-0">
                  <Button className="w-full h-full bg-secondary text-secondary-foreground rounded-none" onClick={() => handleRemoveFile(file.url, index)}>Remove</Button>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </FormItem> */}
        <FormField
          name="yd.employmentComment"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Ngoài tiền lương hàng tháng, tôi có 100 triệu tiết kiệm hàng tháng" />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
