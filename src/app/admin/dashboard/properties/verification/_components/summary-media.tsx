import LightGallery from 'lightgallery/react';
import { useFormContext } from 'react-hook-form';

import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { Property } from '@/models/property';

export default function SummaryMedia({
  property,
} : {
  property: Property;
}) {
  const images = property.media.filter(item => item.type.startsWith("IMAGE"));
  const videos = property.media.filter(item => item.type.startsWith("VIDEO"));
  
  return (
    <div className="space-y-6 px-2">
      <div className="w-full">
        <div className="text-xl my-2">Hình ảnh</div>
        {/* Uploaded images gallery */}
        <div className="w-full">
          <LightGallery plugins={[lgZoom, lgThumbnail]} mode="lg-fade" elementClassNames="flex flex-row flex-wrap gap-2">
            {images.map((media, index) => (
              <a
                key={index}
                className="gallery-item"
                data-src={media.url}
                data-sub-html={media.description && `<h4>${media.description}</h4>`}
              >
                <img
                  src={media.url}
                  alt={media.description}
                  className="m-2 max-w-[320px] aspect-video object-contain"
                />
              </a>
            ))}
          </LightGallery>
        </div>
      </div>
      <div className="w-full">
        <div className="text-xl my-2">Video</div>
        {/* Youtube video gallery */}
        {videos.map((media, index) => (
          // <iframe key={index} width="720" height="540" src={media.url} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
          <a key={index} href={media.url} target="_blank" rel="noreferrer" className="text-blue-500 underline">{media.url}</a>
        ))}
      </div>
    </div>
  );
}
