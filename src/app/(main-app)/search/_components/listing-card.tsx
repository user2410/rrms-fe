import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ManagedListing } from "@/models/listing";
import Image from "next/image";

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
import { useFavListings } from "@/context/favorite_listings.context";
import { BookmarkCheck } from "lucide-react";
import Link from "next/link";

const ListingCard = ({
  item,
}: {
  item: ManagedListing;
}): JSX.Element => {
  const { listing, property } = item;
  const {isFavoriteListing, toggleFavListing} = useFavListings();
  const images = property.media.filter(m => m.type === "IMAGE");

  return (
    <Card className={cn("relative hover:shadow-md cursor-pointer", listing.priority === 4 && "bg-orange-100")}>
      <CardHeader className="py-2" />
      <CardContent className="pb-2 px-2 grid grid-cols-8 gap-2">
        <div className={cn("relative aspect-square", listing.priority === 4 ? "col-span-3 grid grid-cols-2 gap-0.5" : "col-span-2")}>
          {listing.priority === 4 ? (
            Array.from({ length: 4 }).map((_, i) => (
              images[i] && (<div key={i} className="relative aspect-square">
                <Image
                  src={images[i]?.url || `/img/property_image_placeholder.webp`}
                  alt={images[i].description ?? property.name}
                  fill
                />
              </div>)
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
            verificationStatus={property.verificationStatus}
            className="text-lg"
          />
          <p className="text-sm">
            {GetLocationName(
              property.city,
              property.district,
              property.ward || "",
            )}
          </p>
          <div className="w-full flex flex-row items-end justify-between">
            <p className="text-sm font-semibold text-green-600">
              {listing.price.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}/tháng
            </p>
            <p className="text-sm">{property.area.toLocaleString("vi-VN")}m<sup>2</sup></p>
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
            <div className="flex flex-row items-center gap-2">
              <Link className={buttonVariants({variant: "outline"})} href={`tel:${listing.phone}`}>Gọi {listing.phone}</Link>
              <Link className={cn(buttonVariants({variant: "outline"}), "bg-blue-500 text-white")} href={`https://zalo.me/${listing.phone}`}>Nhắn Zalo</Link>
              <Button type="button" variant={isFavoriteListing(listing.id) ? "default" : "outline"} onClick={() => toggleFavListing(listing.id)}>
                <BookmarkCheck className={cn(isFavoriteListing(listing.id) ? "text-white" : "text-primary")} />
              </Button>
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
