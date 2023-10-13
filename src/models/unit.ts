
export type UnitType = 'ROOM' | 'APARTMENT' | 'STUDIO';

export type UnitMedia = {
  url: string;
  propertyId: string;
  type: 'IMAGE' | 'VIDEO';
}

export type UAmenity = {
  id: number;
  amenity: string;
}

export type UnitAmenity = {
  unit_id: string;
  amenity_id: string;
  description?: string;
}

export default interface Unit {
  id: string;
  propertyId: string;
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
  createdAt: string;
  updatedAt: string;
}

export const mapUnitTypeToText = {
  ROOM: 'Phòng',
  APARTMENT: 'Căn hộ',
  STUDIO: 'Studio',
}

export const uAmenities = [
  { id: 1, amenity: "u-amenity_furniture", text: "Nội thất" },
  { id: 2, amenity: "u-amenity_fridge", text: "Tủ lạnh" },
  { id: 3, amenity: "u-amenity_air-cond", text: "Điều hòa" },
  { id: 4, amenity: "u-amenity_washing-machine", text: "Máy giặt" },
  { id: 5, amenity: "u-amenity_dishwasher", text: "Máy rửa bát" },
  { id: 6, amenity: "u-amenity_water-heater", text: "Bình nóng lạnh" },
  { id: 7, amenity: "u-amenity_tv", text: "TV" },
  { id: 8, amenity: "u-amenity_internet", text: "Internet" },
  { id: 9, amenity: "u-amenity_wardrobe", text: "Tủ đồ" },
  { id: 10, amenity: "u-amenity_entresol", text: "Gác lửng" },
  { id: 11, amenity: "u-amenity_bed", text: "Giường" },
  { id: 12, amenity: "u-amenity_other", text: "Khác" },
];
