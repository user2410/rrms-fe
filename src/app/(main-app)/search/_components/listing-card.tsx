import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { listingPriorities } from "@/models/listing";
import clsx from "clsx";
import Image from "next/image";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaPhone } from "react-icons/fa";

import styles from "../_styles/listing_card.module.css";
import { SearchListingItem } from "./listings_list";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext } from "react";
import { FavListingsContext } from "@/context/favorite_listings.context";
import Link from "next/link";

const ListingCard = ({
  listing,
}: {
  listing: SearchListingItem;
}): JSX.Element => {
  const { listing: l, property } = listing;
  const favListingCtx = useContext(FavListingsContext);
  const listingPriority = listingPriorities.find(item => item.priority === listing.listing.priority);
  const images = property.media.filter((item) => item.type === "IMAGE");

  return (
    <Card className="relative hover:shadow-md cursor-pointer">
      <div className="absolute top-2 -left-2 z-[5]">
        {listingPriority && (
          <Badge className={clsx(
            "text-white",
            listingPriority.priority === 1 && "bg-slate-500",
            listingPriority.priority === 2 && "bg-cyan-200",
            listingPriority.priority === 3 && "bg-yellow-500",
            listingPriority.priority === 4 && "bg-red-500",
          )}>
            {listingPriority.label}
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="grid grid-cols-2 gap-2 lg:gap-4">
          <div className="relative aspect-video">
            <Image className="max-w-full rounded-md object-cover" fill src={images[0].url} alt="" />
          </div>
          <div className="grid grid-cols-2 gap-2 lg:gap-4">
            <div className="relative">
              {images[1] && (
                <Image className="max-w-full rounded-md object-cover" fill src={images[1].url} alt="" />
              )}
            </div>
            <div className="relative">
              {images[2] && (
                <Image className="max-w-full rounded-md object-cover" fill src={images[2].url} alt="" />
              )}
            </div>
            <div className="relative">
              {images[3] && (
                <Image className="max-w-full rounded-md object-cover" fill src={images[3].url} alt="" />
              )}
            </div>
            <div className="relative">
              {images[4] && (
                <Image className="max-w-full rounded-md object-cover" fill src={images[4].url} alt="" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link href={`/listings/${listing.listing.id}`}><h2 className="font-semibold uppercase">{listing.listing.title}</h2></Link>
        <div className="flex flex-row gap-2">
          <h3 className="text-red-600 font-semibold">{listing.listing.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} / tháng - {listing.property.area} m<sup>2</sup> -{" "}</h3>
          <h3>{listing.property.city}</h3>
        </div>
        <div className={styles.pcontainer}>
          <p className="font-light">{listing.listing.description.replace(/<[^>]*>?/gm, '')}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="flex flex-row gap-2">
          <Button type="button" variant="default" className="text-white">
            <FaPhone size={16} />
            <span className="ml-2">
              Liên hệ: <span className="font-semibold">0123456789</span>
            </span>
          </Button>
          {favListingCtx.favListings.find((item: string) => item === listing.listing.id)
            ? (<Button type="button" variant="outline" onClick={() => favListingCtx.removeFavListing(listing.listing.id)}><BsHeartFill size={16} /></Button>)
            : (<Button type="button" variant="outline" onClick={() => favListingCtx.addFavListing(listing.listing.id)}><BsHeart size={16} /></Button>)
          }
        </div>
      </CardFooter>
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
