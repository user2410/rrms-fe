export type Contract = {
  id: number;
  rentalId: string;
  aFullName: string;
  aDob: Date;
  aPhone: string;
  aAddress: string;
  aHouseholdRegistration: string;
  aIdentity: string;
  aIdentityIssuedBy: string;
  aIdentityIssuedAt: Date;
  aDocuments: string[];
  aBankAccount?: string;
  aBank?: string;
  aRegistrationNumber: string;
  bFullName: string;
  bOrganizationName?: string;
  bOrganizationHqAddress?: string;
  bOrganizationCode?: string;
  bOrganizationCodeIssuedAt?: Date;
  bOrganizationCodeIssuedBy?: string;
  bDob?: Date;
  bPhone: string;
  bAddress?: string;
  bHouseholdRegistration?: string;
  bIdentity?: string;
  bIdentityIssuedBy?: string;
  bIdentityIssuedAt?: Date;
  bBankAccount?: string;
  bBank?: string;
  bTaxCode?: string;
  paymentMethod: string;
  paymentDay: number;
  nCopies: number;
  createdAtPlace: string;
  content: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
};

export const paymentMethods = {
  "cash": "Tiền mặt",
  "cheque": "Séc",
  "transfer": "Chuyển tiền",
  "draft": "Nhờ thu (hối phiếu)",
  "lc": "Thư tín dụng",
};
