import { ListingFormValues } from "@/app/manage/listings/new/page";
import { backendAPI } from "@/libs/axios";

export default async function CreateListing(data: ListingFormValues) {
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN as string;
  console.log(ACCESS_TOKEN);
  const endpoint = "/api/listing/create";
  console.log(endpoint);
  const sendData = {
    ...data.listing,
    propertyID: data.propertyID,
    ...data.contact,
    ...data.config,
    priority: parseInt(data.config.priority),
    postAt: new Date(data.config.postAt).toISOString(),
    postDuration: parseInt(data.config.postDuration),
  };
  console.log(sendData);

  await backendAPI.post(endpoint, sendData, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`
    }
  });
}
