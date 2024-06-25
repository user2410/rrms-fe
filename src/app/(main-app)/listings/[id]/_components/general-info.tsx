import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFavListings } from "@/context/favorite_listings.context";
import { cn } from "@/libs/utils";
import { ToMillion } from "@/utils/currency";
import { BookmarkCheck } from "lucide-react";
import { ListingDetail } from "../page";
import ReportModal from "./report_modal";
import ShareModal from "./share-modal";

export default function GeneralInfo({
  listingDetail,
}: {
  listingDetail: ListingDetail
}) {
  const { isFavoriteListing, toggleFavListing } = useFavListings();
  const { listing, property } = listingDetail;

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="grid gap-4 grid-cols-3">
          <div className="space-y-2">
            <h5 className="font-extralight">Giá thuê</h5>
            <h4 className="font-semibold">{ToMillion(listing.price)}/tháng</h4>
          </div>
          <div className="space-y-2">
            <h5 className="font-extralight">Diện tích</h5>
            <h4 className="font-semibold">{property.area} m<sup>2</sup></h4>
            {property.numberOfFloors && (<h5 className="font-light">{property.numberOfFloors} tầng</h5>)}
          </div>
          {property.building && (<div className="space-y-2">
            <h5 className="font-extralight">Toà nhà</h5>
            <h4 className="font-semibold">{property.building}</h4>
          </div>)}
          {property.project && (<div className="space-y-2">
            <h5 className="font-extralight">Dự án</h5>
            <h4 className="font-semibold">{property.project}</h4>
          </div>)}
        </div>
        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button type="button" variant={isFavoriteListing(listing.id) ? "default" : "ghost"} onClick={() => toggleFavListing(listing.id)}>
                  <BookmarkCheck className={cn(isFavoriteListing(listing.id) ? "text-white" : "text-primary")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFavoriteListing(listing.id) ? "Bỏ đánh dấu tin đăng" : "Đánh dấu tin đăng"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ShareModal listing={listing} />
          <ReportModal listingId={listing.id} />
        </div>
      </div>
    </div>
  );
}
