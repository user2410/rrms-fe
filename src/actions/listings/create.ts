import { ListingFormValues } from "@/app/manage/listings/new/page";
import { backendAPI } from "@/libs/axios";

export default async function CreateListing(data: ListingFormValues, accessToken: string) {
  const sendData = {
    ...data.listing,
    propertyID: data.propertyID,
    ...data.contact,
    ...data.config,
    priority: parseInt(data.config.priority),
    postAt: new Date(data.config.postAt).toISOString(),
    postDuration: parseInt(data.config.postDuration),
  };

  await backendAPI.post("/api/listings", sendData, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}
