import { PropertyForm } from "@/app/manage/properties/new/page";
import { backendAPI } from "@/libs/axios";
import { uploadFile } from "../upload-file";

export async function createProperty({property, units} : PropertyForm) {
  console.log('createProperty', property, units);
  // hard code value in development, pass accessToken in production
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN as string;
  // deep copy objects
  const _property = JSON.parse(JSON.stringify(property));
  const _units = JSON.parse(JSON.stringify(units));
  // 1. Upload all images to remote storage
  for(const image of _property.media.filter((m: any) => m.type.startsWith('IMAGE'))) {
    const fileUrl = await uploadFile({
      name: image.name as string,
      size: image.size as number,
      type: image.type.toLowerCase(),
      url: image.url,
    }, ACCESS_TOKEN);
    image.url = fileUrl;
    image.type = 'IMAGE';
  }
  
  for(const unit of _units) {
    for(const image of unit.media) {
      const fileUrl = await uploadFile({
        name: image.name as string,
        size: image.size as number,
        type: image.type.toLowerCase(),
        url: image.url,
      }, ACCESS_TOKEN); 
      image.url = fileUrl;
      image.type = 'IMAGE';
    }
  }

  // prefetch images in development environment
  // _property.media = [
  //   {
  //     url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-35-34-1695660863015",
  //     type: "IMAGE",
  //     description: "image 1",
  //   },
  //   {
  //     url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
  //     type: "IMAGE",
  //     description: "image 2",
  //   },
  // ];

  // for(const unit of _units) {
  //   for(const media of unit.media) {
  //     if(media.type.startsWith('IMAGE')) {
  //       media.url = "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-35-34-1695660863015";
  //       media.type = 'IMAGE';
  //     }
  //   }
  // }

  // preprocess data
  for(const feature of _property.features) {
    feature.featureId = parseInt(feature.featureId);
  }
  for(const unit of _units) {
    for(const amenity of unit.amenities) {
      amenity.amenityId = parseInt(amenity.amenityId);
    }
  }

  console.log(_property, _units);
  
  // 2. Create a new property record
  console.log(backendAPI)
  const newProperty = (await backendAPI.post('/api/property/create', {
    ..._property,
  }, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`
    }
  })).data;
  console.log(newProperty)
  
  // 3. Create all units records
  for(const unit of _units) {
    const newUnit = (await backendAPI.post('/api/unit/create', {
      ...unit,
      propertyId: newProperty.id,
    }, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    })).data;
    console.log(newUnit)
  }
}
