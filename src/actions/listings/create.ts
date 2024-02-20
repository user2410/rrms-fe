import { ListingFormValues } from "@/app/manage/listings/new/page";
import { backendAPI } from "@/libs/axios";

export default async function CreateListing(data: ListingFormValues, accessToken: string) {
  const sendData = {
    ...data.listing,
    propertyID: data.propertyId,
    units: data.units,
    ...data.contact,
    ...data.config,
  };
  // if mulitple units are selected, the price is the average of all the units
  if(data.units.length > 1) {
    const unitsPrice = data.units.map(u => u.price);
    unitsPrice.sort();
    sendData.price = unitsPrice[unitsPrice.length >> 1];
  }
  console.log("sendData", sendData);

  await backendAPI.post("/api/listings", sendData, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}
