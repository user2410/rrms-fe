import { PropertyForm } from '@/app/manage/properties/new/page';
import { useFormContext } from 'react-hook-form';

export default function SummaryMedia() {
  const form = useFormContext<PropertyForm>();
  const images = form.getValues("property.media").filter(item => item.type.startsWith("IMAGE"));
  const videos = form.getValues("property.media").filter(item => item.type.startsWith("VIDEO"));

  return (
    <div className="space-y-6 px-2">
      <div className="w-full">
        <div className="text-xl my-2">Hình ảnh</div>
        {/* Uploaded images gallery */}
        <div className="w-full flex flex-wrap gap-2">
          {images.map((media, index) => (
              <div key={index} className="w-40 h-24 flex justify-center">
                <img
                  src={media.url}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
          ))}
        </div>        
      </div>
      <div className="w-full">
        <div className="text-xl my-2">Video</div>
        {/* Youtube video gallery */}
        {videos.map((media, index) => (
          <div key={index}>{media.url}</div>
        ))}
      </div>
    </div>
  );
}
