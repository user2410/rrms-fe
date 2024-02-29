import { Listing } from "./listing";
import { Property } from "./property";
import { Unit } from "./unit";

export type ApplicationUnit = {
  unitId: string;
  listingPrice: number;
  offeredPrice: number;
}

export type ApplicationMinor = {
  applicationId?: number;
  fullName: string;
  email?: string;
  phone?: string;
  dob: Date;
  description?: string;
};

export type ApplicationCoap = {
  applicationId?: number;
  fullName: string;
  dob: Date;
  email?: string;
  phone?: string;
  job: string;
  income: number;
  description?: string;
};

export type ApplicationPet = {
  applicationId?: number;
  type: string;
  weight: number;
  description?: string;
};

export type ApplicationVehicle = {
  applicationId?: number;
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
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  email: string;
  phone: string;
  dob: Date;
  profileImage: string;

  moveinDate: Date;
  preferredTerm: number;
  rentalIntention: "RESIDENCE" | "BUSINESS" | "OFFICE" | "TENANCY";

  rhAddress?: string;
  rhCity?: string;
  rhDistrict?: string;
  rhWard?: string;
  rhRentalDuration?: number;
  rhMonthlyPayment?: number;
  rhReasonForLeaving?: string;

  employmentStatus: string;
  employmentCompanyName?: string;
  employmentPosition?: string;
  employmentMonthlyIncome: number;
  employmentComment?: string;
  employmentProofsOfIncome?: string[];

  identityType: string;
  identityNumber: string;
  identityIssueDate: Date;
  identityIssuedBy: string;

  units: ApplicationUnit[];
  minors?: ApplicationMinor[];
  coaps?: ApplicationCoap[];
  pets?: ApplicationPet[];
  vehicles?: ApplicationVehicle[];
};

export type ManagedApplication = {
  application: Application;
  listing: Listing;
  property: Property;
  units: Unit[];
};

export const MapRentalIntentionToText = {
  "RESIDENCE": "Để ở",
  "BUSINESS": "Kinh doanh",
  "OFFICE": "Văn phòng",
  "TENANCY": "Nhà trọ",
};

export const MapEmploymentStatusToText = {
  "EMPLOYED": "Đang làm việc",
  "UNEMPLOYED": "Không có việc làm",
  "SELF_EMPLOYED": "Tự kinh doanh",
  "RETIRED": "Đã nghỉ hưu",
  "STUDENT": "Sinh viên",
};

export const MapPetTypeToText = {
  "dog": "Chó",
  "cat": "Mèo",
  "other": "Khác",
};

export const MapVehicleTypeToText = {
  "car": "Ô tô",
  "motorbike": "Xe máy",
  "other": "Khác",
};

export const MapIdentityTypeToText = {
  "ID" : "Chứng minh nhân dân",
  "CITIZENIDENTIFICATION" : "Thẻ căn cước công dân",
  "PASSPORT" : "Hộ chiếu",
  "DRIVERLICENSE" : "Bằng lái xe", 
};

function transformDateValues(application: Application) {
    if(application.dob) {application.dob = new Date(application.dob);}
    if(application.moveinDate) {application.moveinDate = new Date(application.moveinDate);}
    if(application.identityIssueDate) {application.identityIssueDate = new Date(application.identityIssueDate);}
    if(application.createdAt) {application.createdAt = new Date(application.createdAt);}
    if(application.updatedAt) {application.updatedAt = new Date(application.updatedAt);}

    if (application.minors) {
      for (let j = 0; j < application.minors.length; j++) {
        const v = application.minors[j].dob;
        if(v) application.minors[j].dob = new Date(v);
      }
    }
    if (application.coaps) {
      for (let j = 0; j < application.coaps.length; j++) {
        const v = application.coaps[j].dob;
        if(v) application.coaps[j].dob = new Date(v);
      }
    }
  return application;
}

export function TransformApplicationRESTResponse(data: any) {
  const application = JSON.parse(data);
  return transformDateValues(application);
}

export function TransformApplicationsRESTResponse(data: any) {
  const applications = JSON.parse(data);

  for (let i = 0; i < applications.length; i++) {
    applications[i] = transformDateValues(applications[i]);
  }

  return applications;
}

export const mockupApplications: Application[] = [
  {
    id: 1,
    listingId: "f6ca05c0-fad5-46fc-a237-a8e930e7cb01",
    propertyId: "f6ca05c0-fad5-46fc-a237-a8e930e7cb01",
    unitIds: ["f6ca05c0-fad5-46fc-a237-a8e930e7cb01"],
    status: "PENDING",
    creatorId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    fullName: "Nguyen Van A",
    email: "abc@email.com",
    phone: "091235126",
    dob: new Date("1999-01-01"),
    profileImage: "https://i.pravatar.cc/300",
    moveinDate: new Date("2024-01-01"),
    preferredTerm: 12,
    rentalIntention: "RESIDENCE",
    rhAddress: "123 Chu Van An",
    rhCity: "Ha Noi",
    rhDistrict: "Ba Dinh",
    rhWard: "Cong Vi",
    rhRentalDuration: 12,
    rhMonthlyPayment: 1000,
    rhReasonForLeaving: "due",
    employmentStatus: "EMPLOYED",
    employmentCompanyName: "Viettel",
    employmentPosition: "Ky su",
    employmentMonthlyIncome: 90000000,
    employmentComment: "sadnfjnưe gưeigơi qdqưmdqion qưdin",
    identityType: "ID",
    identityNumber: "01292944238",
    identityIssueDate: new Date("2020-01-01"),
    identityIssuedBy: "Cục quản lý dân cư",
    units: [],
    minors: [
      {
        applicationId: 1,
        fullName: "Nguyễn Minh Thu",
        dob: new Date("2016-07-01T00:00:00+00:00"),
        email: "",
        phone: "",
        description: "Mẫu giáo nhỡ",
      },
      {
        applicationId: 2,
        fullName: "Nguyễn Minh Thu",
        dob: new Date("2016-01-08T00:00:00+00:00"),
        email: "",
        phone: "",
        description: "Mẫu giáo nhỡ",
      },
    ],
    coaps: [
      {
        fullName: "Nguyễn Minh Nguyệt",
        dob: new Date("1992-02-11T00:00:00+00:00"),
        job: "Giao vien",
        income: 30,
        email: "abc@email.com",
        phone: "0912142214",
        description: "Giao vien THCS Trưng Vương",
      },
      {
        fullName: "Nguyễn Đức Bảo",
        dob: new Date("2001-07-06T00:00:00+00:00"),
        job: "Sinh Viên",
        income: 2,
        email: "abc@email.com",
        phone: "093621789",
        description: "Sinh viên đại học BKHN",
      },
    ],
    pets: [
      {
        applicationId: 1,
        type: "dog",
        weight: 6,
        description: "Đã tiêm chủng đầy đủ",
      },
      { applicationId: 1, type: "cat", weight: 4, description: "Đã triệt sản" },
      {
        applicationId: 2,
        type: "dog",
        weight: 6,
        description: "Đã tiêm chủng đầy đủ",
      },
      { applicationId: 2, type: "cat", weight: 4, description: "Đã triệt sản" },
    ],
    vehicles: [
      { applicationId: 1, type: "car", model: "Innova", code: "29G2-03555" },
      {
        applicationId: 1,
        type: "motorbike",
        model: "Honda Lead",
        code: "29G2-02444",
      },
      { applicationId: 2, type: "car", model: "Innova", code: "29G2-06777" },
      {
        applicationId: 2,
        type: "motorbike",
        model: "Honda Lead",
        code: "29G2-05466",
      },
    ],
  },
];
