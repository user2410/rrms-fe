import { Button } from "@/components/ui/button";
import { backendAPI } from "@/libs/axios";
import { ManagedApplication } from "@/models/application";
import { Rental } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createRental } from "../_action/create_rental";
import { useState } from "react";

export default function PostApplication({
  data,
  sessionData,
} : {
  data: ManagedApplication;
  sessionData: Session;
}) {
  const {application, property, unit} = data;
  const router = useRouter();

  const query = useQuery<Rental | null>({
    queryKey: ["manage", "rental", "applications", "application", data.application.id, "rental"],
    queryFn: async ({queryKey}) => {
      const res = await backendAPI.get<Rental>(`/api/applications/application/${queryKey.at(4)}/rental`, {
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
    staleTime: 1000 * 5,
  });

  function handleCreateRental() {
    router.push(`/manage/rentals/new/?applicationId=${application.id}&propertyId=${property.id}&unitId=${unit.id}`);
  }
  return query.isSuccess && (
    query.data ? (
      query.data.status === "PENDING" ? (
        <Button type="button" onClick={() => router.push(`/manage/rentals/new/?applicationId=${application.id}`)}>Tiếp tục tạo hồ sơ thuê nhà</Button>
      ) : query.data.status === "FINISHED" ?(
        <Button type="button" onClick={() => router.push(`/manage/rentals/new/?applicationId=${application.id}`)}>Quản lý thuê nhà</Button>
      ) : null
    ) : (
      <Button type="button" onClick={handleCreateRental}>Tạo hồ sơ quản lý thuê nhà</Button>
    )
  );
};
