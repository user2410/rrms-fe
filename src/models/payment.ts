export type PaymentItem = {
  payment_id: number;
  name: string;
  price: number;
  quantity: number;
  discount: number;
};

export type Payment = {
  id: number;
  userId: string;
  orderId: string;
  orderInfo: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
  items: PaymentItem[];
};

export const rentalPaymentTypes = {
  RENTAL: "Tiền thuê", 
  ELECTRICITY: "Tiền điện", 
  WATER: "Tiền nước",
  SERVICE: "Dịch vụ",
  MAINTENANCE: "Bảo trì",
  PENALTY: "Phạt",
};

export const listingPaymentTypes = {
  CREATELISTING: "Tạo tin đăng",
  EXTENDLISTING: "Gia hạn tin đăng",
  UPGRADELISTING: "Nâng cấp tin đăng",
};

export function getPaymentType(orderInfo: string): string {
  return orderInfo.slice(1).split("_")[0];
}

export function getPaymentObjectID(orderInfo: string): string {
  return orderInfo.slice(1).split("_")[1].split("]").at(0)!;
}

export function getPaymentGroup(paymentType: string) {
  if (["CREATELISTING", "EXTENDLISTING", "UPGRADELISTING"].includes(paymentType)) {
    return "LISTING";
  }
  return "SERVICE";
}

