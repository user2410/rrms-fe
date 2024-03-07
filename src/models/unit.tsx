import { FaBed, FaCouch, FaInternetExplorer, FaQuestionCircle } from "react-icons/fa";
import { BiCloset, BiSolidFridge } from "react-icons/bi";
import { TbAirConditioning, TbWashDry1, TbStairsUp } from "react-icons/tb";
import { GiWashingMachine, GiHeatHaze } from "react-icons/gi";
import { PiTelevisionSimple } from "react-icons/pi";

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
  unitId: string;
  amenityId: string;
  description?: string;
}

export type Unit = {
  id: string;
  propertyId: string;
  name: string;
  area: number;
  floor: number;
  numberOfLivingRooms: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  numberOfToilets: number;
  numberOfBalconies: number;
  numberOfKitchens: number;
  type: UnitType;
  media: UnitMedia[];
  amenities: UnitAmenity[];
  createdAt: string;
  updatedAt: string;
};

export const mapUnitTypeToText = {
  ROOM: 'Phòng trọ thường',
  APARTMENT: 'Căn hộ',
  STUDIO: 'Phòng trọ Studio',
};

export const uAmenities = [
  { id: 1, amenity: "u-amenity_furniture", text: "Nội thất", icon: FaCouch },
  { id: 2, amenity: "u-amenity_fridge", text: "Tủ lạnh", icon: BiSolidFridge  },
  { id: 3, amenity: "u-amenity_air-cond", text: "Điều hòa", icon: TbAirConditioning },
  { id: 4, amenity: "u-amenity_washing-machine", text: "Máy giặt", icon: GiWashingMachine },
  { id: 5, amenity: "u-amenity_dishwasher", text: "Máy rửa bát", icon: TbWashDry1 },
  { id: 6, amenity: "u-amenity_water-heater", text: "Bình nóng lạnh", icon: GiHeatHaze },
  { id: 7, amenity: "u-amenity_tv", text: "TV", icon: PiTelevisionSimple },
  { id: 8, amenity: "u-amenity_internet", text: "Internet", icon: FaInternetExplorer },
  { id: 9, amenity: "u-amenity_wardrobe", text: "Tủ đồ", icon: BiCloset },
  { id: 10, amenity: "u-amenity_entresol", text: "Gác lửng", icon: TbStairsUp },
  { id: 11, amenity: "u-amenity_bed", text: "Giường", icon: FaBed },
  { id: 12, amenity: "u-amenity_other", text: "Khác", icon: FaQuestionCircle },
];
