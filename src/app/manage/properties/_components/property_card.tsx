"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPropertyFullAddress, getPropertyTypeText, Property } from "@/models/property";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

const propertyTypesToBgColor = {
  APARTMENT: "bg-red-600",
  PRIVATE: "bg-blue-600",
  ROOM: "bg-green-600",
  STORE: "bg-yellow-600",
  OFFICE: "bg-purple-600",
  MINIAPARTMENT: "bg-pink-600",
};

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
          <Badge className={`text-white ${propertyTypesToBgColor[property.type as keyof typeof propertyTypesToBgColor]}`}>
            {getPropertyTypeText(property)}
          </Badge>
          <CardDescription className="text-sm text-muted-foreground">
            {getPropertyFullAddress(property)}
          </CardDescription>
        </CardContent>
      </Card>
    </Fragment>
  );
};
