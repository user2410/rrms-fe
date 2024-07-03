import { backendAPI } from "@/libs/axios";
import { uploadFileWithPresignedURL } from "@/actions/upload-file";
import { ApplicationForm } from "../_components/main_form";

export default async function preUploadApplication(
  data: ApplicationForm,
  accessToken: string,
) {
  // copy data to avoid mutation
  const _data = JSON.parse(JSON.stringify(data));
  const pi = _data.ao.profileImage;
  const selectedUnit = _data.units.find((u: any) => u.unitId === data.unitId)!;

  const newPI = (await backendAPI.post("/api/rentals/create/_pre", {
    avatar: {
      name: pi.name as string,
      size: pi.size as number,
      type: pi.type!.toLowerCase(),
    }
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })).data;
  const newUrl = await uploadFileWithPresignedURL(pi, newPI.avatar.url);

  const sendData = {
    ..._data.ao,
    ..._data.yd,
    listingId: _data.listingId,
    propertyId: _data.propertyId,
    unitId: _data.unitId,
    listingPrice: selectedUnit.listingPrice,
    offeredPrice: selectedUnit.offeredPrice,
    profileImage: newUrl,
    k: _data.k,
    // employmentProofsOfIncome,
  };

  return sendData;
}
