import { backendAPI } from "@/libs/axios";
import { PropertyForm } from "../page";
import { uploadFileWithPresignedURL } from "@/actions/upload-file";

type Media = {
  id: number;
  name: string;
  size: number;
  type: string;
  url: string;
};

const updateMediaUrls = async (mediaList: Media[], updatedMedia: Media[]) => {
  const res : Media[] = [];
  for(const media of mediaList) {
    let um : Media | undefined = undefined;
    for(const img of updatedMedia) {
      if(img.id === media.id) {
        um = img;
        break;
      }
    }
    if (!!um) {
      const newUrl = await uploadFileWithPresignedURL(media, um.url);
      res.push({ ...media, url: newUrl, type: um.type.toUpperCase().startsWith("IMAGE") ? "IMAGE" : "VIDEO" });
    }
  }
  return res;
};

export default async function preUploadProperty(
  data: PropertyForm,
  accessToken: string,
) {
  // copy data to avoid mutation
  const _data = JSON.parse(JSON.stringify(data));
  const {property, units} = _data;
  
  // preprocess data
  for (const feature of property.features) {
    feature.featureId = parseInt(feature.featureId);
  }
  const isMultiUnit =
    (["APARTMENT", "ROOM"].includes(property.type) && units.length > 1) ||
    property.type === "MINIAPARTMENT";
  var totalUnitArea = 0;
  for (const unit of units) {
    if (isMultiUnit) {
      totalUnitArea += unit.area;
    }
    for (const amenity of unit.amenities) {
      amenity.amenityId = parseInt(amenity.amenityId);
    }
  }
  if (isMultiUnit) {
    property.area = totalUnitArea / units.length;
  }

  // upload images
  var id = 1;
  const propertyUploadImages = property.media
    .filter((media: any) => media.type.toUpperCase().startsWith("IMAGE")) // should be removed when uploading video is supported
    .map((media: any) => ({
      id: id++,
      name: media.name,
      size: media.size,
      type: media.type.toLowerCase(),
      url: media.url,
    }));

  const unitUploadImages = units.map((unit: any) => {
    if (!unit.media || unit.media.length === 0) {
      return [];
    }
    return unit.media
      .filter((media: any) => media.type.toUpperCase().startsWith("IMAGE")) // should be removed when uploading video is supported
      .map((media: any) => ({
        id: id++,
        name: media.name,
        size: media.size,
        type: media.type.toLowerCase(),
        url: media.url,
      }));
  });

  const propertyData = (await backendAPI.post(
    "/api/properties/create/_pre",
    {
      media: propertyUploadImages,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )).data;
  property.media = await updateMediaUrls(propertyUploadImages, propertyData.media);
  property.primaryImage = property.media[property.primaryImage].url;

  const unitMedia = (await backendAPI.post(
    "/api/units/create/_pre",
    {
      media: unitUploadImages.flat(),
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  ));
  for (let i = 0; i < unitUploadImages.length; i++) {
    console.log("unitMedia", unitUploadImages[i]);
    if (!unitUploadImages[i]) {
      continue;
    }
    units[i].media = await updateMediaUrls(unitUploadImages[i], unitMedia.data.media);
  }

  return {property, units} as PropertyForm;
}
