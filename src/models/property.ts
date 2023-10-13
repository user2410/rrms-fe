export type PropertyType = 
  'APARTMENT' |
  'PRIVATE' | 'TOWNHOUSE' | 'SHOPHOUSE' | 'VILLA' |
  'ROOM' | 'STORE' |
  'OFFICE' |
  'BLOCK';
  // 'COMPLEX'; // Quỹ căn hộ / biệt thự

export type PropertyMedia = {
  url: string;
  propertyId: string;
  type: 'IMAGE' | 'VIDEO';
};

export type PFeature = {
  id: number;
  feature: string;
}

export type PropertyFeature = {
  propertyId: string;
  featureId: BigInt;
  description?: string;
};

export type PropertyTag = {
  id: BigInt;
  propertyId: string;
  tag: string;
}

export default interface Property {
  id: string;
  name?: string;
  area: number;
  numberOfFloors: number;
  yearBuilt?: number;
  orientation?: string;
  fullAdress: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  type: PropertyType;
  media: PropertyMedia[];
  features: PropertyFeature[];
  tags: PropertyTag[];
  createdAt: Date;
  updatedAt: Date;
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

export const pFeatures = [
  {id: 1, feature: "p-feature_security", text: "An ninh"},
  {id: 2, feature: "p-feature_fire-alarm", text: "Hệ thống báo cháy"},
  {id: 3, feature: "p-feature_gym", text: "Phòng tập gym"},
  {id: 4, feature: "p-feature_fitness-center", text: "Trung tâm thể dục"},
  {id: 5, feature: "p-feature_swimming-pool", text: "Hồ bơi"},
  {id: 6, feature: "p-feature_community-rooms", text: "Phòng cộng đồng"},
  {id: 7, feature: "p-feature_public-library", text: "Thư viện công cộng"},
  {id: 8, feature: "p-feature_parking", text: "Bãi đỗ xe"},
  {id: 9, feature: "p-feature_outdoor-common-area", text: "Khu vực công cộng ngoài trời"},
  {id: 10, feature: "p-feature_services", text: "Dịch vụ"},
  {id: 11, feature: "p-feature_facilities", text: "Cơ sở vật chất"},
  {id: 12, feature: "p-feature_others", text: "Khác"},
];

export const mockupProperties: Property[] = [
  {
    id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    name: 'Property 1',
    area: 100,
    numberOfFloors: 10,
    yearBuilt: 2020,
    orientation: 'Đông Nam',
    fullAdress: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.674,
    type: 'APARTMENT',
    media: [
      {
        propertyId: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '1',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "1",
        featureId: BigInt(1),
      },
      {
        propertyId: "1",
        featureId: BigInt(3),
      },
      {
        propertyId: "1",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(1),
        propertyId: "1",
        tag: "Biệt thự liền kề",
      },
      {
        id: BigInt(2),
        propertyId: "1",
        tag: "Mặt phố",
      },
    ],
    createdAt: new Date('2021-01-02'),
    updatedAt: new Date('2021-01-02'),
  },
  {
    id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb02',
    name: 'Property 2',
    area: 105,
    numberOfFloors: 5,
    yearBuilt: 2021,
    orientation: 'Đông Bắc',
    fullAdress: '124 Lạc Long Quân, Quận 4, TP. Hồ Chí Minh',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    lat: 10.764,
    lng: 106.674,
    type: 'ROOM',
    media: [
      {
        propertyId: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '2',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "2",
        featureId: BigInt(1),
      },
      {
        propertyId: "2",
        featureId: BigInt(3),
      },
      {
        propertyId: "2",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(3),
        propertyId: "1",
        tag: "Phòng trọ có gác xép",
      },
      {
        id: BigInt(4),
        propertyId: "1",
        tag: "Phòng trọ đôi",
      },
    ],
    createdAt: new Date('2021-02-12'),
    updatedAt: new Date('2021-02-12'),
  },
  {
    id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb03',
    name: 'Property 3',
    area: 110,
    numberOfFloors: 15,
    yearBuilt: 2020,
    orientation: 'Tây Nam',
    fullAdress: '125 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.675,
    type: 'ROOM',
    media: [
      {
        propertyId: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '3',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "3",
        featureId: BigInt(1),
      },
      {
        propertyId: "3",
        featureId: BigInt(3),
      },
      {
        propertyId: "3",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(3),
        propertyId: "1",
        tag: "Phòng trọ có gác xép",
      },
      {
        id: BigInt(4),
        propertyId: "1",
        tag: "Phòng trọ đôi",
      },
    ],
    createdAt: new Date('2021-03-22'),
    updatedAt: new Date('2021-03-22'),
  },
  {
    id: "f6ca05c0-fad5-46fc-a237-a8e930e7cb04",
    name: 'Property 4',
    area: 115,
    numberOfFloors: 20,
    yearBuilt: 2021,
    orientation: 'Tây Bắc',
    fullAdress: '126 Lạc Long Quân, Quận 4, TP. Hồ Chí Minh',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    lat: 10.764,
    lng: 106.675,
    type: 'PRIVATE',
    media: [
      {
        propertyId: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '4',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "4",
        featureId: BigInt(1),
      },
      {
        propertyId: "4",
        featureId: BigInt(3),
      },
      {
        propertyId: "4",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(8),
        propertyId: "4",
        tag: "Quận 4",
      },
      {
        id: BigInt(9),
        propertyId: "4",
        tag: "Nhà mặt phố",
      },
    ],
    createdAt: new Date('2021-04-02'),
    updatedAt: new Date('2021-04-02'),
  },
  {
    id: "f6ca05c0-fad5-46fc-a237-a8e930e7cb05",
    name: 'Property 5',
    area: 120,
    numberOfFloors: 25,
    yearBuilt: 2020,
    orientation: 'Đông Nam',
    fullAdress: '127 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.676,
    type: 'APARTMENT',
    media: [
      {
        propertyId: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '5',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "5",
        featureId: BigInt(1),
      },
      {
        propertyId: "5",
        featureId: BigInt(3),
      },
      {
        propertyId: "5",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(10),
        propertyId: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(11),
        propertyId: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    createdAt: new Date('2021-05-12'), 
    updatedAt: new Date('2021-05-12'),
  },
  {
    id: "f6ca05c0-fad5-46fc-a237-a8e930e7cb06",
    name: 'Property 6',
    area: 125,
    numberOfFloors: 30,
    yearBuilt: 2021,
    orientation: 'Đông Bắc',
    fullAdress: '128 Lạc Long Quân, Quận 4, TP. Hồ Chí Minh',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    lat: 10.764,
    lng: 106.676,
    type: 'APARTMENT',
    media: [
      {
        propertyId: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '6',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "6",
        featureId: BigInt(1),
      },
      {
        propertyId: "6",
        featureId: BigInt(3),
      },
      {
        propertyId: "6",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(10),
        propertyId: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(11),
        propertyId: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    createdAt: new Date('2021-06-22'),
    updatedAt: new Date('2021-06-22'),
  },
  {
    id: "f6ca05c0-fad5-46fc-a237-a8e930e7cb4907",
    name: 'Property 7',
    area: 130,
    numberOfFloors: 35,
    yearBuilt: 2020,
    orientation: 'Tây Nam',
    fullAdress: '129 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.677,
    type: 'ROOM',
    media: [
      {
        propertyId: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '7',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "7",
        featureId: BigInt(1),
      },
      {
        propertyId: "7",
        featureId: BigInt(3),
      },
      {
        propertyId: "7",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(3),
        propertyId: "1",
        tag: "Phòng trọ có gác xép",
      },
      {
        id: BigInt(4),
        propertyId: "1",
        tag: "Phòng trọ đôi",
      },
    ],
    createdAt: new Date('2021-07-02'),
    updatedAt: new Date('2021-07-02'),
  },
  {
    id: "f6ca05c0-fad5-46fc-a237-a8e930e7cb08",
    name: 'Property 8',
    area: 135,
    numberOfFloors: 40,
    yearBuilt: 2021,
    orientation: 'Tây Bắc',
    fullAdress: '130 Lạc Long Quân, Quận 4, TP. Hồ Chí Minh',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    lat: 10.764,
    lng: 106.677,
    type: 'APARTMENT',
    media: [
      {
        propertyId: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '8',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "8",
        featureId: BigInt(1),
      },
      {
        propertyId: "8",
        featureId: BigInt(3),
      },
      {
        propertyId: "8",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(12),
        propertyId: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(13),
        propertyId: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    createdAt: new Date('2021-08-12'),
    updatedAt: new Date('2021-08-12'),
  },
  {
    id: "f6ca05c0-fad5-46fc-a237-a8e930e7cb09",
    name: 'Property 9',
    area: 140,
    numberOfFloors: 45,
    yearBuilt: 2020,
    orientation: 'Đông Nam',
    fullAdress: '131 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.678,
    type: 'APARTMENT',
    media: [
      {
        propertyId: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '9',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "9",
        featureId: BigInt(1),
      },
      {
        propertyId: "9",
        featureId: BigInt(3),
      },
      {
        propertyId: "9",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(14),
        propertyId: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(15),
        propertyId: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    createdAt: new Date('2021-09-22'),
    updatedAt: new Date('2021-09-22'),
  },
  {
    id: "f6ca05c0-fad5-46fc-a237-a8e930e7cb10",
    name: 'Property 10',
    area: 145,
    numberOfFloors: 50,
    yearBuilt: 2021,
    orientation: 'Đông Bắc',
    fullAdress: '132 Lạc Long Quân, Quận 4, TP. Hồ Chí Minh',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    lat: 10.764,
    lng: 106.678,
    type: 'APARTMENT',
    media: [
      {
        propertyId: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '10',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "10",
        featureId: BigInt(1),
      },
      {
        propertyId: "10",
        featureId: BigInt(3),
      },
      {
        propertyId: "10",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(16),
        propertyId: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(17),
        propertyId: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    createdAt: new Date('2021-10-02'),
    updatedAt: new Date('2021-10-02'),
  },
  {
    id: "f6ca05c0-fad5-46fc-a237-a8e930e7cb11",
    name: 'Property 11',
    area: 150,
    numberOfFloors: 55,
    yearBuilt: 2020,
    orientation: 'Tây Nam',
    fullAdress: '133 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.679,
    type: 'APARTMENT',
    media: [
      {
        propertyId: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '11',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "11",
        featureId: BigInt(1),
      },
      {
        propertyId: "11",
        featureId: BigInt(3),
      },
      {
        propertyId: "11",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(18),
        propertyId: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(19),
        propertyId: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    createdAt: new Date('2021-11-12'),
    updatedAt: new Date('2021-11-12'),
  },
  {
    id: "f6ca05c0-fad5-46fc-a237-a8e930e7cb12",
    name: 'Property 12',
    area: 155,
    numberOfFloors: 60,
    yearBuilt: 2021,
    orientation: 'Tây Bắc',
    fullAdress: '134 Lạc Long Quân, Quận 4, TP. Hồ Chí Minh',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    lat: 10.764,
    lng: 106.679,
    type: 'APARTMENT',
    media: [
      {
        propertyId: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '12',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "12",
        featureId: BigInt(1),
      },
      {
        propertyId: "12",
        featureId: BigInt(3),
      },
      {
        propertyId: "12",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(20),
        propertyId: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(21),
        propertyId: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    createdAt: new Date('2021-12-22'),
    updatedAt: new Date('2021-12-22'),
  },
  {
    id: "f6ca05c0-fad5-46fc-a237-a8e930e7cb13",
    name: 'Property 13',
    area: 160,
    numberOfFloors: 65,
    yearBuilt: 2020,
    orientation: 'Đông Nam',
    fullAdress: '135 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    lat: 10.765,
    lng: 106.680,
    type: 'APARTMENT',
    media: [
      {
        propertyId: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg',
      },
      {
        propertyId: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/870d627df044cef9c81b869f48c80447_1686997941.jpg',
      },
      {
        propertyId: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/698ca5f9cd4ead81824028844dcc11a0_1686997941.jpg',
      },
      {
        propertyId: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/11c874d516379eb8e507e5342160a933_1686997951.jpg',
      },
      {
        propertyId: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/img-1475_1686997951.jpg',
      },
      {
        propertyId: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2023/06/16/img-6342_1686925907.jpg',
      },
      {
        propertyId: '13',
        type: 'IMAGE',
        url: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
      },
    ],
    features: [
      {
        propertyId: "13",
        featureId: BigInt(1),
      },
      {
        propertyId: "13",
        featureId: BigInt(3),
      },
      {
        propertyId: "13",
        featureId: BigInt(4),
      },
    ],
    tags: [
      {
        id: BigInt(22),
        propertyId: "1",
        tag: "Căn hộ chung cư",
      },
      {
        id: BigInt(23),
        propertyId: "1",
        tag: "Căn hộ cao cấp",
      },
    ],
    createdAt: new Date('2021-01-02'),
    updatedAt: new Date('2021-01-02'),
  },
]
