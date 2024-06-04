import { backendAPI } from "@/libs/axios";
import { FormValues } from "../page";
import { uploadFileWithPresignedURL } from "@/actions/upload-file";

export default async function preUploadRental(
  data: FormValues,
  accessToken: string,
) {
  // copy data to avoid mutation
  const _data = JSON.parse(JSON.stringify(data));
  const pi = _data.tenant.profileImage;

  if (pi.name) {
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
    const newUrl = await uploadFileWithPresignedURL(pi, newPI.url);
    _data.tenant.profileImage = { ...pi, url: newUrl };
  }

  const submitData = {
    ..._data,

    ..._data.tenant,
    coaps: _data.tenant.tenantType === "FAMILY" ? _data.tenant.coaps : [],
    minors: _data.tenant.tenantType === "FAMILY" ? _data.tenant.minors : [],
    pets: (_data.tenant.tenantType === "INDIVIDUAL" || _data.tenant.tenantType === "FAMILY") ? _data.tenant.pets : [],

    ..._data.services,
    services: _data.services.services,
    
    ..._data.policies,
    policies: _data.policies.policies,

    profileImage: _data.tenant.profileImage.url,
  };
  if(submitData.noticePeriod === 0) {
    delete submitData.noticePeriod;
  }

  return submitData;
}
