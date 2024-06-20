import { PropertyVerificationRequest } from "@/models/property";
import { Label } from "../ui/label";
import { getYoutubeVideoID } from "@/utils/youtube-video";
import { Separator } from "../ui/separator";

export default function VerificationRequestView({
  request,
}: {
  request: PropertyVerificationRequest;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label className="text-lg">Video nhà cho thuê</Label>
        <div className="flex flex-row justify-center">
          <iframe width="420" height="236" src={`https://www.youtube.com/embed/${getYoutubeVideoID(request.videoUrl)}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      </div>
      <Separator/>
      <div className="space-y-2">
        <Label className="text-lg">Giấy tờ pháp lý</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Label>Sổ hồng hoặc giấy tờ sở hữu nhà</Label>
            <a href={request.houseOwnershipCertificate} target="_blank" className="relative">
              <img src={request.houseOwnershipCertificate} alt="Sổ hồng hoặc giấy tờ sở hữu nhà" className="object-contain" />
            </a>
          </div>
          <div>
            <Label>Sổ đỏ hoặc giấy tờ quyền sử dụng đất</Label>
            <a href={request.certificateOfLanduseRight} target="_blank" className="relative">
              <img src={request.certificateOfLanduseRight} alt="Giấy tờ quyền sử dụng đất" className="object-contain" />
            </a>
          </div>
        </div>
      </div>
      <Separator/>
      <div className="space-y-2">
        <Label className="text-lg">Ảnh chụp 2 mặt của CMND/CCCD của chính chủ BĐS</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <a href={request.frontIdcard} target="_blank" className="relative">
            <img src={request.frontIdcard} alt="Mặt trước" className="object-contain" />
          </a>
          <a href={request.backIdcard} target="_blank" className="relative">
            <img src={request.backIdcard} alt="Mặt sau" className="object-contain" />
          </a>
        </div>
      </div>
      <Separator/>
      <div className="space-y-2">
        <Label className="text-lg">Thông tin bổ sung hoặc yêu cầu khác</Label>
        <div>{request.note || "N/A"}</div>
      </div>
    </div>
  );
};
