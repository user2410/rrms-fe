import { PropertyForm } from "@/app/manage/properties/new/page";
import { uploadFile } from "../upload-file";

export default async function UploadImages(
  {property, units} : PropertyForm,
  accessToken: string,
) {
  for(const image of property.media.filter((m: any) => m.type.startsWith('IMAGE'))) {
    const fileUrl = await uploadFile({
      name: image.name as string,
      size: image.size as number,
      type: image.type.toLowerCase(),
      url: image.url,
    });
    image.url = fileUrl;
    image.type = 'IMAGE';
  }
  
  for(const unit of units) {
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
}
