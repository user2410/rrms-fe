import { PropertyForm } from "@/app/manage/properties/new/page";
import { backendAPI } from "@/libs/axios";
import { uploadFile } from "../upload-file";

export async function CreateProperty({property, units} : PropertyForm, accessToken: string) {
  const _property = JSON.parse(JSON.stringify(property));
  const _units = JSON.parse(JSON.stringify(units));
  
  // 1. Upload all images
  for(const image of _property.media.filter((m: any) => m.type.startsWith('IMAGE'))) {
    const fileUrl = await uploadFile({
      name: image.name as string,
      size: image.size as number,
      type: image.type.toLowerCase(),
      url: image.url,
    });
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
      }); 
      image.url = fileUrl;
      image.type = 'IMAGE';
    }
  }

  // 2. Preprocess data
  for(const feature of _property.features) {
    feature.featureId = parseInt(feature.featureId);
  }
  const isMultiUnit = (["APARTMENT", "ROOM"].includes(property.type) && property.multiUnit) || property.type === "MINIAPARTMENT";
  var totalUnitArea = 0;
  for(const unit of _units) {
    if (isMultiUnit) {totalUnitArea += unit.area;}
    for(const amenity of unit.amenities) {
      amenity.amenityId = parseInt(amenity.amenityId);
    }
  }
  if(isMultiUnit) {
    _property.area = totalUnitArea / _units.length;
  }

  // 2. Create a new property record
  const newProperty = (await backendAPI.post('/api/properties', {
    ..._property,
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })).data;
  
  // 3. Create all units records
  for(const unit of _units) {
    const newUnit = (await backendAPI.post('/api/units', {
      ...unit,
      propertyId: newProperty.id,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })).data;
  }
}
