import { FormLabel } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

export default function FormLabelWithInfo({
  label,
  info,
}: {
  label: string;
  info: React.ReactNode;
}) {
  return (
    <FormLabel>
      {label}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="ml-2">
            <i className="fas fa-circle-info"></i>
          </TooltipTrigger>
          <TooltipContent>
            {info}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </FormLabel>
  );
}
