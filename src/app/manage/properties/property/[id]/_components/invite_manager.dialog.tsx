import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useRef, useState } from "react";
import { usePropDataCtx } from "../_context/property_data.context";
import { User } from "@/models/user";
import { backendAPI } from "@/libs/axios";
import toast from "react-hot-toast";

export default function InviteManagerDialog({
  users,
} : {
  users: User[],
}) {
  const {property, sessionData} = usePropDataCtx();

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [email, setEmail] = useState<string>("");
  const disabled = useMemo(() => property.managers.some(m => (
    users.find(u => u.email === email)?.email === email
  )), [email, users, property.managers]);
  
  async function handleSubmit() {
    try {
      await backendAPI.post(`/api/properties/property/${property.id}/new-manager-requests`, {
        email,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        }
      });
      closeBtnRef.current?.click();
      toast.success("Yêu cầu đã được gửi");
    } catch(err) {
      console.error(err);
      toast.error("Đã có lỗi xảy ra");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Mời thêm quản lý</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mời thêm quản lý</DialogTitle>
          <DialogDescription>
            Bạn có thể mời thêm người quản lý để quản lý nhà cho thuê này
          </DialogDescription>
        </DialogHeader>
        <div className="grid flex-1 gap-2">
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {disabled && (
          <p className="text-red-500 text-sm">
            Email này đã được mời quản lý
          </p>
        )}
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button ref={closeBtnRef} type="button" variant="secondary">
              Hủy
            </Button>
          </DialogClose>
          <Button 
            type="submit" 
            disabled={disabled}
            onClick={handleSubmit}
          >
            Gửi yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
