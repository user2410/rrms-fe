import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { Session } from "next-auth";
import { useState } from "react";
import toast from "react-hot-toast";

export function ApproveAction({
  requestId,
  property,
  sessionData,
  onClose,
} : {
  requestId: number;
  property: Property;
  sessionData: Session;
  onClose: () => void;
}) {
  async function handleApprove() {
    try {
      await backendAPI.patch(`api/properties/verifications/${requestId}`, {
        status: "APPROVED",
      }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      });
      toast.success("Đã xác minh nhà cho thuê");
    } catch(err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi xác minh nhà cho thuê");
    }
    // await backendAPI.post(`api/properties/verifications/${requestId}/approve`);
    onClose();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button">Xác minh</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác minh nhà cho thuê {property.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xác minh nhà cho thuê này?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleApprove}>Chấp thuận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function RejectAction({
  requestId,
  property,
  sessionData,
  onClose,
} : {
  requestId: number;
  property: Property;
  sessionData: Session;
  onClose: () => void;
}) {
  const [feedback, setFeedback] = useState("");

  async function handleReject() {
    try {
      await backendAPI.patch(`api/properties/verifications/${requestId}`, {
        status: "REJECTED",
        feedback,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      });
      toast.success("Đã từ chối xác minh nhà cho thuê");
    } catch(err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi xác minh nhà cho thuê");
    }
    onClose();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive">Từ chối</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Từ chối xác minh nhà cho thuê {property.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            Hãy cho chủ nhà biết lý do bị từ chối
          </AlertDialogDescription>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Lý do từ chối"
            className="mt-4"
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleReject}>Từ chối</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}