export type PropertyType = 
  'APARTMENT' |
  'PRIVATE' | 'TOWNHOUSE' | 'SHOPHOUSE' | 'VILLA' |
  'ROOM' | 'STORE' |
  'OFFICE' |
  'BLOCK' |
  'COMPLEX'; // Quỹ căn hộ / biệt thự

export type PropertyMedia = {
  url: string;
  property_id: string;
  type: 'IMAGE' | 'VIDEO';
};

export type PFeature = {
  id: BigInt;
  feature: string;
}

export type PropertyFeature = {
  property_id: string;
  feature_id: BigInt;
  description?: string;
};

export type PropertyTag = {
  id: BigInt;
  property_id: string;
  tag: string;
}

export default interface Property {
  id: string;
  name?: string;
  area: number;
  number_of_floors: number;
  year_built?: number;
  orientation?: string;
  full_address: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  type: PropertyType;
  media: PropertyMedia[];
  features: PropertyFeature[];
  tags: PropertyTag[];
  created_at: Date;
  updated_at: Date;
}

export const mapPropertyTypeToText = {
  APARTMENT: 'Căn hộ',
  PRIVATE: 'Nhà riêng',
  TOWNHOUSE: 'Nhà mặt phố',
  SHOPHOUSE: 'Shophouse, nhà phố thương mại',
  VILLA: 'Biệt thự',
  ROOM: 'Phòng trọ',
  OFFICE: 'Văn phòng',
  STORE: 'Cửa hàng',
  BLOCK: 'Dãy phòng trọ',
}

export const pFeatures: PFeature[] = [
  {id: BigInt(0), feature: "p-feature_security"},
  {id: BigInt(1), feature: "p-feature_fire-alarm"},
  {id: BigInt(2), feature: "p-feature_gym"},
  {id: BigInt(3), feature: "p-feature_fitness-center"},
  {id: BigInt(4), feature: "p-feature_swimming-pool"},
  {id: BigInt(5), feature: "p-feature_community-rooms"},
  {id: BigInt(6), feature: "p-feature_public-library"},
  {id: BigInt(7), feature: "p-feature_parking"},
  {id: BigInt(8), feature: "p-feature_outdoor-common-area"},
  {id: BigInt(9), feature: "p-feature_services"},
  {id: BigInt(10), feature: "p-feature_facilities"},
  {id: BigInt(11), feature: "p-feature_others"},
];

export const mapPFeatureToText = {
  "p-feature_security": "An ninh",
  "p-feature_fire-alarm": "Hệ thống báo cháy",
  "p-feature_gym": "Phòng tập gym",
  "p-feature_fitness-center": "Trung tâm thể dục",
  "p-feature_swimming-pool": "Hồ bơi",
  "p-feature_community-rooms": "Phòng cộng đồng",
  "p-feature_public-library": "Thư viện công cộng",
  "p-feature_parking": "Bãi đỗ xe",
  "p-feature_outdoor-common-area": "Khu vực công cộng ngoài trời",
  "p-feature_services": "Dịch vụ",
  "p-feature_facilities": "Tiện nghi",
  "p-feature_others": "Khác",
}

export const mockupProperties: Property[] = [
  {
    id: '1',
    name: 'Property 1',
    area: 100,
    number_of_floors: 10,
    year_built: 2020,
    orientation: 'Đông Nam',
    full_address: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.674,
    type: 'APARTMENT',
    media: [
      {
        property_id: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "1",
        feature_id: BigInt(1),
      },
      {
        property_id: "1",
        feature_id: BigInt(3),
      },
      {
        property_id: "1",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(1),
        property_id: "1",
        tag: "Biệt thự liền kề",
      },
      {
        id: BigInt(2),
        property_id: "1",
        tag: "Mặt phố",
      },
    ],
    created_at: new Date('2021-01-02'),
    updated_at: new Date('2021-01-02'),
  },
  {
    id: '2',
    name: 'Property 2',
    area: 105,
    number_of_floors: 5,
    year_built: 2021,
    orientation: 'Đông Bắc',
    full_address: '124 Lạc Long Quân, Quận 4, TP. Hồ Chí Minh',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    lat: 10.764,
    lng: 106.674,
    type: 'ROOM',
    media: [
      {
        property_id: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "2",
        feature_id: BigInt(1),
      },
      {
        property_id: "2",
        feature_id: BigInt(3),
      },
      {
        property_id: "2",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(3),
        property_id: "1",
        tag: "Phòng trọ có gác xép",
      },
      {
        id: BigInt(4),
        property_id: "1",
        tag: "Phòng trọ đôi",
      },
    ],
    created_at: new Date('2021-02-12'),
    updated_at: new Date('2021-02-12'),
  },
  {
    id: '3',
    name: 'Property 3',
    area: 110,
    number_of_floors: 15,
    year_built: 2020,
    orientation: 'Tây Nam',
    full_address: '125 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.675,
    type: 'ROOM',
    media: [
      {
        property_id: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "3",
        feature_id: BigInt(1),
      },
      {
        property_id: "3",
        feature_id: BigInt(3),
      },
      {
        property_id: "3",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(3),
        property_id: "1",
        tag: "Phòng trọ có gác xép",
      },
      {
        id: BigInt(4),
        property_id: "1",
        tag: "Phòng trọ đôi",
      },
    ],
    created_at: new Date('2021-03-22'),
    updated_at: new Date('2021-03-22'),
  },
  {
    id: '4',
    name: 'Property 4',
    area: 115,
    number_of_floors: 20,
    year_built: 2021,
    orientation: 'Tây Bắc',
    full_address: '126 Lạc Long Quân, Quận 4, TP. Hồ Chí Minh',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    lat: 10.764,
    lng: 106.675,
    type: 'PRIVATE',
    media: [
      {
        property_id: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "4",
        feature_id: BigInt(1),
      },
      {
        property_id: "4",
        feature_id: BigInt(3),
      },
      {
        property_id: "4",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(8),
        property_id: "4",
        tag: "Quận 4",
      },
      {
        id: BigInt(9),
        property_id: "4",
        tag: "Nhà mặt phố",
      },
    ],
    created_at: new Date('2021-04-02'),
    updated_at: new Date('2021-04-02'),
  },
  {
    id: '5',
    name: 'Property 5',
    area: 120,
    number_of_floors: 25,
    year_built: 2020,
    orientation: 'Đông Nam',
    full_address: '127 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.676,
    type: 'APARTMENT',
    media: [
      {
        property_id: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "5",
        feature_id: BigInt(1),
      },
      {
        property_id: "5",
        feature_id: BigInt(3),
      },
      {
        property_id: "5",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(10),
        property_id: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(11),
        property_id: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    created_at: new Date('2021-05-12'), 
    updated_at: new Date('2021-05-12'),
  },
  {
    id: '6',
    name: 'Property 6',
    area: 125,
    number_of_floors: 30,
    year_built: 2021,
    orientation: 'Đông Bắc',
    full_address: '128 Lạc Long Quân, Quận 4, TP. Hồ Chí Minh',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    lat: 10.764,
    lng: 106.676,
    type: 'APARTMENT',
    media: [
      {
        property_id: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "6",
        feature_id: BigInt(1),
      },
      {
        property_id: "6",
        feature_id: BigInt(3),
      },
      {
        property_id: "6",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(10),
        property_id: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(11),
        property_id: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    created_at: new Date('2021-06-22'),
    updated_at: new Date('2021-06-22'),
  },
  {
    id: '7',
    name: 'Property 7',
    area: 130,
    number_of_floors: 35,
    year_built: 2020,
    orientation: 'Tây Nam',
    full_address: '129 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.677,
    type: 'ROOM',
    media: [
      {
        property_id: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "7",
        feature_id: BigInt(1),
      },
      {
        property_id: "7",
        feature_id: BigInt(3),
      },
      {
        property_id: "7",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(3),
        property_id: "1",
        tag: "Phòng trọ có gác xép",
      },
      {
        id: BigInt(4),
        property_id: "1",
        tag: "Phòng trọ đôi",
      },
    ],
    created_at: new Date('2021-07-02'),
    updated_at: new Date('2021-07-02'),
  },
  {
    id: '8',
    name: 'Property 8',
    area: 135,
    number_of_floors: 40,
    year_built: 2021,
    orientation: 'Tây Bắc',
    full_address: '130 Lạc Long Quân, Quận 4, TP. Hồ Chí Minh',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    lat: 10.764,
    lng: 106.677,
    type: 'APARTMENT',
    media: [
      {
        property_id: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "8",
        feature_id: BigInt(1),
      },
      {
        property_id: "8",
        feature_id: BigInt(3),
      },
      {
        property_id: "8",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(12),
        property_id: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(13),
        property_id: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    created_at: new Date('2021-08-12'),
    updated_at: new Date('2021-08-12'),
  },
  {
    id: '9',
    name: 'Property 9',
    area: 140,
    number_of_floors: 45,
    year_built: 2020,
    orientation: 'Đông Nam',
    full_address: '131 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.678,
    type: 'APARTMENT',
    media: [
      {
        property_id: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "9",
        feature_id: BigInt(1),
      },
      {
        property_id: "9",
        feature_id: BigInt(3),
      },
      {
        property_id: "9",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(14),
        property_id: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(15),
        property_id: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    created_at: new Date('2021-09-22'),
    updated_at: new Date('2021-09-22'),
  },
  {
    id: '10',
    name: 'Property 10',
    area: 145,
    number_of_floors: 50,
    year_built: 2021,
    orientation: 'Đông Bắc',
    full_address: '132 Lạc Long Quân, Quận 4, TP. Hồ Chí Minh',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    lat: 10.764,
    lng: 106.678,
    type: 'APARTMENT',
    media: [
      {
        property_id: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "10",
        feature_id: BigInt(1),
      },
      {
        property_id: "10",
        feature_id: BigInt(3),
      },
      {
        property_id: "10",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(16),
        property_id: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(17),
        property_id: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    created_at: new Date('2021-10-02'),
    updated_at: new Date('2021-10-02'),
  },
  {
    id: '11',
    name: 'Property 11',
    area: 150,
    number_of_floors: 55,
    year_built: 2020,
    orientation: 'Tây Nam',
    full_address: '133 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.679,
    type: 'APARTMENT',
    media: [
      {
        property_id: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "11",
        feature_id: BigInt(1),
      },
      {
        property_id: "11",
        feature_id: BigInt(3),
      },
      {
        property_id: "11",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(18),
        property_id: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(19),
        property_id: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    created_at: new Date('2021-11-12'),
    updated_at: new Date('2021-11-12'),
  },
  {
    id: '12',
    name: 'Property 12',
    area: 155,
    number_of_floors: 60,
    year_built: 2021,
    orientation: 'Tây Bắc',
    full_address: '134 Lạc Long Quân, Quận 4, TP. Hồ Chí Minh',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    lat: 10.764,
    lng: 106.679,
    type: 'APARTMENT',
    media: [
      {
        property_id: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "12",
        feature_id: BigInt(1),
      },
      {
        property_id: "12",
        feature_id: BigInt(3),
      },
      {
        property_id: "12",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(20),
        property_id: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(21),
        property_id: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    created_at: new Date('2021-12-22'),
    updated_at: new Date('2021-12-22'),
  },
  {
    id: '13',
    name: 'Property 13',
    area: 160,
    number_of_floors: 65,
    year_built: 2020,
    orientation: 'Đông Nam',
    full_address: '135 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.680,
    type: 'APARTMENT',
    media: [
      {
        property_id: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        property_id: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        property_id: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        property_id: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        property_id: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        property_id: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        property_id: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        property_id: "13",
        feature_id: BigInt(1),
      },
      {
        property_id: "13",
        feature_id: BigInt(3),
      },
      {
        property_id: "13",
        feature_id: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(22),
        property_id: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(23),
        property_id: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    created_at: new Date('2021-01-02'),
    updated_at: new Date('2021-01-02'),
  },
]
