"use client";

import { Button } from "@/components/ui/button";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { Duration, intervalToDuration } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";

function durationToString(duration: Duration): string {
  const { days, hours, minutes, seconds } = duration;
  return days ? `${days} ngày ` : hours ? `${hours} giờ ` : minutes ? `${minutes} phút ` : seconds ? `${seconds} giây ` : "";
}

function ExpDuration({ exp }: { exp: Date }) {
  // console.log('exp', exp);
  const [expDuration, setExpDuration] = useState(intervalToDuration({
    start: new Date(),
    end: exp > new Date() ? exp : new Date(),
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (new Date().getTime() >= exp.getTime()) {
        return;
      }
      setExpDuration(intervalToDuration({
        start: now,
        end: exp > new Date() ? exp : new Date(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (exp > new Date()) ? (
    <span className="text-sm text-center font-light">{durationToString(expDuration)}</span>
  ) : (
    <h5>Hết hạn</h5>
  );
}

export default function ListingItem({
  listing,
  property,
}: {
  listing: Listing;
  property: Property;
}) {
  return (
    <div className="w-full grid grid-cols-2 border bg-card">
      <div className="grid grid-cols-3 border">
        <div className="relative aspect-square">
          <Image
            src={property.media.filter(m => m.type === 'IMAGE')[0].url}
            objectFit="cover"
            alt={property.name || ""}
            fill
          />
        </div>
        <div className="col-span-2 p-2 lg:p-3">
          <Link href={`/manage/listings/listing/${listing.id}`} className="text-lg font-medium">{listing.title}</Link>
          <p className="text-sm">{property.fullAddress}</p>
        </div>
      </div>
      <div className="grid grid-rows-3">
        <div className="row-span-2 grid grid-cols-3 border">
          <div className="flex flex-col justify-center items-center gap-2 w-full h-full border">
            <h5>Trạng thái</h5>
            <span className="w-4 h-4 rounded-full bg-green-500" />
            <p className="uppercase">{listing.active ? "Active" : "Inactive"}</p>
          </div>
          <div className="w-full h-full flex flex-col justify-center items-center gap-2 border">
            <h5>Thời gian còn lại</h5>
            <ExpDuration exp={new Date(listing.expiredAt)} />
            <p className="uppercase"></p>
          </div>
          <div className="w-full h-full flex flex-col justify-center items-center gap-2 border">
            <h5>Lượt xem (30 ngày trước)</h5>
            <span className="text-sm font-light">96</span>
            <p className="uppercase"></p>
          </div>
        </div>
        <div className="bg-slate-200 p-2 flex flex-row items-center justify-between">
          <div className="flex flex-row gap-1 items-center">
            <FaClock size={10} />
            <span className="text-xs font-light">Cập nhật {listing.updatedAt.toLocaleString()}</span>
          </div>
          <div className="flex flex-row gap-2">
            <Button variant="outline">Xem</Button>
            <Button variant="outline">Sửa</Button>
            <Button variant="outline">Xóa</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
