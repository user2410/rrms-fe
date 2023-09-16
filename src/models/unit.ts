
export type UnitType = 'ROOM' | 'APARTMENT' | 'STUDIO';

export type UnitMedia = {
  url: string;
  property_id: string;
  type: 'IMAGE' | 'VIDEO';
}

export type UAmenity = {
  id: BigInt;
  amenity: string;
}

export type UnitAmenity = {
  unit_id: string;
  amenity_id: string;
  description?: string;
}

export default interface Unit {
  id: string;
  property_id: string;
  name: string;
  area: number;
  floor: number;
  number_of_living_rooms: number;
  number_of_bedrooms: number;
  number_of_bathrooms: number;
  number_of_toilets: number;
  number_of_balconies: number;
  number_of_kitchens: number;
  media: UnitMedia[];
  amenities: UnitAmenity[];
  created_at: string;
  updated_at: string;
}

export const mapUnitTypeToText = {
  ROOM: 'Phòng',
  APARTMENT: 'Căn hộ',
  STUDIO: 'Studio',
}

export const mapUAmenityToText = {
  "u-amenity_furniture": "Nội thất",
  "u-amenity_fridge": "Tủ lạnh",
  "u-amenity_air-cond": "Điều hòa",
  "u-amenity_washing-machine": "Máy giặt",
  "u-amenity_dishwasher": "Máy rửa bát",
  "u-amenity_water-heater": "Bình nóng lạnh",
  "u-amenity_tv": "TV",
  "u-amenity_internet": "Internet",
  "u-amenity_wardrobe": "Tủ đồ",
  "u-amenity_entresol": "Gác lửng",
  "u-amenity_bed": "Giường",
  "u-amenity_other": "Khác",
}

