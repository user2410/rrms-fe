import { cn } from "@/libs/utils";
import { Inbox } from "lucide-react";

export default function Empty({
  className,
  descNode,
} : {
  className?: string;
  descNode?: React.ReactNode;
}) {
  return (
    <div className={cn("w-full flex flex-col items-center justify-center gap-4 text-slate-400", className)}>
      <Inbox className="w-10 h-10"/>
      {descNode || (
        <p className="text-sm">Không có phần tử nào</p>
      )}
    </div>
  );
};
