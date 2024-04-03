import { backendAPI } from "@/libs/axios";
import { ManagedApplication, TransformApplicationsRESTResponse } from "@/models/application";

export default async function GetManagedApplications(accessToken: string) : Promise<ManagedApplication[]> {
  const applicationsQuery = await backendAPI.get("api/applications/to-me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    transformResponse: TransformApplicationsRESTResponse,
  });
  const applications = applicationsQuery.data;
  const managedApplications: ManagedApplication[] = [];
  for (const application of applications) {
    const propertyQuery = await backendAPI.get(
      `api/properties/property/${application.propertyId}`,
    );
    const listingQuery = await backendAPI.get(
      `api/listings/listing/${application.listingId}`,
    );
    const unitQuery = await backendAPI.get(`api/units/unit/${application.id}`, {
      params: {
        unitIds: application.unitIds.join(","),
        fields: "floor,number_of_bedrooms,area,amenities",
      },
    });
    managedApplications.push({
      application,
      property: propertyQuery.data,
      listing: listingQuery.data,
      unit: unitQuery.data,
    });
  }

  return managedApplications;
}
