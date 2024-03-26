export type PreRental = {
  id: number;
  applicationId: string;
  propertyId: string;
  creatorId: string;
  tenantId: string;
  profileImage: string;
  tenantType: 'INDIVIDUAL' | 'ORGANIZATION';
  tenantIdentity: string;
  tenantIdentityIssuedAt: Date;
  tenantIdentityIssuedBy: string;
  tenantDob: Date;
  tenantPhone: string;
  tenantEmail: string;
  tenantAddress: string;
  contractType?: 'DIGITAL'| 'FILE'| 'IMAGE';
  contractContent?: string;
  contractLastUpdate: Date;
  contractLastUpdateBy: string;
  landArea: number;
  propertyArea: number;
  startDate: Date;
  moveinDate: Date;
  rentalPeriod: number;
  rentalPrice: number;
  note: string;
  status: 'PENDING' | 'FINISHED' | 'CANCELED';
};

export type PreRentalContract = {
  id: number;
  contractType: 'DIGITAL'| 'FILE'| 'IMAGE';
  contractContent: string;
  contractLastUpdate: Date;
  contractLastUpdateBy: string;
};
