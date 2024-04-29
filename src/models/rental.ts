
export const MapTenantTypeToText = {
  INDIVIDUAL: 'Cá nhân',
  ORGANIZATION: 'Tổ chức',
};

export type RentalMinor = {
  rentalId?: number;
  fullName: string;
  email?: string;
  phone?: string;
  dob: Date;
  description?: string;
};

export type RentalCoap = {
  rentalId?: number;
  fullName: string;
  dob: Date;
  email?: string;
  phone?: string;
  job: string;
  income: number;
  description?: string;
};

export type RentalPet = {
  rentalId?: number;
  type: string;
  weight: number;
  description?: string;
};

export type RentalService = {
  id: number;
  rentalId: number;
  name: string;
  setupBy: string;
  provider: string;
  price: string;
}

export type RentalPolicy = {
  rentalId: number;
  title: string;
  content: string;
}

export type Rental = {
  id: number;
  creatorId: string;
  propertyId: string;
  unitId: string;
  applicationId?: string;
  
  tenantId?: string;
  profileImage: string;
  tenantType: 'INDIVIDUAL' | 'ORGANIZATION';
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  organizationName?: string;
  organizationHqAddress?: string;

  startDate: Date;
  moveinDate: Date;

  paymentType: "PREPAID" | "POSTPAID";

  rentalPeriod: number;
  rentalPrice: number;
  rentalIntention: string;
  deposit: number;
  depositPaid: boolean;
  
  electricitySetupBy: 'LANDLORD' | 'TENANT';
  electricityPaymentType: "RETAIL" | "FIXED";
  electricityProvider?: string;
  electricityCustomerCode?: string;
  electricityPrice?: number;
  waterSetupBy: 'LANDLORD' | 'TENANT';
  waterPaymentType: "RETAIL" | "FIXED";
  waterProvider?: string;
  waterCustomerCode?: string;
  waterPrice?: number;
  note: string;

  createdAt: Date;
  updatedAt: Date;

  coaps: RentalCoap[];
  minors: RentalMinor[];
  pets: RentalPet[];
  services: RentalService[];
};

export const rentalServices = {
  "internet": "Internet",
  "hygiene": "Vệ sinh",
  "parking": "Bãi đậu xe",
  "other": "Khác",
};

export function getRentalExpiryDate(rental: Rental): Date {
  const expiryDate = new Date(rental.startDate);
  expiryDate.setMonth(expiryDate.getMonth() + rental.rentalPeriod);
  return expiryDate;
}

export type RENTALPAYMENTSTATUS = 'PLAN' | 'PENDING' | 'ISSUED' | 'REQUEST2PAY' | 'PAID' | 'CANCELLED';

export type RentalPayment = {
  id: number;
  code: string;
  rentalId: number;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  expiryDate: Date;
  paymentDate: Date;
  updatedBy?: string;
  note?: string;
  status: RENTALPAYMENTSTATUS;
  amount: number;
  discount?: number;
  overdue?: boolean;
}

export const rentalPaymentStatus = {
  PLAN: 'Dự toán',
  ISSUED: 'Đang chờ bên thuê',
  PENDING: 'Đang chờ',
  REQUEST2PAY: 'Đang chờ xác nhận',
  PAID: 'Đã thanh toán',
  CANCELLED: 'Đã hủy',
};

const rentalPaymentReasons = {
  "RENTAL": "Thuê nhà",
  "DEPOSIT": "Đặt cọc",
  "ELECTRICITY": "Tiền điện",
  "WATER": "Tiền nước",
  "SERVICE": "Dịch vụ",
};

export function getRentalPaymentReason(payment: RentalPayment): keyof typeof rentalPaymentReasons {
  // payment code is in format [rentalId]_[reason]_[rest_of_the_code]
  const parts = payment.code.split('_');
  return parts[1] as keyof typeof rentalPaymentReasons;
}

export function getRentalPaymentReasonText(payment: RentalPayment, rentalServices: RentalService[]) {
  // payment code is in format [rentalId]_[reason]_[rest_of_the_code]
  const parts = payment.code.split('_');
  if(parts[1] === "SERVICE") {
    // console.log(rentalServices, parts[2]);
    return `Dịch vụ ${rentalServices?.find(s => s.id.toString() === parts[2])?.name || parts[2]}`;
  } else {
    return rentalPaymentReasons[parts[1] as keyof typeof rentalPaymentReasons];
  }
}

export function getTotalAmount(payment: RentalPayment): number {
  return payment.amount - (payment.discount || 0);
}

export function isOverdue(payment: RentalPayment): boolean {
  return ['PENDING', 'ISSUED'].includes(payment.status) && (new Date(payment.expiryDate) < new Date());
}
