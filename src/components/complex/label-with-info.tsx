import { FormLabel } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

export default function FormLabelWithInfo({
  label,
  info,
  required,
}: {
  label: string;
  info: React.ReactNode;
  required?: boolean;
}) {
  return (
    <FormLabel>
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
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
