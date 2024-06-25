import ZaloIcon from "@/assets/zalo_icon";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/libs/utils";
import { Listing } from "@/models/listing";
import { Link as LinkIcon, Share2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaFacebook } from "react-icons/fa";


export default function ShareModal({
  listing,
}: {
  listing: Listing;
}) {
  const url = `${window.location.host}/listings/${listing.id}`;

  return (
    <Popover>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" type="button">
                <Share2 className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chía sẻ tin đăng</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent>
        <Link
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(listing.title)}`} 
          target="_blank"
          className={cn(buttonVariants({variant: "ghost"}), "flex flex-row justify-start gap-2 w-full")}
        >
          <FaFacebook size={24} color="blue"/>
          <span>Facebook</span>
        </Link>
        <Button variant="ghost" type="button" className="flex flex-row justify-start gap-2 w-full">
          <ZaloIcon className="w-6 h-6" />
          <span>Zalo</span>
        </Button>
        <Button variant="ghost" type="button" 
          className="flex flex-row justify-start gap-2 w-full"
          onClick={() => {
            navigator.clipboard.writeText(url);
            toast.success("Đã sao chép liên kết");
          }}
        >
          <LinkIcon className="w-6 h-6"/>
          <span>Sao chép liên kết</span>
        </Button>
      </PopoverContent>
    </Popover>

  );
};
