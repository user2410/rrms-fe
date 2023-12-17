"use client";

import { Property } from "@/models/property";
import Gallery from "./gallery";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

enum MediaState {
  MEDIA,
  MAP,
}

export default function Media({ property }: { property: Property }) {
  const [state, setState] = useState<MediaState>(MediaState.MEDIA);

  return (
    <div className="relative w-full">
      {state === MediaState.MEDIA ? (
        <Gallery items={property.media} />
      ) : (
        <GoogleMap
          center={{ lat: property.lat, lng: property.lng }}
          zoom={15}
        >
          <MarkerF
            position={{ lat: property.lat, lng: property.lng }}
          />
        </GoogleMap>
      )}
      <div className="absolute bottom-5 right-5">
        {state === MediaState.MEDIA ? (
          <Button variant="ghost" className="relative w-20 h-20" onClick={() => setState(MediaState.MAP)}>
            <Image src="/img/map-icon.png" alt="map icon" fill />
          </Button>
        ) : (
          <Button variant="ghost" className="w-20 h-20">
            <div className="bg-slate-400">Xem ảnh</div>
          </Button>
        )}
      </div>
    </div>
  );
}
