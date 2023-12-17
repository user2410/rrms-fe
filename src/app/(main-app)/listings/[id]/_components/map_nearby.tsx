"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Place } from "@/models/dghcvn";
import { Property } from "@/models/property";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import axios from "axios";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

const interests = [
  {type: 'bus_station', text: 'Trạm xe buýt'},
  {type: 'restaurant', text: 'Nhà hàng'},
  {type: 'pharmacy', text: 'Nhà thuốc'},
  {type: 'school', text: 'Trường học'},
  {type: 'groceries', text: 'Cửa hàng tạp hóa'},
  {type: 'gym', text: 'Gym'},
  {type: 'hospital', text: 'Bệnh viện'},
  {type: 'bank', text: 'Ngân hàng'},
  {type: 'park', text: 'Công viên'},
  {type: 'parking', text: 'Bãi đỗ xe'},
];

/**
 * Map interest type to place
 */
type MapPlaces = {
  [key: string]: Place;
}

export default function MapNNearby({ property }: { property: Property }) {
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  // const nearbyPlaces = useMemo(() => {
  //   (async () => {
  //     for (const i of selectedInterests) {
  //       const interest = interests[i];
  //       // fetch nearby places
  //       const res = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
  //         params: {
  //           location: `${property.lat},${property.lng}`,
  //           radius: 5000,
  //           type: interest.type,
  //           key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  //         },
  //       });

  //     }
  //   })();
  // }, [selectedInterests]);

  const handleSelect = (i : number) => {
    if (selectedInterests.includes(i)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== i));
    } else {
      setSelectedInterests([...selectedInterests, i]);
    }
  };

  // fetch nearby places

  useEffect(() => {
    
  }, [selectedInterests]);

  return (
    <div>
      <h2 className="font-semibold text-xl mb-2">Vị trí và xung quanh</h2>
      <GoogleMap
        mapContainerStyle={{ height: "400px" }}
        center={{ lat: property.lat, lng: property.lng }}
        zoom={15}
      >
        <MarkerF
          position={{ lat: property.lat, lng: property.lng }}
        />
        {selectedInterests.map((si) => {
          const interest = interests[si];
          return (
            <MarkerF
              key={si}
              position={{ lat: property.lat + 0.001, lng: property.lng + 0.001 }}
              />
          );
        })}
      </GoogleMap>
      <ScrollArea className="p-4 w-[880px] whitespace-nowrap rounded-md border">
        <div className="flex w-full space-x-4">
          {interests.map((interest, index) => (
            <Badge 
              key={index} 
              className={clsx(
                "hover:cursor-pointer",
                selectedInterests.includes(index) ? 'bg-white text-primary' : 'bg-primary text-white',
              ) }
              onClick={() => handleSelect(index)}
            >
              {interest.text}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal"/>
      </ScrollArea>
    </div>
  );
}
