
export type FetchedApplication = {
  id: number;
  listingId: string;
  propertyId: string;
  unitId: string;
  listingPrice: number;
  offeredPrice: number;
  status: string;
  fullName: string;
  moveinDate: Date;
  preferredTerm: number;
  employmentStatus: string;
  employmentPosition?: string;
  employmentMonthlyIncome: number;
  createdAt: Date;
};
