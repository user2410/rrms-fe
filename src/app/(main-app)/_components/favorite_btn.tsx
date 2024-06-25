"use client";

import Link from "next/link";
import { cn } from "@/libs/utils";
import { buttonVariants } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useFavListings } from "@/context/favorite_listings.context";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function FavoriteBtn() {
  const { favListings } = useFavListings();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link href="/favorites" className={cn(buttonVariants({ variant: "ghost" }), "relative")}>
            <Bookmark className="w-6 h-6" />
            <Badge variant="destructive" className="absolute top-0 right-0">
              {favListings.length}
            </Badge>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tin đăng đã Bookmark</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
