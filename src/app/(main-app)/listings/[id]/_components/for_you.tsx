"use client";

import { PropertyMedia } from "@/models/property";
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import { ReducedListing } from "@/models/listing";
import ListingCard from "./listing_card";
import { useCallback, useRef } from "react";

import 'swiper/css';
import 'swiper/css/navigation';

type ListingCard = {
  title: string;
  price: number;
  area: number;
  city: string;
  district: string;
  ward: string;
  postedAt: Date;
  media: PropertyMedia[];
}

export default function ListingsForyou({listings} : {listings: ReducedListing[]}) {
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
    <div>
      <div className="flex justify-between">
        <h2 className="font-semibold text-xl mb-2">Bất động sản dành cho bạn</h2>
        <div className="flex flex-row gap-2">
          <span className="inline-block cursor-pointer py-2 prev-arrow w-1/2 h-full text-center border hover:border-none bg-accent" onClick={handlePrev}>Prev</span>
          <span className="inline-block cursor-pointer py-2 next-arrow w-1/2 h-full text-center border hover:border-none bg-accent" onClick={handleNext}>Next</span>
        </div>
      </div>
      <Swiper
        ref={sliderRef}
        modules={[Navigation]}
        slidesPerView={4}
        spaceBetween={20}
        className="w-full h-full"
      >
        {listings.map((listing, index) => (
          <SwiperSlide key={index} className="m-4">
            <ListingCard listing={listing}/>
          </SwiperSlide>  
        ))}
      </Swiper>
    </div>
  );
}
