import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePropDataCtx } from "../../_context/property_data.context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateTenantDialog() {
  const router = useRouter();
  const { property, units } = usePropDataCtx();
  const [unitId, setUnitId] = useState<string>(units[0].id);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
          Thêm người thuê nhà
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm người thuê nhà</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Select onValueChange={(v) => setUnitId(v)} value={unitId}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn phòng / căn hộ" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit, i) => (
                <SelectItem
                  key={i}
                  value={unit.id}
                  className="space-x-2"
                >
                  <div className="flex flex-row gap-2">
                    {unit.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => router.push(`/manage/rentals/new?propertyId=${property.id}&unitId=${unitId}`)}>Tiếp tục</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  );
};
