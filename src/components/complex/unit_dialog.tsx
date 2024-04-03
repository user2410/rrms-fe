import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { uAmenities, Unit } from "@/models/unit";
// import LightGallery from 'lightgallery/react';
import { MdBalcony, MdBathtub, MdBed } from "react-icons/md";

// import 'lightgallery/css/lg-thumbnail.css';
// import 'lightgallery/css/lg-zoom.css';
// import 'lightgallery/css/lightgallery.css';
// import lgThumbnail from 'lightgallery/plugins/thumbnail';
// import lgZoom from 'lightgallery/plugins/zoom';

export default function UnitDialog({ unit }: { unit: Unit }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="link">{unit.name}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{unit.name}</DialogTitle>
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium">Tiện nghi sẵn có</h3>
              <ul className="grid grid-cols-2 gap-1 w-full">
                {unit.amenities?.map((amenity, index) => {
                  const ua = uAmenities.find(u => u.id.toString() === amenity.amenityId.toString());
                  const Icon = ua?.icon;
                  return (
                    <li key={index} className="">
                      <span className="flex flex-row gap-2 items-center">{Icon && (<Icon size={16} />)} {ua?.text}</span>
                      <p className="text-xs font-light">{amenity.description}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* {(unit.media && unit.media?.length > 0) && (
              <div className="space-y-3">
                <h3 className="font-medium">Hình ảnh</h3>
                <LightGallery plugins={[lgZoom, lgThumbnail]} mode="lg-fade" elementClassNames="flex flex-row flex-wrap gap-2">
                  {unit.media.map((media, index) => (
                    <a
                      key={index}
                      className="gallery-item"
                      data-src={media.url}
                    >
                      <img
                        src={media.url}
                        alt={unit.name}
                        className="m-2 max-w-[100px] aspect-video object-contain"
                      />
                    </a>
                  ))}
                </LightGallery>
              </div>
            )} */}
            <div className="space-y-3">
              <h3 className="font-medium">Phòng ốc</h3>
              <div className="grid grid-cols-2 gap-1 w-full">
                {unit.numberOfBedrooms && (
                  <div className="border-y grid grid-cols-2">
                    <div className="flex items-center gap-1">
                      <MdBed size={24} />
                      <span>Phòng ngủ</span>
                    </div>
                    <div className="py-4">{unit.numberOfBedrooms}</div>
                  </div>
                )}
                {unit.numberOfBathrooms && (
                  <div className="border-y grid grid-cols-2">
                    <div className="flex items-center gap-1">
                      <MdBathtub size={24} />
                      <span>Phòng tắm</span>
                    </div>
                    <div className="py-4">{unit.numberOfBathrooms}</div>
                  </div>
                )}
                {unit.numberOfBalconies && (
                  <div className="border-y grid grid-cols-2">
                    <div className="flex items-center gap-1">
                      <MdBalcony size={24} />
                      <span>Ban công</span>
                    </div>
                    <div className="py-4">{unit.numberOfBalconies}</div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
