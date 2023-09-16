import { FormLabel } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function FormLabelWithInfo({
  label,
  info,
}: {
  label: string;
  info: string;
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
            <p>{info}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </FormLabel>
  );
}