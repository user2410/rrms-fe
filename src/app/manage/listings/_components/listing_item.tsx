"use client";

import { getListingState, Listing, listingPriorities } from "@/models/listing";
import { getPrimaryImage, getPropertyFullAddress, Property } from "@/models/property";
import { Unit } from "@/models/unit";
import Image from "next/image";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import ExpDuration from "./exp_duration";
import { PropertyTypeBadge } from "@/components/complex/property";
import { cn } from "@/libs/utils";
import { Badge } from "@/components/ui/badge";

export default function ListingItem({
  listing,
  property,
  units,
}: {
  listing: Listing;
  property: Property;
  units: Unit[];
}) {
  const state = getListingState(listing);
  const priority = listingPriorities.find(item => item.priority === listing.priority);

  return (
    <div className="w-full grid grid-cols-5 border bg-card">
      <div className="col-span-3 grid grid-cols-3 border">
        <div className="relative aspect-square flex flex-col justify-center">
          <Image
            src={getPrimaryImage(property)}
            objectFit="cover"
            alt={property.name || ""}
            fill
          />
        </div>
        <div className="col-span-2 p-2 lg:p-3 space-y-2">
          <Link href={`/manage/listings/listing/${listing.id}`} className="text-lg font-medium">{listing.title}</Link>
          <p className="text-sm">{getPropertyFullAddress(property)}</p>
          <div className="space-y-1">
            <div className="flex flex-row items-center gap-2">
              <PropertyTypeBadge property={property} />
              <Link 
                href={`/manage/properties/property/${property.id}`} 
                className="text-sm"
              >
                {property.name.length > 60 ? `${property.name.slice(0, 60)}...` : property.name}
              </Link>
            </div>
            <div className="space-y-0.5">
              <h3><strong>Căn hộ/phòng: </strong></h3>
              <div className="grid grid-cols-2 gap-1">
                {units.slice(0, 4).map((u, index) => (
                  <Link 
                    key={index} 
                    href={`/manage/properties/property/${property.id}?unitId=${u.id}`} 
                    className="overflow-hidden overflow-ellipsis whitespace-nowrap text-blue-400 text-sm"
                  >
                    {u.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2 grid grid-rows-4">
        <div className="row-span-3 grid grid-cols-3 border">
          <div className="flex flex-col justify-center items-center gap-2 w-full h-full border">
            <h5 className="text-center">Trạng thái</h5>
            <span className={`w-4 h-4 rounded-full ${state === "active" ? "bg-green-600" : "bg-slate-600"}`} />
            <p className="uppercase text-sm">{state === "active" ? "Online" : state === "expired" ? "Hết hạn" : "Chưa thanh toán"}</p>
          </div>
          <div className="w-full h-full flex flex-col justify-center items-center gap-2 border">
            <h5 className="text-center">Thời gian còn lại</h5>
            <ExpDuration exp={new Date(listing.expiredAt)} />
            <p className="text-xs font-light">Hết hạn ngày {listing.expiredAt.toLocaleDateString("vi-VN")}</p>
          </div>
          <div className="w-full h-full flex flex-col justify-center items-center gap-2 border">
            <h5 className="text-center">Mức ưu tiên</h5>
            <Badge className={cn("text-sm text-white", priority?.bgColor)}>{priority?.label}</Badge>
          </div>
        </div>
        <div className="bg-slate-200 p-2 flex flex-row items-center justify-between">
          <div className="flex flex-row gap-1 items-center">
            <FaClock size={10} />
            <span className="text-xs font-light">Cập nhật {listing.updatedAt.toLocaleString("vi-VN")}</span>

          </div>
        </div>
      </div>
    </div>
  );
};
