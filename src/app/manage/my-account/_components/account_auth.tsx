import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function AccountAuth({
  userId,
  currentEmail,
}: {
  userId: string;
  currentEmail: string;
}) {
  return (
    <div className="space-y-4">
      <h2>UserID: {userId}</h2>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Cập nhật email</Label>
          <Input defaultValue={currentEmail} disabled/>
        </div>
        <div className="space-y-2">
          <Label>Cập nhật password</Label>
          <Input
            type="password"
            defaultValue="**********"
            disabled
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex flex-row justify-between">
          <div>
            <h3>Đăng nhập gần đây</h3>
            <p>5 lần đăng nhập gần đây</p>
          </div>
          <Button variant="outline">Đăng xuất</Button>
        </div>

      </div>
    </div>
  );
}
