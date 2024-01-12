import { ApplicationForm } from "@/app/(main-app)/application/[listingId]/_components/main_form";
import { backendAPI } from "@/libs/axios";
import { uploadFile } from "../upload-file";

export default async function CreateApplication(data: ApplicationForm, accessToken: string) {
  // Upload profile image
  const profileImage = await uploadFile({
    name: data.ao.profileImage.name as string,
    size: data.ao.profileImage.size as number,
    type: data.ao.profileImage.type.toLowerCase(),
    url: data.ao.profileImage.url,
  }, accessToken);
  // const profileImage = "https://rrms-image.s3.ap-southeast-1.amazonaws.com/a2712956-2cbd-4c75-a57f-9d1d33a7fdcc/Mona_Lisa-restored-1704085941179";

  // Upload proofs of income
  var employmentProofsOfIncome = [];
  for(const image of data.yd.employmentProofsOfIncome) {
    const fileUrl = await uploadFile({
      name: image.name as string,
      size: image.size as number,
      type: image.type.toLowerCase(),
      url: image.url,
    }, accessToken);
    employmentProofsOfIncome.push(fileUrl);
  }
  // const employmentProofsOfIncome = ["https://rrms-image.s3.ap-southeast-1.amazonaws.com/a2712956-2cbd-4c75-a57f-9d1d33a7fdcc/Basic-1704085942064"];

  const sendData = {
    ...data.ao,
    ...data.yd,
    listingId: data.listingId,
    propertyId: data.propertyId,
    unitIds: data.unitIds,
    profileImage,
    employmentProofsOfIncome,
  };
  
  await backendAPI.post("/api/applications", sendData, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};
