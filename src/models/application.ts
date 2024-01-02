export type ApplicationMinor = {
  applicationId: number;
  fullName: string;
  email?: string;
  phone?: string;
  dob: Date;
  description?: string;
};

export type ApplicationCoap = {
  applicationId: number;
  fullName: string;
  dob: Date;
  email?: string;
  phone?: string;
  job: string;
  income: number;
  description?: string;
};

export type ApplicationPet = {
  applicationId: number;
  type: string;
  weight: number;
  description?: string;
};

export type ApplicationVehicle = {
  applicationId: number;
  type: string;
  model?: string;
  code: string;
  description?: string;
};

export type Application = {
  id: number;
  listingId: string;
  propertyId: string;
  unitIds: string[];
  status: "PENDING" | "APPROVED" | "CONDITIONALLY_APPROVED" | "REJECTED";
  creatorId: string;

  fullName: string;
  email: string;
  phone: string;
  dob: Date;
  profileImage: string;

  moveinDate: Date;
  preferredTerm: number;

  rhAddress: string;
  rhCity: string;
  rhDistrict: string;
  rhWard: string;
  rhRentalDuration: number;
  rhMonthlyPayment: number;
  rhReasonForLeaving: string;

  employmentStatus: string;
  employmentCompanyName: string;
  employmentPosition: string;
  employmentMonthlyIncome: number;
  employmentComment: string;
  employmentProofsOfIncome: string[];

  identityType: string;
  identityNumber: string;
  identityIssueDate: Date;
  identityIssueBy: string;

  minors: ApplicationMinor[];
  coaps: ApplicationCoap[];
  pets: ApplicationPet[];
  vehicles: ApplicationVehicle[];
};
