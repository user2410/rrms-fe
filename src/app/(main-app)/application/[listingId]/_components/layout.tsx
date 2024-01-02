'use client';

import { Button } from "@/components/ui/button";
import { Media } from "@/models/media";
import { ToMillion } from "@/utils/currency";
import Image from "next/image";
import { useData } from "../_context/data.context";
import { Listing } from "@/models/listing";
import { Property, PropertyMedia } from "@/models/property";

export default function Layout({
  listing,
  property,
  children,
}: {
  listing: Listing;
  property: Property;
  children: React.ReactNode,
}) {
  const dataCtx = useData();

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-4">
          <div className="relative aspect-video w-52">
            <Image
              src={property.media.filter((m) => m.type === 'IMAGE')[0].url}
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold">{property.fullAddress}</h2>
            <h3>{property.area}m<sup>2</sup>, {ToMillion(listing.price)}</h3>
            <p className="text-sm font-thin">{property.type}</p>
          </div>
        </div>
        <div className="mx-2 flex flex-row gap-2">
          <Button variant="link">Cancel Application</Button>
          <Button variant="outline">Save for Later</Button>
        </div>
      </div>
      {children}
    </div>
  );
};
