import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { RentalComplaint, RentalComplaintReply } from "@/models/rental";
import { getUserAvatarFallback, getUserFullName } from "@/models/user";
import clsx from "clsx";
import { Check, Clock, PauseCircle } from "lucide-react";
import { useDataCtx } from "../../_context/data.context";
import CreateReply from "./create_reply";
import { useQuery } from "@tanstack/react-query";
import { backendAPI } from "@/libs/axios";
import Spinner from "@/components/ui/spinner";
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

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';
import { useMemo } from "react";
import toast from "react-hot-toast";

const mapItemStatus2BgColor = {
  PENDING: "bg-gray-400",
  RESOLVED: "bg-green-600",
  CLOSED: "bg-purple-400",
};

export default function ComplaintItem({
  item,
}: {
  item: RentalComplaint;
}) {
  const { users, isOnTheSameSide, sessionData } = useDataCtx();
  const isOnTheSameSideWithCreator = isOnTheSameSide(item.creatorId);

  const query = useQuery<RentalComplaintReply[]>({
    queryKey: ["manage", "rentals", "rental", item.rentalId, "complaints", item.id, "replies"],
    queryFn: async ({ queryKey }) => {
      const res = (await backendAPI.get<RentalComplaintReply[]>(`/api/rental-complaints/rental-complaint/${queryKey[5]}/replies`, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`
        }
      })).data;
      if (!res) {
        return [];
      }
      return res.map(r => ({
        ...r,
        createdAt: new Date(r.createdAt),
      }));
    },
    staleTime: 1000 * 30, // 30 seconds
    cacheTime: 1000 * 60, // 1 minute
  });

  // console.log("owner", owners, "managers", managers);
  async function handleUpdateStatus(status: "RESOLVED" | "CLOSED") {
    try {
      await backendAPI.patch(`/api/rental-complaints/rental-complaint/${item.id}?status=${status}`, undefined, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`
        }
      });
      toast.success("Cập nhật trạng thái phản hồi thành công");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái phản hồi");
    }
  }

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full min-h-[64px] flex items-center justify-between border">
          <div className="flex flex-row items-center p-2 gap-2">
            <Avatar>
              <AvatarFallback>{getUserAvatarFallback(users.find(u => u.id === item.creatorId)!)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 text-left">
              <h4 className="text-base font-semibold">
                {item.title}
              </h4>
              <p className="text-sm font-normal">
                {item.type === "REPORT" ? "Báo cáo" : "Đề nghị"}&nbsp; | &nbsp; Ngày tạo {item.createdAt.toLocaleDateString("vi-VN")}, bởi {getUserFullName(users.find(u => u.id === item.creatorId)!)}
              </p>
            </div>
          </div>
          <Badge className={clsx(
            "rounded-none space-x-2", mapItemStatus2BgColor[item.status as keyof typeof mapItemStatus2BgColor])}
          >
            {item.status === "PENDING" ? (
              <>
                <Clock className="w-4 h-4" />
                <span>Đang chờ</span>
              </>
            ) : item.status === "RESOLVED" ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã xử lý</span>
              </>
            ) : (
              <>
                <PauseCircle className="w-4 h-4" />
                <span>Đã đóng</span>
              </>
            )}
          </Badge>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 border">
        <div className="space-y-2 p-4">
          <p className="text-base font-normal">
            <strong>Mô tả tình trạng:&nbsp;</strong>{item.content}
          </p>
          {item.type === "REPORT" && (
            <p className="text-base font-normal">
              <strong>Thời điểm xảy ra:&nbsp;</strong>{item.occurredAt.toLocaleDateString("vi-VN")}&nbsp;{item.occurredAt.toLocaleTimeString("vi-VN")}
            </p>
          )}
          <p className="text-base font-normal">
            <strong>Đề nghị khắc phục:&nbsp;</strong>{item.suggestion || "N/A"}
          </p>
          <div className="text-base font-normal">
            <strong>Ảnh đính kèm:&nbsp;</strong>
            {item.media.length === 0
              ? "Không có ảnh"
              : (
                <LightGallery
                  // ref={lg}
                  speed={500}
                  mode="lg-fade"
                  plugins={[lgThumbnail, lgZoom]}
                  elementClassNames="flex flex-row flex-wrap justify-start gap-2"
                >
                  {item.media.map((media, index) => (
                    <a
                      key={index}
                      data-src={media}
                    >
                      <img
                        src={media}
                        alt={`media-${index}`}
                        className="w-24 h-16 object-cover rounded-md"
                      />
                    </a>
                  ))}
                </LightGallery>
              )}
          </div>
        </div>
        {(isOnTheSameSideWithCreator && item.status === 'PENDING') && (
          <div className="flex flex-row items-center justify-start">
            <AlertDialog>
              <AlertDialogTrigger className="flex flex-row items-center gap-1 p-2  hover:bg-green-600 hover:text-white">
                <Check className="w-4 h-4" />
                Đã xử lý
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Đối phương đã giải quyết ổn thỏa?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn đánh dấu là đã xử lý?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleUpdateStatus("RESOLVED")}>Đồng ý</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger className="flex flex-row items-center gap-1 p-2 hover:bg-purple-400 hover:text-white">
                <PauseCircle className="w-4 h-4" />
                Đóng
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Đóng phản hồi</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn đóng phản hồi này?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleUpdateStatus("CLOSED")}>Đồng ý</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        <Separator />
        <div className="px-2 py-3">
          {query.isLoading ? (
            <div className="w-full flex flex-row justify-center">
              <Spinner size={16} />
            </div>
          ) : query.isError ? (
            <p className="text-sm font-light text-center">Đã có lỗi xảy ra</p>
          ) : query.data.length === 0 ? (
            <p className="text-sm font-light text-center">Chưa có phản hồi</p>
          ) : (
            query.data.map((reply, index) => (
              <div className="flex flex-row items-center justify-start gap-3 px-4 py-3" key={index}>
                <Avatar>
                  <AvatarFallback>{getUserAvatarFallback(users.find(u => u.id === item.creatorId)!)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">
                    {getUserFullName(users.find(u => u.id === reply.replierId)!)}&nbsp;
                    <span className="text-xs font-light">
                      {reply.createdAt.toLocaleDateString("vi-VN")}, {reply.createdAt.toLocaleTimeString("vi-VN")}
                    </span>
                  </h4>
                  <p className="text-base font-normal">
                    {reply.reply}
                  </p>
                  {reply.media.length > 0 && (
                      <LightGallery
                        speed={500}
                        mode="lg-fade"
                        plugins={[lgThumbnail, lgZoom]}
                        elementClassNames="flex flex-row flex-wrap justify-start gap-2"
                      >
                        {reply.media.map((media, index) => (
                          <a
                            key={index}
                            data-src={media}
                          >
                            <img
                              src={media}
                              alt={`media-${index}`}
                              className="w-24 h-16 object-cover rounded-md"
                            />
                          </a>
                        ))}
                      </LightGallery>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
        {!["RESOLVED", "CLOSED"].includes(item.status) && (
          <CreateReply
            disabled={isOnTheSameSide(item.updatedBy)}
            item={item}
            refresh={query.refetch}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
