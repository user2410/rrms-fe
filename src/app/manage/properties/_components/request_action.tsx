import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { backendAPI } from "@/libs/axios";
import { NewPropertyManagerRequest } from "@/models/property";
import { Session } from "next-auth";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { BiDotsHorizontal } from "react-icons/bi";

export default function RequestAction({
  request,
  sessionData,
  refetch,
}: {
  request: NewPropertyManagerRequest;
  sessionData: Session;
  refetch: () => void;
}) {
  const [currentAction, setCurrentAction] = useState<"approve" | "reject" | null>(null);
  const closeDialogBtnRef = useRef<HTMLButtonElement>(null);

  async function handleAction(approved: boolean) {
    try {
      await backendAPI.patch(`/api/properties/property/${request.propertyId}/new-manager-requests/${request.id}`, undefined, {
        headers: {
          Authorization: `Bearer ${sessionData!.user.accessToken}`,
        },
        params: {
          approved,
        },
      });
      toast.success("Cập nhật thành công");
      closeDialogBtnRef.current?.click();
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Đã có lỗi xảy ra");
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button hidden ref={closeDialogBtnRef}/>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn muốn tiếp tục?</DialogTitle>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Hủy</Button>
              </DialogClose>
              <Button type="submit" onClick={() => handleAction(currentAction === "approve")}>Đồng ý</Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <BiDotsHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => {
            setCurrentAction("approve");
            closeDialogBtnRef.current?.click();
          }}>Chấp thuận</DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setCurrentAction("reject");
            closeDialogBtnRef.current?.click();
          }}>Từ chối</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
