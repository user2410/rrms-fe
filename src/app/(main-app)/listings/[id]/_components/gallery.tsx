"use client";

import { PropertyMedia } from '@/models/property';
import clsx from 'clsx';
import LightGallery from 'lightgallery/react';
import { Fragment, useCallback, useRef } from 'react';
// @ts-ignore
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";

import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import 'swiper/css';
import 'swiper/css/navigation';

export default function Gallery({ items }: { items: PropertyMedia[] }) {
  let lightGalleryRef = useRef<any>(null);

  const onInit = useCallback((detail: any) => {
    if (detail) {
      lightGalleryRef.current = detail.instance;
    }
  }, []);

  return (
    <Fragment>
      <div>
        <LightGallery
          onInit={onInit}
          speed={500}
          mode="lg-fade"
          plugins={[lgThumbnail, lgZoom]}
          elementClassNames="hidden flex flex-col gap-2"
        >
          {items.map((item, index) => (
            <a
              key={index}
              className="m-1 max-w-[90px] max-h-[90px] aspect-video"
              data-src={item.url}
              data-sub-html={item.description}
            >
              <img
                className={clsx(
                  "object-contain max-w-full max-h-full",
                  item.type === 'IMAGE' ? "img-responsive" : "",
                )}
                src={item.url}
              />
            </a>
          ))}
        </LightGallery>
        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={10}
          navigation
          pagination={{
            clickable: true
          }}
          className="w-full h-full"
        >
          {items.map((item, index) => (
            <SwiperSlide
              key={index}
              className="bg-slate-200 !flex justify-center items-center aspect-video hover:cursor-pointer rounded-sm"
              onClick={() => {
                console.log("swiper slide clicked", index);
                lightGalleryRef.current?.openGallery(index);
              }}
            >
              <img
                src={item.url}
                alt="slide"
                className="object-contain max-w-full max-h-full"
              />
              {/* {`slide ${index}`} */}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Fragment>
  );
}

/* {items.map((item, index) => (
  <a
    key={index}
    href={item.url} // actual image url
  >
    <img
      src={item.url}
      alt="slide"
      className="object-contain max-w-full max-h-full"
    />
  </a>
))} */
