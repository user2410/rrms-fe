import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ListingPriority } from "@/models/listing";
import clsx from "clsx";
import Image from "next/image";
import { BsHeart } from "react-icons/bs";
import { FaPhone } from "react-icons/fa";

const ListingCard = ({
  listing,
}: {
  listing: {
    ltitle: string;
    lprice: number;
    ldescription: string;
    lpriority: number;
    parea: number;
    paddress: string;
    pmedia: {
      description: string;
      type: string;
      url: string;
    }[];
    pcity: string;
    pdistrict: string;
    pward: string;
  };
}): JSX.Element => {
  const listingPriority = ListingPriority.find(item => item.priority === listing.lpriority.toString());

  return (
    <Card className="relative hover:shadow-md cursor-pointer">
      <div className="absolute top-2 -left-2 z-10">
        {listingPriority && (
          <Badge className={clsx(
            "text-white",
            listingPriority.priority === "1" && "bg-slate-500",
            listingPriority.priority === "2" && "bg-cyan-200",
            listingPriority.priority === "3" && "bg-yellow-500",
            listingPriority.priority === "4" && "bg-red-500",
          )}>
            {listingPriority.label}
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="grid grid-cols-2 gap-2 lg:gap-4">
          <div className="relative aspect-video">
            <Image className="max-w-full rounded-md object-cover" fill src={listing.pmedia[0].url} alt="" />
          </div>
          <div className="grid grid-cols-2 gap-2 lg:gap-4">
            <div className="relative">
              <Image className="max-w-full rounded-md object-cover" fill src={listing.pmedia[1].url} alt="" />
            </div>
            <div className="relative">
              <Image className="max-w-full rounded-md object-cover" fill src={listing.pmedia[2].url} alt="" />
            </div>
            <div className="relative">
              <Image className="max-w-full rounded-md object-cover" fill src={listing.pmedia[3].url} alt="" />
            </div>
            <div className="relative">
              <Image className="max-w-full rounded-md object-cover" fill src={listing.pmedia[4].url} alt="" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <h2 className="font-semibold uppercase">{listing.ltitle}</h2>
        <div className="flex flex-row gap-2">
          <h3 className="text-red-600 font-semibold">{listing.lprice} / tháng - {listing.parea} m<sup>2</sup> -{" "}</h3>
          <h3>{listing.pcity}</h3>
        </div>
        <p className="font-normal">{listing.ldescription}</p>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="flex">

        </div>
        <div className="flex flex-row gap-2">
          <Button type="button" variant="default" className="text-white">
            <FaPhone size={16} />
            <span className="ml-2">
              Liên hệ: <span className="font-semibold">0123456789</span>
            </span>
          </Button>
          <Button type="button" variant="outline">
            <BsHeart size={16} />
            {/* <BsHeartFill size={16} /> */}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
