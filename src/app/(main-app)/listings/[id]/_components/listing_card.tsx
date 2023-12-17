import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToMillion } from "@/utils/currency";
import Link from "next/link";

type ReducedListing = {
  id: string;
  coverImg: string;
  title: string;
  price: number;
  area: number;
  city: string;
  district: string;
  postedAt: Date;
}

export default function ListingCard({listing} : {listing: ReducedListing}) {
  return (
    <Link href={`listings/${listing.id}`}>
      <Card className="rounded-sm w-[270px] p-0">
        <CardHeader className="block p-0">
          <img src={listing.coverImg} alt={listing.title} className="object-cover max-w-[270px]"/>
        </CardHeader>
        <CardContent className="p-3">
          <h3 className="truncate">{listing.title}</h3>
          <h4 className="text-red-600">{ToMillion(listing.price)}/tháng - {listing.area}m<sup>2</sup></h4>
          <h5 className="text-gray-500 space-x-2">
            <i className="fas fa-location-dot"/>
            <span>{listing.city}, {listing.district}</span>
          </h5>
        </CardContent>
      </Card>
    </Link>
  );
}
