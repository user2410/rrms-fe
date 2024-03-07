import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePropDataCtx } from "../_context/property_data.context";
import { Button } from "@/components/ui/button";

export default function Managers() {
  const { property } = usePropDataCtx();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Chủ nhà</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {property.managers.filter(m => m.role === "OWNER").map((m, i) => (
            <div key={i} className="w-full border shadow-sm py-3 px-2">
              <div className="flex flex-row items-center gap-2">
                <Avatar>
                  <AvatarImage src="/img/avatar_placeholder" />
                  <AvatarFallback>PC</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{m.managerId}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle>Người quản lý</CardTitle>
          <Button variant="outline">Thêm quản lý</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {property.managers.filter(m => m.role === "MANAGER").map((m, i) => (
            <div key={i} className="w-full border shadow-sm flex flex-row justify-between items-center py-3 px-2">
              <div className="flex flex-row items-center gap-2">
                <Avatar>
                  <AvatarImage src="/img/avatar_placeholder" />
                  <AvatarFallback>PC</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{m.managerId}</span>
              </div>
              <Badge>Quản lý</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};


