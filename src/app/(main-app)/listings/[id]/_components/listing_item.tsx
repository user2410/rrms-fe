import { ListingTitle } from "@/components/complex/listing";
import { Skeleton } from "@/components/ui/skeleton";
import { ManagedListing } from "@/models/listing";
import { getPrimaryImage, getPropertyFullAddress } from "@/models/property";
import { formatDistance } from 'date-fns';
import { vi as vilocale } from "date-fns/locale";
import Link from "next/link";

export default function ListingItem({
  item: { listing, property },
  className,
}: {
  item: ManagedListing;
  className?: string;
}) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <li className={`py-3 m-0 border-b border-solid flex flex-row items-center gap-2 ${className}`}>
        <div className="relative w-16 h-16 min-w-max min-h-max aspect-square">
          <img
            src={getPrimaryImage(property)}
            alt={listing.title}
            className="object-cover w-full h-full rounded-md"
          />
        </div>
        <div className="space-y-3 flex-grow">
          <ListingTitle listing={listing} verificationStatus={property.verificationStatus}/>
          <p className="text-xs text-slate-600">{getPropertyFullAddress(property)}</p>
          <div className="w-full flex flex-row items-end justify-between">
            <p className="text-sm font-semibold text-green-600">
              {listing.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}/tháng
            </p>
            <p className="text-sm text-gray-500">
              {formatDistance(new Date(listing.createdAt), new Date(), {
                addSuffix: true,
                locale: vilocale,
              })}
            </p>
          </div>
        </div>
      </li>
    </Link>
  );
}

export const ListingItemSkeleton = (
  <li className="py-3 m-0 border-b border-solid flex flex-row gap-2">
    <Skeleton className="relative w-16 h-16 min-w-max min-h-max aspect-square" />
    <div className="space-y-3 flex-grow">
      <Skeleton className="w-full h-6"/>
      <div className="w-full flex flex-row items-end justify-between">
        <Skeleton className="w-1/4 h-4"/>
        <Skeleton className="w-1/4 h-4"/>
      </div>
    </div>
  </li>
);
