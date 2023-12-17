"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

export const ShortenedPhoneBtn = ({ phone }: { phone: string }) => {
  const shortPhone = phone.slice(0, 4) + '...';
  const [text, setText] = useState(`${shortPhone} Hiện số`);

  const handleClick = () => {
    setText(phone);
    navigator.clipboard.writeText(phone);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="default" className="w-full" onClick={handleClick}>
            {text}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sao chép số điện thoại</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    
  );
}; 
