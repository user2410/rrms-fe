import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, ShieldEllipsis } from "lucide-react";
import CreateVerificationRequestModal from "./verification_request.modal";
import { useQuery } from "@tanstack/react-query";
import { PropertyVerificationRequest } from "@/models/property";
import { Session } from "next-auth";
import { backendAPI } from "@/libs/axios";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import VerificationRequestView from "@/components/complex/view_verification_request";

export default function VeificationStatus({
  propertyId,
  sessionData,
} : {
  propertyId: string;
  sessionData: Session;
}) {
  const query = useQuery<PropertyVerificationRequest | null>({
    queryKey: ['manage', 'properties', 'property', propertyId, 'verification', 'status', sessionData.user.accessToken],
    queryFn: async ({queryKey}) => {
      const rs = (await backendAPI.get<PropertyVerificationRequest[]>(`/api/properties/property/${propertyId}/verifications`,{
        params: {
          limit: 1,
          offset: 0,
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        },
      })).data || ([]);
      return rs.length > 0 ? rs[0] : null;
    },
    cacheTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return  query.isSuccess && (
    (!query.data  || query.data?.status === "REJECTED") ? (
      <div className="flex flex-row gap-2">
        <Badge className="bg-gray-400">
          <Shield className="w-4 h-4 inline"/>
          <span className="ml-1">Chưa xác minh</span>
        </Badge>
        <CreateVerificationRequestModal sessionData={sessionData} propertyId={propertyId} refresh={query.refetch}/>
      </div>
    ) : query.data.status === "APPROVED" ? (
      <div className="flex flex-row gap-2">
        <Badge className="bg-green-400">
          <ShieldCheck className="w-4 h-4 inline"/>
          <span className="ml-1">Đã xác minh</span>
        </Badge>
        <VerificationRequestViewModal request={query.data}/>
      </div>
    ) : (
      <div className="flex flex-row gap-2">
        <Badge className="bg-purple-400">
          <ShieldEllipsis className="w-4 h-4 inline"/>
          <span className="ml-1">Đang xác minh</span>
        </Badge>
        <VerificationRequestViewModal request={query.data}/>
      </div>
    ));
};

function VerificationRequestViewModal({
  request,
} : {
  request: PropertyVerificationRequest;
}) {
  return (
    <Dialog>
      <DialogTrigger className="text-sm hover:underline">Xem chi tiết</DialogTrigger>
      <DialogContent className="max-w-[40vw]">
        <DialogHeader>
          <DialogTitle>Chi tiết yêu cầu xác minh</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-2.5">
          <VerificationRequestView request={request}/>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
