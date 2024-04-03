import { backendAPI } from "@/libs/axios";
import { ManagedApplication } from "@/models/application";
import { Rental } from "@/models/rental";
import { Session } from "next-auth";

export async function createRental(data: ManagedApplication, sessionData: Session) : Promise<Rental> {
  const {application, property, unit} = data;
  return (await backendAPI.post("/api/rentals", {
    applicationId: application.id,
    tenantId: application.creatorId,
    profileImage: application.profileImage,
    propertyId: application.propertyId,
    unitId: application.unitId,
    tenantType: "INDIVIDUAL",
    tenantName: application.fullName,
    tenantPhone: application.phone,
    tenantEmail: application.email,
    landArea: property.area,
    unitArea: unit.area,
    moveinDate: new Date(application.moveinDate),
    rentalPeriod: application.preferredTerm,
    rentalPrice: application.offeredPrice,
    coaps: application.coaps,
  }, {
    headers: {
      Authorization: `Bearer ${sessionData.user.accessToken}`,
    },
  })).data;
}
