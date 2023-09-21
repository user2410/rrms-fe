export interface City {
  name: string;
  id: string;
}

export interface District {
  name: string;
  id: string;
  cityCode: string;
}

export interface Ward {
  name: string;
  id: string;
  districtId: string;
}
