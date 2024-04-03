
export const MapTenantTypeToText = {
  INDIVIDUAL: 'Cá nhân',
  ORGANIZATION: 'Tổ chức',
};

export type RentalContract = {
  id: number;
  contractType: 'DIGITAL'| 'FILE'| 'IMAGE';
  contractContent: string;
  contractLastUpdate: Date;
  contractLastUpdateBy: string;
};

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
  tenantIdentity: string;
  tenantDob: Date;
  tenantPhone: string;
  tenantEmail: string;
  tenantAddress: string;

  contractType: 'DIGITAL'| 'FILE'| 'IMAGE';
  contractContent: string;
  contractLastUpdate: Date;
  contractLastUpdateBy: string;

  landArea: number;
  unitArea: number;

  startDate: Date;
  moveinDate: Date;
  rentalPeriod: number;
  rentalPrice: number;
  note: string;
};

export const rentalServices = {
  "internet": "Internet",
  "hygiene": "Vệ sinh",
  "parking": "Bãi đậu xe",
  "other": "Khác",
};
