import { Button } from "@/components/ui/button";
import { IoMdHeartEmpty, IoMdShare, IoMdWarning } from "react-icons/io";
import { ListingDetail } from "../page";
import { ToMillion } from "@/utils/currency";

export default function GeneralInfo({
  listingDetail,
} : {
  listingDetail: ListingDetail
}) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="grid gap-4 grid-cols-3">
          <div className="space-y-2">
            <h5 className="font-extralight">Mức giá</h5>
            <h4 className="font-semibold">{ToMillion(listingDetail.listing.price)}</h4>
            <h5 className="font-light">~{ToMillion(listingDetail.listing.price / listingDetail.property.area)}/m<sup>2</sup></h5>
          </div>
          <div className="space-y-2">
            <h5 className="font-extralight">Diện tích</h5>
            <h4 className="font-semibold">{listingDetail.property.area}</h4>
            <h5 className="font-light">{listingDetail.property.numberOfFloors} tầng</h5>
          </div>
          {listingDetail.property.building && (<div className="space-y-2">
            <h5 className="font-extralight">Toà nhà</h5>
            <h4 className="font-semibold">{listingDetail.property.building}</h4>  
          </div>)}
          {listingDetail.property.project && (<div className="space-y-2">
            <h5 className="font-extralight">Dự án</h5>
            <h4 className="font-semibold">{listingDetail.property.project}</h4>  
          </div>)}
        </div>
        <div className="flex gap-4">
          <Button variant="ghost"><IoMdHeartEmpty size={24} /></Button>
          <Button variant="ghost"><IoMdShare size={24} /></Button>
          <Button variant="ghost"><IoMdWarning size={24} /></Button>
        </div>
      </div>
    </div>
  );
}
