import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IconBadge } from "@/components/ui/icon-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Property, mapPropertyTypeToText } from "@/models/property";
import { Unit, mapUnitTypeToText, uAmenities } from "@/models/unit";
import { Bath, Bed, Home, Image, Pencil, Sofa } from "lucide-react";
import { useMemo } from "react";
import { FaRegSquare, FaToilet } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";

import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from "lightgallery/react";
import { usePropDataCtx } from "../../_context/property_data.context";
import _ from "lodash";

export default function UnitsFormWrapper() {
  const {property, units} = usePropDataCtx();

  return _.isEqual(property, {})
  ? (<></>)
  : (<UnitsForm property={property} units={units}/>);
}

function UnitsForm({
  property,
  units,
} : {
  property: Property;
  units: Unit[];
}) {
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
                    <Card>
                      <CardHeader className="flex-row justify-between items-center">
                        <CardTitle className="text-xl">{mapPropertyTypeToText[property.type as keyof typeof mapPropertyTypeToText]} {unit.name}</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          className="p-1"
                          onClick={() => console.log("editing unit", unit.name)}>
                          <Pencil className="h-6 w-6" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <h2 className="font-semibold">Phòng ốc</h2>
                          <div className="grid grid-cols-2 gap-2">
                            {unit.numberOfLivingRooms && (
                              <div className="flex flex-row items-center gap-2">
                                <Sofa className="h-6 w-6" />
                                <p>{unit.numberOfLivingRooms} phòng</p>
                              </div>
                            )}
                            {unit.numberOfKitchens && (
                              <div className="flex flex-row items-center gap-2">
                                <GiKnifeFork size={24} />
                                <p>{unit.numberOfKitchens} phòng</p>
                              </div>
                            )}
                            {unit.numberOfBedrooms && (
                              <div className="flex flex-row items-center gap-2">
                                <Bed className="h-6 w-6" />
                                <p>{unit.numberOfBedrooms} phòng</p>
                              </div>
                            )}
                            {unit.numberOfBathrooms && (
                              <div className="flex flex-row items-center gap-2">
                                <Bath className="h-6 w-6" />
                                <p>{unit.numberOfBathrooms} phòng</p>
                              </div>
                            )}
                            {unit.numberOfToilets && (
                              <div className="flex flex-row items-center gap-2">
                                <FaToilet size={24} />
                                <p>{unit.numberOfToilets} phòng</p>
                              </div>
                            )}
                            {unit.numberOfBalconies && (
                              <div className="flex flex-row items-center gap-2">
                                <FaRegSquare size={24} />
                                <p>{unit.numberOfBalconies} ban công</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h2 className="font-semibold">Tiện nghi</h2>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tên</TableHead>
                                <TableHead>Ghi chú</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {unit.amenities.map((amenity, index) => (
                                <TableRow key={index}>
                                  <TableCell className="flex flex-row gap-1">{(() => {
                                    const ua = uAmenities.find(a => a.id.toString() === amenity.amenityId.toString());
                                    return (
                                      <>
                                        {ua?.icon && <ua.icon />}
                                        {ua?.text}
                                      </>
                                    );
                                  })()}</TableCell>
                                  <TableCell>{amenity.description || "-"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <div className="space-y-3">
                          <h2 className="font-semibold">Ảnh chụp</h2>
                          <LightGallery plugins={[lgZoom, lgThumbnail]} mode="lg-fade" elementClassNames="flex flex-row flex-wrap gap-2">
                            {unit.media.map((media, index) => (
                              <a
                                key={index}
                                className="gallery-item"
                                data-src={media.url}
                              >
                                <img
                                  src={media.url}
                                  className="m-2 max-w-[160px] aspect-video object-contain"
                                />
                              </a>
                            ))}
                          </LightGallery>
                        </div>
                      </CardContent>
                    </Card>
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
