import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/ui/icon-badge";
import { Unit, mapUnitTypeToText } from "@/models/unit";
import { Home, Image, Pencil } from "lucide-react";
import { useMemo } from "react";

interface FormProps {
  initialData: {
    unit: Unit[];
  };
  propId: string;
  propType: string;
};

export default function UnitsForm({
  initialData,
  propId,
  propType,
}: FormProps) {
  // group units by floor
  const floors = useMemo(() => {
    const us = initialData.unit.reduce((acc, unit) => {
      if (!acc[unit.floor]) {
        acc[unit.floor] = [];
      }
      acc[unit.floor].push(unit);
      return acc;
    }, {} as Record<number, Unit[]>);
    const ret = [];
    for(const key in us) {
      ret.push({floor: Number(key), units: us[key]});
    }
    return ret;
  }, [initialData.unit]);

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center gap-2">
        <IconBadge icon={Home} />
        <h2 className="text-xl">
          {propType === "APARTMNET" && "Quỹ căn hộ"}
          {propType === "UNIT" && "Dãy phòng trọ"}
        </h2>
      </div>
      <div className="border bg-slate-100 rounded-md p-4">
        {floors.map((floor, index) => (
          <div key={index} className="space-y-3">
            <h3>Tầng {floor.floor}</h3>
            <div className="space-y-2">  
              {floor.units.map((unit, index1) => (
                <div key={index1} className="rounded bg-slate-400 hover:bg-blue-200 p-2 flex flex-row items-center justify-between">
                  <h3 className="font-medium">{unit.name}</h3>
                  <div className="flex flex-row gap-1">
                    <Badge>{mapUnitTypeToText[unit.type as keyof typeof mapUnitTypeToText]}</Badge>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="p-1"
                      onClick={() => console.log("editing unit", unit.name)}>
                      <Pencil className="h-6 w-6"/>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};
