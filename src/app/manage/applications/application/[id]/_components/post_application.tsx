import { Button } from "@/components/ui/button";
import { backendAPI } from "@/libs/axios";
import { ManagedApplication } from "@/models/application";
import { PreRental } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PostApplication({
  data,
  sessionData,
} : {
  data: ManagedApplication;
  sessionData: Session;
}) {
  const {application, property, units} = data;
  const router = useRouter();

  const query = useQuery<PreRental | null>({
    queryKey: ["manage", "rental", "applications", "application", data.application.id, "prerental"],
    queryFn: async ({queryKey}) => {
      const res = await backendAPI.get<PreRental>(`/api/prerentals/prerental/${queryKey.at(4)}`, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
        validateStatus: (status) => status === 200 || status === 404,
      });
      if (res.status === 404) {
        return null;
      }
      return res.data;
    },
  });

  async function handleCreatePreRental() {
    try {
      const unit = application.units[0];
      const res = await backendAPI.post("/api/prerentals", {
        applicationId: application.id,
        tenantId: application.creatorId,
        profileImage: application.profileImage,
        propertyId: application.propertyId,
        unitId: unit.unitId,
        tenantType: "INDIVIDUAL",
        tenantName: application.fullName,
        tenantDob: new Date(application.dob),
        tenantIdentity: application.identityNumber,
        tenantPhone: application.phone,
        tenantEmail: application.email,
        landArea: property.area,
        unitArea: units.find(u => u.id === unit.unitId)!.area,
        moveinDate: new Date(application.moveinDate),
        rentalPeriod: application.preferredTerm,
        rentalPrice: unit.offeredPrice,
        coaps: application.coaps,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      });
      toast.success("Hồ sơ quản lý thuê nhà đã được tạo");
      setTimeout(() => {
        router.push(`/manage/rentals/new/?id=${res.data.id}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi tạo hồ sơ quản lý thuê nhà");
    }
  }
  return query.isSuccess && (
    query.data ? (
      query.data.status === "PENDING" ? (
        <Button type="button" onClick={() => router.push(`/manage/rentals/new/?applicationId=${application.id}`)}>Tiếp tục tạo hồ sơ thuê nhà</Button>
      ) : query.data.status === "FINISHED" ?(
        <Button type="button" onClick={() => router.push(`/manage/rentals/new/?applicationId=${application.id}`)}>Quản lý thuê nhà</Button>
      ) : null
    ) : (
      <Button type="button" onClick={handleCreatePreRental}>Tạo hồ sơ quản lý thuê nhà</Button>
    )
  );
};
