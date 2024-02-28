import { Button } from "@/components/ui/button";
import { IoMdHeartEmpty, IoMdShare, IoMdWarning } from "react-icons/io";
import { ListingDetail } from "../page";
import { ToMillion } from "@/utils/currency";

export default function GeneralInfo({
  listingDetail,
} : {
  listingDetail: ListingDetail
}) {
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
          <Button variant="ghost"><IoMdHeartEmpty size={24} /></Button>
          <Button variant="ghost"><IoMdShare size={24} /></Button>
          <Button variant="ghost"><IoMdWarning size={24} /></Button>
        </div>
      </div>
    </div>
  );
}
