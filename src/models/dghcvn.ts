export type City = {
  name: string;
  id: string;
}

export type District = {
  name: string;
  id: string;
  cityCode: string;
}

export type Ward = {
  name: string;
  id: string;
  districtId: string;
}

export type Location = {
  lat: number;
  lng: number;
}

export type Place = {
  location: Location;
  viewport?: {
    northeast: Location,
    southwest: Location,
  }
}
