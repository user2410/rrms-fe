import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TopSearchbar() {
  return (
    <div className="flex flex-row gap-2 border">
      <Input className="flex-1" placeholder="Tìm theo địa chỉ nhà, người ứng tuyển"/>
      <Select>
        <SelectTrigger className="w-[120px] gap-1">
          <SelectValue placeholder="Trạng thái"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="name">Đang chờ</SelectItem>
            <SelectItem value="name">Đang xét duyệt</SelectItem>
            <SelectItem value="type">Châp nhận</SelectItem>
            <SelectItem value="address">Từ chối</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="button" variant="outline">Đặt lại</Button>
    </div>
  );
};
