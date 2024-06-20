import VerificationRequestView from "@/components/complex/view_verification_request";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PropertyVerificationRequest } from "@/models/property";

export default function RequestTab({
  request,
} : {
  request: PropertyVerificationRequest;
}) {
  return (
    <ScrollArea className="h-[70vh]">
      <VerificationRequestView request={request} />
    </ScrollArea>
  );
};
