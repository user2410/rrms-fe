import { Unit, uAmenities } from "@/models/unit";
import { ListingDetail } from "../page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { FaCouch, FaToilet } from "react-icons/fa";
import { MdBalcony, MdBathtub, MdBed, MdKitchen } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import LightGallery from 'lightgallery/react';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { useSession } from "next-auth/react";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export default function UnitsList({
  listingDetail,
}: {
  listingDetail: ListingDetail;
}) {
  const session = useSession();
  const router = useRouter();
  const [selectedUnit, setSelectedUnit] = useState<string>('');

  const { property, listing } = listingDetail;
  const unitTypeText =
    ['APARTMENT', 'PRIVATE'].includes(property.type)
      ? "Căn hộ"
      : ['ROOM', 'STUDIO'].includes(property.type)
        ? "Phòng trọ"
        : null;

  const units = listing.units.map(lu => {
    const u = listingDetail.units.find(u => u.id === lu.unitId)!;
    return {
      ...u,
      price: lu.price,
    };
  });

  return (
    <div>
      <div className="w-full flex flex-row justify-between items-center4">
        <h2 className="font-semibold text-xl mb-2">
          Danh sách các {unitTypeText}
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                type="button"
                disabled={!selectedUnit || session.status !== "authenticated" || !!listingDetail.property.managers.map(m => m.managerId).find(m => m === session.data?.user.user.id)}
                onClick={() => router.push(`/application/${listing.id}?units=${selectedUnit}`)}
              >
                Ứng tuyển
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {session.status === "unauthenticated" 
                ? "Đăng nhập để ứng tuyển" 
                : !selectedUnit
                ? "Chọn một phòng trước khi ứng tuyển" 
                : listingDetail.property.managers.map(m => m.managerId).find(m => m === session.data?.user.user.id)
                ? "Bạn không thể ứng tuyển vào nhà cho thuê này"
                : `Ứng tuyển vào ${units.find(u => u.id === selectedUnit)?.name}`
              }
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead className="text-left max-w-[50%]">{unitTypeText}</TableHead>
              <TableHead className="text-left">Tầng</TableHead>
              <TableHead className="text-left">Diện tích (m<sup>2</sup>)</TableHead>
              <TableHead className="text-left">Giá thuê (tháng)</TableHead>
              <TableHead className="text-left">Trạng thái</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit, index) => (
              <Collapsible key={index} asChild>
                <>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectedUnit === unit.id}
                        onCheckedChange={() => setSelectedUnit(v => v === unit.id ? '' : unit.id)}
                      />
                    </TableCell>
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
                          <ul className="grid grid-cols-2 gap-1 w-full">
                            {unit.amenities?.map((amenity, index) => {
                              const ua = uAmenities.find(u => u.id.toString() === amenity.amenityId.toString());
                              const Icon = ua?.icon;
                              return (
                                <li key={index} className="">
                                  <span className="flex flex-row gap-2 items-center">{Icon && (<Icon size={16}/>)} {ua?.text}</span>
                                  <p className="text-xs font-light">{amenity.description}</p>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        {(unit.media && unit.media?.length > 0) && (
                          <div className="space-y-3">
                            <h3 className="font-medium">Hình ảnh</h3>
                            <LightGallery plugins={[lgZoom, lgThumbnail]} mode="lg-fade" elementClassNames="flex flex-row flex-wrap gap-2">
                              {unit.media.map((media, index) => (
                                <a
                                  key={index}
                                  className="gallery-item"
                                  data-src={media.url}
                                >
                                  <img
                                    src={media.url}
                                    alt={unit.name}
                                    className="m-2 max-w-[100px] aspect-video object-contain"
                                  />
                                </a>
                              ))}
                            </LightGallery>
                          </div>
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
