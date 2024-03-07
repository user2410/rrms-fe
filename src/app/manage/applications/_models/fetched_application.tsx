import { ApplicationUnit } from "@/models/application";

export type FetchedApplication = {
  id: number;
  listingId: string;
  propertyId: string;
  units: ApplicationUnit[];
  status: string;
  fullName: string;
  moveinDate: Date;
  preferredTerm: number;
  employmentStatus: string;
  employmentPosition?: string;
  employmentMonthlyIncome: number;
  createdAt: Date;
};
