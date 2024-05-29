import { Listing, listingPriorities } from "@/models/listing";
import { Rating, RatingStar } from "../ui/rating";
import { BookmarkCheck } from "lucide-react";
import { cn } from "@/libs/utils";
import Link from "next/link";

export function ListingTitle({ 
  listing,
  className,
}: { 
  listing: Listing,
  className?: string;
}) {
  const lp = listingPriorities.find(item => item.priority === listing.priority);

  return (
    <Link 
      href={`/listings/${listing.id}`}
      className="flex flex-row justify-between items-start"
    >
      <span className="space-x-1">
        {listing.priority > 1 && (
          <Rating>
            {Array.from({ length: listing.priority }, (_, i) => (<RatingStar key={i} variant="sm"/>))}
          </Rating>
        )}
        <h3 className={cn("inline", lp?.textColor, className)}>{listing.title}</h3>
      </span>
      {listing.priority === 4 && (
        <span>
          <BookmarkCheck className="text-orange-600 w-5 h-6"/>
        </span>
      )}
    </Link>
  );
}
