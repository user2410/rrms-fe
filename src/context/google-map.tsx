"use client";

import { useLoadScript } from '@react-google-maps/api';
import { PropsWithChildren } from 'react';

const option = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  libraries: [],
};

export default function GoogleMapContext({ children }: PropsWithChildren<{}>) {
  const { isLoaded, loadError } = useLoadScript(option);

  if(!isLoaded) {
    return null;
  }

  if(loadError) {
    throw loadError;
  }

  return children;
}
