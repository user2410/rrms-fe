import { Unit } from "./unit";

export type RentalPolicy = {
  id: number;
  policy: string;
};

export type ListingPolicy = {
  listingId: string;
  policyId: number;
  note?: string;
};

export type ListingUnit = {
  listingId: string;
  unitId: string;
  price: number;
};

export type Listing = {
  id: string;
  creatorId: string;
  propertyId: string;
  title: string;
  description: string;
  fullName: string;
  email: string;
  phone: string;
  contactType: string;
  price: number;
  securityDeposit: number;
  leaseTerm?: number;
  petsAllowed?: boolean;
  numberOfResidents?: number;
  priority: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date;
  // postAt: Date;
  policies: ListingPolicy[];
  units: ListingUnit[];
};

export type ReducedListing = {
  id: string;
  coverImg: string;
  title: string;
  price: number;
  area: number;
  city: string;
  district: string;
  postAt: Date;
}

export const rentalPolicies = [
  { id: 1, policy: "rental_policy-payment", text: "Trả tiền thuê", icon: 'fas fa-money-check-dollar' },
  { id: 2, policy: "rental_policy-maintenance", text: "Bảo trì", icon: 'fas fa-toolbox' },
  { id: 3, policy: "rental_policy-insurance", text: "Bảo hiểm", icon: 'fas fa-house-crack' },
  { id: 4, policy: "rental_policy-noise", text: "Tiếng ồn", icon: 'fas fa-volume-high' },
  { id: 5, policy: "rental_policy-lease_renewal", text: "Gia hạn hợp đồng", icon: 'fas fa-file-signature' },
  { id: 6, policy: "rental_policy-change_to_property", text: "Sửa chữa thay đổi", icon: 'fas fa-screwdriver-wrench' },
  { id: 7, policy: "rental_policy-parking", text: "Đỗ xe", icon: 'fas fa-square-parking' },
  { id: 8, policy: "rental_policy-pets", text: "Thú nuôi"  , icon: 'fas fa-dog' },
  { id: 9, policy: "rental_policy-subletting", text: "Cho thuê lại", icon: 'fas fa-hand-holding-hand' },
  { id: 10, policy: "rental_policy-business", text: "Kinh doanh", icon: 'fas fa-briefcase' },
  { id: 11, policy: "rental_policy-consequences", text: "Hậu quả vi phạm", icon: 'fas fa-gavel' },
  { id: 12, policy: "rental_policy-other", text: "Khác", icon: 'fas' },
];

export const ListingPriorities = [
  {priority: 1, basePrice: 2000 ,label: "Tin thường", desc: "Từ 2,000 đ/ngày"},
  {priority: 2, basePrice: 5000 ,label: "Tin bạc", desc: "Từ 5,000 đ/ngày"},
  {priority: 3, basePrice: 7000 ,label: "Tin vàng", desc: "Từ 7,000 đ/ngày"},
  {priority: 4, basePrice: 9000 ,label: "Tin kim cương", desc: "Từ 9,000 đ/ngày"},
];

export const ListingDiscount = [
  {duration: 7, discount: 0},
  {duration: 15, discount: 10},
  {duration: 30, discount: 20},
];

export const mockupListings : Listing[] = [
  {
    id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    creatorId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    propertyId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    title: "Chính chủ cần cho thuê gấp cả nhà 7T hoặc cho thuê riêng tầng 1, 2 DT 100m2 ngay số 9 Nguyễn Xiển",
    description: "Cần cho thuê gấp mặt bằng kinh doanh văn phòng T1, 2 giá rẻ ngay số 9 Nguyễn Xiển: Tầng 01 DT 100m²/sàn giá cho thuê: 38tr/tháng. Văn phòng T2 DT 30m² giá: 5tr/sàn. Tầng 1, 2 DT 180m² cho cho thuê: 110tr/tháng. Có thể vào được luôn.",
    fullName: 'Nguyễn Văn A',
    email: 'a.nv19234@sis.hust.edu.vn',
    phone: '01233456789',
    contactType: 'OWNER',
    price: 10000000,
    securityDeposit: 10000000,
    leaseTerm: 36,
    petsAllowed: true,
    numberOfResidents: 12,
    priority: 2,
    active: true,
    units: [],
    policies: [
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 1,
        note: "Trả tiền thuê vào đầu hàng tháng",
      },
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 2,
        note: "Bảo trì định kỳ 3 tháng 1 lần",
      },
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 4,
        note: "Không được tạo tiếng ồn sau 10h",
      },

    ],
    createdAt: new Date(2023, 12, 5),
    updatedAt: new Date(2023, 12, 5),
    expiredAt: new Date(2024, 1, 25),
    // postAt: new Date(2024, 1, 25),
  },
  {
    id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    creatorId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    propertyId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    title: "Cho thuê làm văn phòng tầng 1+2+3",
    description: "Cho thuê làm văn phòng tầng 1 + 2 + 3 toà nhà ngõ 149 Nguyễn Tuân, diện tích 55m²/sàn, có thang máy đi riêng biệt, ngõ nông hai ô tô tránh nhau, khu vực đông đúc bậc nhất Hà nôi. Giá 25 tr/tháng.",
    fullName: 'Nguyễn Văn A',
    email: 'a.nv19234@sis.hust.edu.vn',
    phone: '01233456789',
    contactType: 'OWNER',
    price: 10000000,
    securityDeposit: 10000000,
    leaseTerm: 36,
    petsAllowed: true,
    numberOfResidents: 12,
    priority: 2,
    active: true,
    units: [],
    policies: [
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 1,
        note: "Trả tiền thuê vào đầu hàng tháng",
      },
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 2,
        note: "Bảo trì định kỳ 3 tháng 1 lần",
      },
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 4,
        note: "Không được tạo tiếng ồn sau 10h",
      },

    ],
    createdAt: new Date(2023, 12, 5),
    updatedAt: new Date(2023, 12, 5),
    expiredAt: new Date(2024, 1, 25),
    // postAt: new Date(2024, 1, 25),
  },
  {
    id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    creatorId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    propertyId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    title: "Chính chủ cho thuê văn phòng 46.3m2 tòa Gold Tower 275 Nguyễn Trãi",
    description: "Chính chủ cho thuê chỉ còn 1 căn duy nhất 46.3m² tòa Gold Tower mặt đường Nguyễn Trãi, TX, HN. Tòa lạc 275 Nguyễn Trãi huyết mạch thủ đô. Giá 15tr có thương lượng (chấp nhận môi giới phí 1 tháng nếu thành công). Tòa văn phòng hạng A giá thương lượng trực tiếp với tôi chủ nhà Huy 50 tuổi. Tòa đẹp tọa lạc đẹp nhất mặt đường Nguyễn Trãi 35 tầng văn tại tầng 11 hướng Đông Nam mát mẻ.",
    fullName: 'Nguyễn Văn A',
    email: 'a.nv19234@sis.hust.edu.vn',
    phone: '01233456789',
    contactType: 'OWNER',
    price: 10000000,
    securityDeposit: 10000000,
    leaseTerm: 36,
    petsAllowed: true,
    numberOfResidents: 12,
    priority: 3,
    active: true,
    units: [],
    policies: [
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 1,
        note: "Trả tiền thuê vào đầu hàng tháng",
      },
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 2,
        note: "Bảo trì định kỳ 3 tháng 1 lần",
      },
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 4,
        note: "Không được tạo tiếng ồn sau 10h",
      },
    ],
    createdAt: new Date(2023, 12, 5),
    updatedAt: new Date(2023, 12, 5),
    expiredAt: new Date(2024, 1, 25),
    // postAt: new Date(2024, 1, 25),
  },
];

export const mockupSearchingListings = [
  {
    lid: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    ltitle: "Chính chủ cần cho thuê gấp cả nhà 7T hoặc cho thuê riêng tầng 1, 2 DT 100m2 ngay số 9 Nguyễn Xiển",
    lprice: 10000000,
    ldescription: "Cần cho thuê gấp mặt bằng kinh doanh văn phòng T1, 2 giá rẻ ngay số 9 Nguyễn Xiển: Tầng 01 DT 100m²/sàn giá cho thuê: 38tr/tháng. Văn phòng T2 DT 30m² giá: 5tr/sàn. Tầng 1, 2 DT 180m² cho cho thuê: 110tr/tháng. Có thể vào được luôn.",
    lpriority: 1,
    parea: 100,
    paddress: "Hà Nội",
    pcity: "HN",
    pdistrict: "TX",
    pward: "TXT",
    pmedia: [
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-35-34-1695660863015",
        description: "Mặt tiền",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
    ],
    lpolicies: [
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 1,
        note: "Trả tiền thuê vào đầu hàng tháng",
      },
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 2,
        note: "Bảo trì định kỳ 3 tháng 1 lần",
      },
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 4,
        note: "Không được tạo tiếng ồn sau 10h",
      },

    ],
    lcreatedAt: new Date(2023, 12, 5),
  },
  {
    lid: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    ltitle: "Chính chủ cho thuê văn phòng 46.3m2 tòa Gold Tower 275 Nguyễn Trãi",
    lprice: 10000000,
    ldescription: "Chính chủ cho thuê chỉ còn 1 căn duy nhất 46.3m² tòa Gold Tower mặt đường Nguyễn Trãi, TX, HN. Tòa lạc 275 Nguyễn Trãi huyết mạch thủ đô. Giá 15tr có thương lượng (chấp nhận môi giới phí 1 tháng nếu thành công). Tòa văn phòng hạng A giá thương lượng trực tiếp với tôi chủ nhà Huy 50 tuổi. Tòa đẹp tọa lạc đẹp nhất mặt đường Nguyễn Trãi 35 tầng văn tại tầng 11 hướng Đông Nam mát mẻ.",
    lpriority: 2,
    parea: 100,
    paddress: "Hà Nội",
    pcity: "HN",
    pdistrict: "TX",
    pward: "TXT",
    pmedia: [
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-35-34-1695660863015",
        description: "Mặt tiền",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
    ],
    lpolicies: [
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 1,
        note: "Trả tiền thuê vào đầu hàng tháng",
      },
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 2,
        note: "Bảo trì định kỳ 3 tháng 1 lần",
      },
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 4,
        note: "Không được tạo tiếng ồn sau 10h",
      },

    ],
    lcreatedAt: new Date(2023, 12, 6),
  },
  {
    lid: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
    ltitle: "Cho thuê làm văn phòng tầng 1+2+3",
    lprice: 10000000,
    ldescription: "Cho thuê làm văn phòng tầng 1 + 2 + 3 toà nhà ngõ 149 Nguyễn Tuân, diện tích 55m²/sàn, có thang máy đi riêng biệt, ngõ nông hai ô tô tránh nhau, khu vực đông đúc bậc nhất Hà nôi. Giá 25 tr/tháng.",
    lpriority: 3,
    parea: 100,
    paddress: "Hà Nội",
    pcity: "HN",
    pdistrict: "TX",
    pward: "TXT",
    pmedia: [
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-35-34-1695660863015",
        description: "Mặt tiền",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
      {
        url: "https://rrms-image.s3.ap-southeast-1.amazonaws.com/87559c7e-704f-492a-90a8-932b9c0c95cc/Screenshot_from_2023-09-25_16-33-49-1695660879527",
        description: "Phòng khách",
        type: "IMAGE",
      },
    ],
    lpolicies: [
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 1,
        note: "Trả tiền thuê vào đầu hàng tháng",
      },
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 2,
        note: "Bảo trì định kỳ 3 tháng 1 lần",
      },
      {
        listingId: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
        policyId: 4,
        note: "Không được tạo tiếng ồn sau 10h",
      },

    ],
    lcreatedAt: new Date(2023, 12, 7),
  },
];
