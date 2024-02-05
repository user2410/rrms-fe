import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import wait from "@/utils/wait-fn";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

type STATE = "IDLE" | "SENT" | "ERROR";
export default function ForgetPasswordModal() {
  const [state, setState] = useState<STATE>("IDLE");
  const [email, setEmail] = useState<string>("");

  async function handleSend() {
    try {
      // await axios.post("/api/auth/forgot-password", { email });
      await wait(1500);
      setState("SENT");
    } catch (err) {
      console.error(err);
      // toast.error(err.message);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="link" className="text-slate-500">Quên mật khẩu</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quên mật khẩu</DialogTitle>
          {state === "IDLE" && (
            <DialogDescription>
              Vui lòng nhập email của bạn để lấy lại mật khẩu
            </DialogDescription>
          )}
        </DialogHeader>
        {state === "IDLE" ? (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
        ) : state === "SENT" ? (
          <div className="w-full flex flex-col justify-center items-center gap-2">
            <FaCheckCircle size={32} color="green"/>
            <span className="text-center">Một email đã được gửi đến hòm thư của bạn. Vui lòng kiểm tra hòm thư để lấy lại mật khẩu.</span>
          </div>
        ) : null}
        {state === "IDLE" && (
          <DialogFooter>
            <Button type="submit" onClick={handleSend}>Gửi</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
