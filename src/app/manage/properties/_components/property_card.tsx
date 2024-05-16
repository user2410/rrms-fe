"use client";

import { PropertyTypeBadge } from "@/components/complex/property";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPropertyFullAddress, getPropertyTypeText, Property, propertyTypesToBgColor } from "@/models/property";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

export default function PropertyCard({
  property
}: {
  property: Property;
}) {
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
      </Card>
    </Fragment>
  );
};
