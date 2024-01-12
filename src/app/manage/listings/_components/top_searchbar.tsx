import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TopSearchbar() {
  return (
    <div className="bg-muted flex flex-row gap-2">
      <Input className="flex-1" placeholder=""/>
      <Select>
        <SelectTrigger className="w-[120px] gap-1">
          <SelectValue placeholder="All"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="name">Tiêu đề</SelectItem>
            <SelectItem value="type">Loại</SelectItem>
            <SelectItem value="address">Địa chỉ</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="button" variant="outline">Đặt lại</Button>
    </div>
  );
};
