"use client";

import { CardContent, CardHeader } from "@/components/ui/card";
import { ToMillion } from "@/utils/currency";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/css';
import 'swiper/css/navigation';

type ReducedListing = {
  id: string;
  coverImg: string;
  title: string;
  price: number;
  area: number;
  city: string;
  district: string;
  postedAt: Date;
}

function ListingCard({listing} : {listing: ReducedListing}) {
  return (
    <Link href={`listings/${listing.id}`}>
      <CardContent className="rounded-sm w-full p-0">
        <CardHeader className="block relative w-full p-0 aspect-video">
          <Image 
            src={listing.coverImg} 
            alt={listing.title}
            fill
            className="object-cover"/>
        </CardHeader>
        <CardContent className="p-3">
          <h3 className="truncate">{listing.title}</h3>
          <h4 className="text-red-600">{ToMillion(listing.price)}/tháng - {listing.area}m<sup>2</sup></h4>
          <h5 className="text-gray-500 space-x-2">
            <i className="fas fa-location-dot"/>
            <span>{listing.city}, {listing.district}</span>
          </h5>
        </CardContent>
      </CardContent>
    </Link>
  );
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
        spaceBetween={10}
        className="w-full h-full"
      >
        {listings.map((listing, index) => (
          <SwiperSlide key={index}>
            <ListingCard listing={listing}/>
          </SwiperSlide>  
        ))}
      </Swiper>
    </div>
  );
}
