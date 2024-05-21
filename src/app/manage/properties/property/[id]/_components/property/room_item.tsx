import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mapPropertyTypeToText, Property } from "@/models/property";
import { BalconyIcon, BathroomIcon, BedroomIcon, KitchenIcon, LivingroomIcon, ToiletIcon, uAmenities, Unit, UnitAmenity, UnitMedia } from "@/models/unit";
import { Pencil, Sofa } from "lucide-react";

import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from "lightgallery/react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormValues = {
  numberOfLivingRooms: number;
  numberOfKitchens: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  numberOfToilets: number;
  numberOfBalconies: number;
  amenities: UnitAmenity[];
  media: UnitMedia[];
};

export default function RoomItem({
  property,
  unit,
}: {
  property: Property,
  unit: Unit,
}) {
  const defaultValues = {
    numberOfLivingRooms: unit.numberOfLivingRooms || 0,
    numberOfKitchens: unit.numberOfKitchens || 0,
    numberOfBedrooms: unit.numberOfBedrooms || 0,
    numberOfBathrooms: unit.numberOfBathrooms || 0,
    numberOfToilets: unit.numberOfToilets || 0,
    numberOfBalconies: unit.numberOfBalconies || 0,
    amenities: unit.amenities,
    media: unit.media,
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [values, setValues] = useState<FormValues>(defaultValues);

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle className="text-xl">{mapPropertyTypeToText[property.type as keyof typeof mapPropertyTypeToText]} {unit.name}</CardTitle>
        <Button
          type="button"
          variant="ghost"
          className="p-1"
          onClick={() => setIsEditing(v => !v)}>
          {isEditing ? (
            "Lưu"
          ) : (
            <Pencil className="h-6 w-6" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h2 className="font-semibold">Phòng ốc</h2>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Phòng ngủ</Label>
                <Input
                  type="number"
                  value={values.numberOfBedrooms}
                  onChange={(e) => setValues({ ...values, numberOfBedrooms: e.target.valueAsNumber })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phòng tắm</Label>
                <Input
                  type="number"
                  value={values.numberOfBathrooms}
                  onChange={(e) => setValues({ ...values, numberOfBathrooms: e.target.valueAsNumber })}
                />
              </div>
              <div className="space-y-2">
                <Label>Ban công</Label>
                <Input
                  type="number"
                  value={values.numberOfBalconies}
                  onChange={(e) => setValues({ ...values, numberOfBalconies: e.target.valueAsNumber })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nhà vệ sinh</Label>
                <Input
                  type="number"
                  value={values.numberOfToilets}
                  onChange={(e) => setValues({ ...values, numberOfToilets: e.target.valueAsNumber })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phòng khách</Label>
                <Input
                  type="number"
                  value={values.numberOfLivingRooms}
                  onChange={(e) => setValues({ ...values, numberOfLivingRooms: e.target.valueAsNumber })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phòng bếp</Label>
                <Input
                  type="number"
                  value={values.numberOfKitchens}
                  onChange={(e) => setValues({ ...values, numberOfKitchens: e.target.valueAsNumber })}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {unit.numberOfBedrooms ? (
                <div className="flex flex-row items-center gap-2">
                  <BedroomIcon className="h-6 w-6" />
                  <p>{unit.numberOfBedrooms} phòng</p>
                </div>
              ) : null}
              {unit.numberOfBathrooms ? (
                <div className="flex flex-row items-center gap-2">
                  <BathroomIcon className="h-6 w-6" />
                  <p>{unit.numberOfBathrooms} phòng</p>
                </div>
              ) : null}
              {unit.numberOfToilets ? (
                <div className="flex flex-row items-center gap-2">
                  <ToiletIcon size={24} />
                  <p>{unit.numberOfToilets} phòng</p>
                </div>
              ) : null}
              {unit.numberOfBalconies ? (
                <div className="flex flex-row items-center gap-2">
                  <BalconyIcon size={24} />
                  <p>{unit.numberOfBalconies} ban công</p>
                </div>
              ) : null}
              {unit.numberOfLivingRooms ? (
                <div className="flex flex-row items-center gap-2">
                  <LivingroomIcon className="h-6 w-6" />
                  <p>{unit.numberOfLivingRooms} phòng</p>
                </div>
              ) : null}
              {unit.numberOfKitchens ? (
                <div className="flex flex-row items-center gap-2">
                  <KitchenIcon size={24} />
                  <p>{unit.numberOfKitchens} phòng</p>
                </div>
              ) : null}

            </div>
          )}
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
              {isEditing ? (
                values.amenities.map((amenity, index) => (
                  <TableRow key={index}>
                    <TableCell className="flex flex-row items-center gap-1">
                      <Select
                        defaultValue={unit.amenities[index].amenityId.toString()}
                        onValueChange={(e) => setValues(v => ({
                          ...v,
                          amenities: v.amenities.map((a, i) => i === index ? {
                            ...a,
                            amenityId: e,
                          } : a)
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tiện nghi" />
                        </SelectTrigger>
                        <SelectContent>
                          {uAmenities.map((a, i) => (
                            <SelectItem
                              key={i}
                              value={a.id.toString()}
                            >
                              {a.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={amenity.description}
                        onChange={(e) => setValues(v => ({
                          ...v,
                          amenities: v.amenities.map((a, i) => i === index ? {
                            ...a,
                            description: e.target.value,
                          } : a)
                        }))
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                unit.amenities.map((amenity, index) => (
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
                ))
              )}
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
  );
};
