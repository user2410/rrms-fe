import { Unit, uAmenities } from "@/models/unit";
import { ListingDetail } from "../page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { FaCouch, FaToilet } from "react-icons/fa";
import { MdBalcony, MdBathtub, MdBed, MdKitchen } from "react-icons/md";

export default function UnitsList({
  listingDetail,
}: {
  listingDetail: ListingDetail;
}) {
  const { property, units } = listingDetail;
  const unitTypeText =
    ['APARTMENT', 'PRIVATE'].includes(property.type)
      ? "Căn hộ"
      : ['ROOM', 'STUDIO'].includes(property.type)
        ? "Phòng trọ"
        : null;

  return (
    <div>
      <h2 className="font-semibold text-xl mb-2">
        Danh sách các {unitTypeText}
      </h2>
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left max-w-[50%]">{unitTypeText}</TableHead>
              <TableHead className="text-left">Tầng</TableHead>
              <TableHead className="text-left">Diện tích (m<sup>2</sup>)</TableHead>
              <TableHead className="text-left">Giá thuê (triệu/tháng)</TableHead>
              <TableHead className="text-left">Trạng thái</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit, index) => (
              <Collapsible key={index} asChild>
                <>
                  <TableRow>
                    <TableCell className="text-left">{unit.name}</TableCell>
                    <TableCell className="text-left">{unit.floor}</TableCell>
                    <TableCell className="text-left">{unit.area}</TableCell>
                    <TableCell className="text-left">{unit.price}</TableCell>
                    {/* TODO: Change this cell */}
                    <TableCell className="text-left">Đang trống</TableCell>
                    <TableCell className="text-right">
                      <CollapsibleTrigger asChild>
                        <ChevronDown className="w-4 h-4" />
                      </CollapsibleTrigger>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <TableRow>
                      <TableCell colSpan={5} className="space-y-4">
                        <div className="space-y-3">
                          <h3 className="font-medium">Tiện nghi sẵn có</h3>
                          <ul className="grid grid-cols-2 gap-1 w-full list-disc list-inside">
                            {unit.amenities.map((amenity, index) => {
                              const ua = uAmenities.find(u => u.id.toString() === amenity.amenityId.toString());
                              const Icon = ua?.icon;
                              return (
                              <li key={index} className="flex flex-row items-center gap-2">
                                <Icon size={16}/>
                                <span>{ua?.text}</span>
                              </li>
                              );
                            })}
                          </ul>
                        </div>
                        {unit.media?.length > 0 && (
                          <></>
                        )}
                        <div className="space-y-3">
                          <h3 className="font-medium">Phòng ốc</h3>
                          <div className="grid grid-cols-2 gap-1 w-full">
                            {unit.numberOfBedrooms && (
                              <div className="border-y grid grid-cols-2">
                                <div className="flex items-center gap-1">
                                  <MdBed size={24} />
                                  <span>Phòng ngủ</span>
                                </div>
                                <div className="py-4">{unit.numberOfBedrooms}</div>
                              </div>
                            )}
                            {unit.numberOfBathrooms && (
                              <div className="border-y grid grid-cols-2">
                                <div className="flex items-center gap-1">
                                  <MdBathtub size={24} />
                                  <span>Phòng tắm</span>
                                </div>
                                <div className="py-4">{unit.numberOfBathrooms}</div>
                              </div>
                            )}
                            {unit.numberOfToilets && (
                              <div className="border-y grid grid-cols-2">
                                <div className="flex items-center gap-1">
                                  <FaToilet size={24} />
                                  <span>Toilet</span>
                                </div>
                                <div className="py-4">{unit.numberOfToilets}</div>
                              </div>
                            )}
                            {unit.numberOfLivingRooms && (
                              <div className="border-y grid grid-cols-2">
                                <div className="flex items-center gap-1">
                                  <FaCouch size={24} />
                                  <span>Phòng khách</span>
                                </div>
                                <div className="py-4">{unit.numberOfLivingRooms}</div>
                              </div>
                            )}
                            {unit.numberOfKitchens && (
                              <div className="border-y grid grid-cols-2">
                                <div className="flex items-center gap-1">
                                  <MdKitchen size={24} />
                                  <span>Phòng bếp</span>
                                </div>
                                <div className="py-4">{unit.numberOfKitchens}</div>
                              </div>
                            )}
                            {unit.numberOfBalconies && (
                              <div className="border-y grid grid-cols-2">
                                <div className="flex items-center gap-1">
                                  <MdBalcony size={24} />
                                  <span>Ban công</span>
                                </div>
                                <div className="py-4">{unit.numberOfBalconies}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
