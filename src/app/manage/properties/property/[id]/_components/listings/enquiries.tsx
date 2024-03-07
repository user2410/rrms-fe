import { Listing } from "@/models/listing";
import { ChevronRightCircle } from "lucide-react";

export default function Enquiries({
  listings,
  accessToken,
} : {
  listings: Listing[];
  accessToken: string;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Câu hỏi</h3>
      {}
      <div className="space-y-2">
        <div className="p-4 border shadow-sm flex flex-row justify-between">
          <h2><strong>8</strong> mới</h2>
          <ChevronRightCircle className="w-6 h-6" />
        </div>
        <div className="p-4 border shadow-sm flex flex-row justify-between">
          <h2><strong>4</strong> chưa trả lời</h2>
          <ChevronRightCircle className="w-6 h-6" />
        </div>
        <div className="p-4 border shadow-sm flex flex-row justify-between">
          <h2><strong>13</strong> tất cả</h2>
          <ChevronRightCircle className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
