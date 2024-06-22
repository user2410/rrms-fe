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
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import { backendAPI } from "@/libs/axios";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function RequestReviewModal({
  id,
  key,
  sessionData,
}: {
  id: number;
  key?: string;
  sessionData?: Session;
}) {
  const [feedback, setFeedback] = useState("");

  async function sendRequest() {
    try {
      await backendAPI.patch(`/api/prerentals/prerental/${id}/state${key ? `?key=${key}` : ""}`, {
        feedback,
        state: "REVIEW",
      }, {
        headers: {
          Authorization: sessionData ? `Bearer ${sessionData.user.accessToken}` : undefined,
        },
      });
      toast.success("Yêu cầu đã được gửi");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi gửi yêu cầu");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline">Yêu cầu xem xét lại</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có điều gì chưa hài lòng về profile này?</AlertDialogTitle>
          <AlertDialogDescription>
            Hãy góp ý cho chủ nhà biết để xem xét lại thông tin trong profile này.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          className="w-full"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={sendRequest}>Gửi yêu cầu</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ActionModal({
  state,
  id,
  key,
  sessionData,
}: {
  state: "APPROVED" | "REJECTED";
  id: number;
  key?: string;
  sessionData?: Session;
}) {
  const router = useRouter();

  async function handleAction() {
    try {
      const res = (await backendAPI.patch(`/api/prerentals/prerental/${id}/state${key ? `?key=${key}` : ""}`, {
        state,
      }, {
        headers: {
          Authorization: sessionData ? `Bearer ${sessionData.user.accessToken}` : undefined,
        },
      })).data;
      toast.success("Yêu cầu đã được gửi");
      if (state === "APPROVED" && sessionData) {
        router.push(`/manage/rentals/rental/${res.id}`);
        return;
      }
      router.replace("/");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi gửi yêu cầu");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {state === "APPROVED" ? (
          <Button type="button">Chấp thuận</Button>
        ) : (
          <Button type="button" variant="destructive">Từ chối</Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {state === "APPROVED" ? "Chấp thuận" : "Từ chối"} profile thuê nhà này ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn đã xem xét kĩ profile và đã quyết định {state === "APPROVED" ? "chấp thuận" : "từ chối"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAction}
            className={state === "APPROVED" ? buttonVariants({ variant: "default" }) : buttonVariants({ variant: "destructive" })}
          >
            {state === "APPROVED" ? "Chấp thuận" : "Từ chối"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}