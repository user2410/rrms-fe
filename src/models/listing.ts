export interface RentalPolicy {
  id: string;
  policy: string;
}

export interface ListingPolicy {
  listingId: string;
  policyId: string;
  note?: string;
}

export default interface Listing {
  id: string;
  creatorId: string;
  propertyId: string;
  title: string;
  description: string;
  price: number;
  securityDeposit: number;
  leaseDuration: number;
  petsAllowed: boolean;
  numberOfResidents: number;
  priority: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export const rentalPolicies = [
  { id: 1, policy: "rental_policy-payment", text: "Trả tiền thuê" },
  { id: 2, policy: "rental_policy-maintenance", text: "Bảo trì" },
  { id: 3, policy: "rental_policy-insurance", text: "Bảo hiểm" },
  { id: 4, policy: "rental_policy-noise", text: "Tiếng ồn" },
  { id: 5, policy: "rental_policy-lease_renewal", text: "Gia hạn hợp đồng" },
  { id: 6, policy: "rental_policy-change_to_property", text: "Sửa chữa thay đổi" },
  { id: 7, policy: "rental_policy-parking", text: "Đỗ xe" },
  { id: 8, policy: "rental_policy-pets", text: "Thú nuôi"   },
  { id: 9, policy: "rental_policy-subletting", text: "Cho thuê lại" },
  { id: 10, policy: "rental_policy-business", text: "Kinh doanh" },
  { id: 11, policy: "rental_policy-consequences", text: "Hậu quả vi phạm" },
  { id: 12, policy: "rental_policy-other", text: "Khác" },
];

export const ListingPriority = [
  {priority: "1", basePrice: 2700 , text: "Tin thường"},
  {priority: "2", basePrice: 2700 , text: "Tin bạc"},
  {priority: "3", basePrice: 2700 , text: "Tin vàng"},
  {priority: "4", basePrice: 2700 , text: "Tin kim cương"},
];

export const DiscountMap = new Map<string, number>([
  ["7", 1],
  ["15", 0.9],
  ["30", 0.8],
]);
