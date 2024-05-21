import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IconBadge } from "@/components/ui/icon-badge";
import { Property } from "@/models/property";
import { Unit, mapUnitTypeToText } from "@/models/unit";
import { Home } from "lucide-react";
import { useMemo } from "react";

import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import _ from "lodash";
import { usePropDataCtx } from "../../_context/property_data.context";
import RoomItem from "./room_item";

export default function UnitsForm() {
  const {property, units} = usePropDataCtx();
  // group units by floor
  const floors = useMemo(() => {
    const us = units.reduce((acc, unit) => {
      if (!acc[unit.floor]) {
        acc[unit.floor] = [];
      }
      acc[unit.floor].push(unit);
      return acc;
    }, {} as Record<number, Unit[]>);
    const ret = [];
    for (const key in us) {
      ret.push({ floor: Number(key), units: us[key] });
    }
    return ret;
  }, [units]);

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center gap-2">
        <IconBadge icon={Home} />
        <h2 className="text-xl">
          {property.type === "APARTMENT" && "Quỹ căn hộ"}
          {property.type === "ROOM" && "Dãy phòng trọ"}
        </h2>
      </div>
      <div className="border bg-slate-100 rounded-md p-4 space-y-6">
        {floors.map((floor, index) => (
          <div key={index} className="space-y-3">
            <h3>Tầng {floor.floor}</h3>
            <div className="space-y-2">
              {floor.units.map((unit, index1) => (
                <Collapsible key={index1}>
                  <CollapsibleTrigger className="w-full">
                    <div key={index1} className="rounded bg-slate-400 hover:bg-blue-200 p-2 flex flex-row items-center justify-between">
                      <h3 className="font-medium">{unit.name}</h3>
                      <Badge>{mapUnitTypeToText[unit.type as keyof typeof mapUnitTypeToText]}</Badge>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <RoomItem property={property} unit={unit}/>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};
