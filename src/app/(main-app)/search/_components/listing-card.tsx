import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ManagedListing } from "@/models/listing";
import Image from "next/image";
import { BsHeartFill } from "react-icons/bs";

import { ListingTitle } from "@/components/complex/listing";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/libs/utils";
import { getPrimaryImage } from "@/models/property";
import { GetLocationName } from "@/utils/dghcvn";
import { stripHtml } from "@/utils/string";
import { formatDistance } from 'date-fns';
import { vi as vilocale } from "date-fns/locale";
import styles from "../_styles/listing_card.module.css";

const ListingCard = ({
  item,
}: {
  item: ManagedListing;
}): JSX.Element => {
  const { listing, property } = item;
  const images = property.media.filter(m => m.type === "IMAGE");

  return (
    <Card className={cn("relative hover:shadow-md cursor-pointer", listing.priority === 4 && "bg-orange-100")}>
      <CardHeader className="py-2" />
      <CardContent className="pb-2 px-2 grid grid-cols-8 gap-2">
        <div className={cn("relative aspect-square", listing.priority === 4 ? "col-span-3 grid grid-cols-2 gap-0.5" : "col-span-2")}>
          {listing.priority === 4 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative aspect-square">
                <Image
                  src={images[i]?.url || `/img/property_image_placeholder.webp`}
                  alt={images[i].description ?? property.name}
                  fill
                />
              </div>
            ))) : (
            <Image
              src={getPrimaryImage(property) || `/img/property_image_placeholder.webp`}
              alt={property.name}
              fill
            />
          )}
        </div>
        <div className={cn("space-y-3", listing.priority === 4 ? "col-span-5" : "col-span-6")}>
          <ListingTitle
            listing={listing}
            className="text-lg"
          />
          <div className="w-full flex flex-row items-end justify-between">
            <p className="text-base font-semibold text-green-600">
              {listing.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}/tháng
            </p>
            <p className="text-sm">{property.area.toLocaleString("vi-VN")}m<sup>2</sup></p>
            <p className="text-sm">
              {GetLocationName(
                property.city,
                property.district,
                property.ward || "",
              )}
            </p>
            <p className="text-sm text-gray-500">
              {formatDistance(new Date(listing.createdAt), new Date(), {
                addSuffix: true,
                locale: vilocale,
              })}
            </p>
          </div>
          <p className="text-sm text-slate-400 line-clamp-3">
            {stripHtml(listing.description)}
          </p>
          <div className="w-full flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-1">
              <Avatar>
                <AvatarFallback>{listing.fullName.split(" ").map(i => i[0]).join("")}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-500">{listing.fullName}</span>
            </div>
            <div className="space-x-2">
              <Button type="button">Gọi {listing.phone}</Button>
              <Button type="button" variant="outline" className="bg-blue-500 text-white">Nhắn Zalo</Button>
              <Button type="button"><BsHeartFill size={12}/></Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;

export function ListingCardSkeleton() {
  return (
    <Card className="relative hover:shadow-md cursor-pointer">

      <CardHeader>
        <div className="grid grid-cols-2 gap-2 lg:gap-4">
          <Skeleton className="relative aspect-video" />
          <div className="grid grid-cols-2 gap-2 lg:gap-4">
            <Skeleton className="relative" />
            <Skeleton className="relative" />
            <Skeleton className="relative" />
            <Skeleton className="relative" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="font-semibold uppercase w-96" />
        <div className="flex flex-row gap-2">
          <Skeleton className="text-red-600 font-semibold w-48" />
          <Skeleton className="w-20" />
        </div>
        <div className={styles.pcontainer}>
          <Skeleton className="font-light w-full" />
          <Skeleton className="font-light w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="flex flex-row gap-2">
          <Skeleton className="text-white w-40" />
          <Skeleton className="w-12" />
        </div>
      </CardFooter>
    </Card>
  );
};
