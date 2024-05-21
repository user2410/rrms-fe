"use client";

import { PropertyTypeBadge } from "@/components/complex/property";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPropertyFullAddress, Property } from "@/models/property";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { ManagedProperty } from "../page";
import { Separator } from "@/components/ui/separator";

export default function PropertyCard({
  data
}: {
  data: ManagedProperty;
}) {
  const {property, listings, rentals} = data;

  return (
    <Fragment>
      <Card className="w-full overflow-hidden">
        <CardHeader className="relative !block w-full p-0 aspect-video">
          <Image
            src={property.media.find(m => m.type === 'IMAGE')!.url}
            alt={property.name}
            fill
            objectFit="cover"
          />
        </CardHeader>
        <CardContent className="mt-3 space-y-2">
          <CardTitle>
            <Link
              href={`/manage/properties/property/${property.id}`}
              className="font-medium text-lg"
            >
              {property.name}&nbsp;({property.area}m<sup>2</sup>)
            </Link>
          </CardTitle>
          <PropertyTypeBadge property={property} />
          <CardDescription className="text-sm text-muted-foreground">
            {getPropertyFullAddress(property)}
          </CardDescription>
        </CardContent>
        <Separator/>
        <CardFooter className="py-3 flex-row justify-between">
          <span className="space-x-2">
            <span className="text-sm font-light whitespace-nowrap">Đang cho thuê</span>
            <span className="text-sm font-semibold">{rentals.length}</span>
          </span>
          <span className="space-x-2">
            <span className="text-sm font-semibold">{listings.length}</span>
            <span className="text-sm font-light whitespace-nowrap">tin đăng</span>
          </span>
        </CardFooter>
      </Card>
    </Fragment>
  );
};
