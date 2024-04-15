
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
  rentalPeriod: number;
  rentalPrice: number;
  rentalIntention: string;
  deposit: number;
  depositPaid: boolean;
  
  electricityPaymentType: "RETAIL" | "FIXED";
  electricityPrice?: number;
  waterPaymentType: "RETAIL" | "FIXED";
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
