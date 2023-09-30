import { PropertyForm } from "@/app/manage/properties/new/page";
import { uAmenities } from "@/models/unit";
import { useCallback, useRef } from "react";
import { useFormContext } from "react-hook-form";

import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

function ImageSlider({media} : { media: { url: string }[] }) {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    (sliderRef.current as any).swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    (sliderRef.current as any).swiper.slideNext();
  }, []);

  return (
    <>
      <Swiper
        ref={sliderRef}
        modules={[Navigation]}
        slidesPerView={1}
      >
        {media.map((media, index) => (
          <SwiperSlide key={index}>
            <div key={index} className="w-40 h-24 flex justify-center">
              <img
                src={media.url}
                className="object-contain max-w-full max-h-full"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="w-full">
        <span className="inline-block cursor-pointer py-2 prev-arrow w-1/2 h-full text-center border hover:border-none bg-accent" onClick={handlePrev}>Prev</span>
        <span className="inline-block cursor-pointer py-2 next-arrow w-1/2 h-full text-center border hover:border-none bg-accent" onClick={handleNext}>Next</span>
      </div>
    </>
  );
}

export default function SummaryBlock() {
  const form = useFormContext<PropertyForm>();
  const units = form.getValues("units");

  return (
    <div className="px-2">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Tên phòng
            </th>
            <th scope="col" className="px-6 py-3">
              Diện tích (m<sup>2</sup>)
            </th>
            <th scope="col" className="px-6 py-3">
              Tầng
            </th>
            <th scope="col" className="px-6 py-3">
              Tiện nghi
            </th>
            <th scope="col" className="px-6 py-3">
              Ảnh chụp
            </th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit, index) => (
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {unit.name}
              </th>
              <td className="px-6 py-4">
                {unit.area}
              </td>
              <td className="px-6 py-4">
                {unit.floor || "N/A"}
              </td>
              <td className="px-6 py-4">
                {unit.amenities ? (
                  <ul className={unit.amenities.length > 1 ? "list-disc" : ""}>
                    {unit.amenities.map((amenity, index) => (
                      <li key={index}>
                        <span className="font-medium">
                          {uAmenities.find(a => a.id.toString() === amenity.amenityId)!.text}
                        </span>
                        {amenity.description ? (<span>{`: ${amenity.description}`}</span>) : null}
                      </li>
                    ))}
                  </ul>
                ) : "N/A"}
              </td>
              <td className="px-6 py-4">
                <div className="max-w-[160px]">
                  {/* <Swiper
                    modules={[Navigation]}
                    slidesPerView={1}
                    navigation={{
                      prevEl: ,
                      nextEl: ,
                    }}
                  >
                    {unit.media?.map((media, index) => (
                      <SwiperSlide key={index}>
                        <div key={index} className="w-40 h-24 flex justify-center">
                          <img
                            src={media.url}
                            className="object-contain max-w-full max-h-full"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper> */}
                  <ImageSlider media={unit.media || []} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
