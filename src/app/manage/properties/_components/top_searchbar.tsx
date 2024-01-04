import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TopSearchbar() {
  return (
    <div className="bg-muted flex flex-row gap-2">
      <Select defaultValue="name">
        <SelectTrigger className="max-w-[120px]">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="name">Tên</SelectItem>
            <SelectItem value="type">Loại</SelectItem>
            <SelectItem value="address">Địa chỉ</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input className="flex-1" placeholder=""/>
      <Select>
        <SelectTrigger className="max-w-[60px]">
          <SelectValue placeholder="All"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="name">Tên bất động sản</SelectItem>
            <SelectItem value="type">Loại</SelectItem>
            <SelectItem value="address">Địa chỉ</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="button">Tìm kiếm</Button>
    </div>
  );
};
