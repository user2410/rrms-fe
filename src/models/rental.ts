import { addMonths } from "date-fns";
import { Application } from "./application";
import { Property } from "./property";
import { Unit } from "./unit";

export const mapTenantTypeToText = {
  INDIVIDUAL: "Cá nhân",
  ORGANIZATION: "Tổ chức",
  FAMILY: "Hộ gia đình",
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
};

export type RentalPolicy = {
  rentalId: number;
  title: string;
  content: string;
};

export type Rental = {
  id: number;
  creatorId: string;
  propertyId: string;
  unitId: string;
  applicationId?: string;

  tenantId?: string;
  profileImage: string;
  tenantType: "INDIVIDUAL" | "ORGANIZATION" | "FAMILY";
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  organizationName?: string;
  organizationHqAddress?: string;

  startDate: Date;
  moveinDate: Date;
  expiryDate?: Date;

  paymentType: "PREPAID" | "POSTPAID";

  rentalPeriod: number;
  rentalPrice: number;
  rentalIntention: string;
  deposit: number;
  depositPaid: boolean;

  electricitySetupBy: "LANDLORD" | "TENANT";
  electricityPaymentType: "RETAIL" | "FIXED";
  electricityProvider?: string;
  electricityCustomerCode?: string;
  electricityPrice?: number;
  waterSetupBy: "LANDLORD" | "TENANT";
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

  status: 'INPROGRESS' | 'END';
};

function isRentalOver(r : Rental) {
  return r.status === "END" || addMonths(new Date(r.startDate), r.rentalPeriod) < new Date();
}

export type ManagedRental = {
  rental: Rental;
  property: Property;
  unit: Unit;
  application?: Application;
};

export const rentalServices = {
  internet: "Internet",
  hygiene: "Vệ sinh",
  parking: "Bãi đậu xe",
  other: "Khác",
};

export function getRentalExpiryDate(rental: Rental): Date {
  const expiryDate = new Date(rental.startDate);
  expiryDate.setMonth(expiryDate.getMonth() + rental.rentalPeriod);
  return expiryDate;
}

export type RENTALPAYMENTSTATUS =
  | "PLAN"
  | "PENDING"
  | "ISSUED"
  | "REQUEST2PAY"
  | "PAID"
  | "CANCELLED";

export type RentalPayment = {
  id: number;
  code: string;
  rentalId: number;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  expiryDate?: Date;
  paymentDate?: Date;
  updatedBy?: string;
  note?: string;
  status: RENTALPAYMENTSTATUS;
  amount: number;
  discount?: number;
  penalty?: number;
  overdue?: boolean;
};

export const rentalPaymentStatus = {
  PLAN: "Dự toán",
  ISSUED: "Đang chờ bên thuê",
  PENDING: "Đang chờ",
  REQUEST2PAY: "Đang chờ xác nhận",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
};

const rentalPaymentReasons = {
  RENTAL: "Thuê nhà",
  DEPOSIT: "Đặt cọc",
  ELECTRICITY: "Tiền điện",
  WATER: "Tiền nước",
  SERVICE: "Dịch vụ",
  MAINTENANCE: "Bảo trì",
};

export function getRentalPaymentReason(
  payment: RentalPayment,
): keyof typeof rentalPaymentReasons {
  // payment code is in format [rentalId]_[reason]_[rest_of_the_code]
  const parts = payment.code.split("_");
  return parts[1] as keyof typeof rentalPaymentReasons;
}

export function getRentalPaymentReasonText(
  payment: RentalPayment,
  rentalServices: RentalService[],
) {
  // payment code is in format [rentalId]_[reason]_[rest_of_the_code]
  const parts = payment.code.split("_");
  if (parts[1] === "SERVICE") {
    // console.log(rentalServices, parts[2]);
    return `Dịch vụ ${
      rentalServices?.find((s) => s.id.toString() === parts[2])?.name || parts[2]
    }`;
  } else {
    return rentalPaymentReasons[parts[1] as keyof typeof rentalPaymentReasons];
  }
}

export function getTotalAmount(payment: RentalPayment): number {
  return payment.amount - (payment.discount || 0);
}

export function isOverdue(payment: RentalPayment): boolean {
  return !!payment.expiryDate || (
    ["PENDING", "ISSUED"].includes(payment.status) &&
    new Date(payment.expiryDate!) < new Date()
  );
}

export type RentalComplaint = {
  id: number;
  rentalId: number;
  creatorId: string;
  title: string;
  content: string;
  suggestion?: string;
  media: string[];
  occurredAt: Date;
  type: "REPORT" | "SUGGESTION";
  status: "PENDING" | "RESOLVED" | "CLOSED";
  replies: RentalComplaintReply[];
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
};

export type RentalComplaintReply = {
  complaintId: number;
  replierId: string;
  reply: string;
  media: string[];
  createdAt: Date;
};

export const mockedRentals = [
  {
    "id": 13,
    "creatorId": "e0a8d123-c55b-4230-91e8-bd1b7b762366",
    "propertyId": "36d7a894-bbef-4493-be14-9f4f0ca8c052",
    "unitId": "e19839d4-7512-41c0-8b74-8fe9fc6a9018",
    "applicationId": 1,
    "tenantId": "880ae376-5850-485d-8a9f-7bcd57ff8333",
    "profileImage": "https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg",
    "tenantType": "FAMILY",
    "tenantName": "Graham Gamma",
    "tenantPhone": "0942286285",
    "tenantEmail": "gamma@email.com",
    "organizationName": null,
    "organizationHqAddress": null,
    "startDate": "2024-03-07T00:00:00Z",
    "moveinDate": "2024-03-06T00:00:00Z",
    "rentalPeriod": 12,
    "paymentType": "POSTPAID",
    "rentalPrice": 1200000,
    "rentalPaymentBasis": 1,
    "rentalIntention": "TENANCY",
    "deposit": 4000000,
    "depositPaid": false,
    "electricitySetupBy": "LANDLORD",
    "electricityPaymentType": "RETAIL",
    "electricityCustomerCode": "PD11000059980",
    "electricityProvider": "EVN Hà Nội",
    "electricityPrice": null,
    "waterSetupBy": "TENANT",
    "waterPaymentType": null,
    "waterPrice": null,
    "waterCustomerCode": null,
    "waterProvider": null,
    "note": null,
    "createdAt": "2024-04-29T11:06:16.448337+07:00",
    "updatedAt": "2024-04-29T11:06:16.448337+07:00",
    "coaps": [
      {
        "rentalId": 13,
        "fullName": "Nguyen Van A",
        "dob": "2006-03-15T00:00:00Z",
        "job": "Luật sư",
        "income": 50000000,
        "email": "alpha@email.com",
        "phone": "0912142214",
        "description": "asndfjn efnjn wqnei asdf"
      },
      {
        "rentalId": 13,
        "fullName": "Nguyen Duc B",
        "dob": "2006-03-02T00:00:00Z",
        "job": "Luật sư",
        "income": 40000000,
        "email": "beta@email.com",
        "phone": "0941901190",
        "description": "sadfio qwdiqwn qwioe sndaion"
      }
    ],
    "minors": [
      {
        "rentalId": 13,
        "fullName": "Tran Van C",
        "dob": "2024-03-14T00:00:00Z",
        "email": null,
        "phone": null,
        "description": "asdf sadfnqw eqwe"
      },
      {
        "rentalId": 13,
        "fullName": "Dang Van D",
        "dob": "2024-03-21T00:00:00Z",
        "email": null,
        "phone": null,
        "description": "asdif qwei adnsfin"
      }
    ],
    "pets": [
      {
        "rental_id": 13,
        "type": "dog",
        "weight": 6,
        "description": "sadjfn asdfnna qwjne"
      },
      {
        "rental_id": 13,
        "type": "cat",
        "weight": 4,
        "description": "asdijfj qweniwq ef"
      }
    ],
    "services": [
      {
        "id": 23,
        "rental_id": 13,
        "name": "Internet",
        "setupBy": "LANDLORD",
        "provider": "FPT",
        "price": 250000
      },
      {
        "id": 24,
        "rental_id": 13,
        "name": "Bãi đậu xe",
        "setupBy": "LANDLORD",
        "provider": null,
        "price": 150000
      }
    ],
    "policies": null
  },
  {
    "id": 14,
    "creatorId": "e0a8d123-c55b-4230-91e8-bd1b7b762366",
    "propertyId": "36d7a894-bbef-4493-be14-9f4f0ca8c052",
    "unitId": "e19839d4-7512-41c0-8b74-8fe9fc6a9018",
    "applicationId": 1,
    "tenantId": "880ae376-5850-485d-8a9f-7bcd57ff8333",
    "profileImage": "https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2023/06/17/9e9b8e68ee899b038777e626e8ab6ae2_1686997946.jpg",
    "tenantType": "FAMILY",
    "tenantName": "Graham Gamma",
    "tenantPhone": "0942286285",
    "tenantEmail": "gamma@email.com",
    "organizationName": null,
    "organizationHqAddress": null,
    "startDate": "2024-03-07T00:00:00Z",
    "moveinDate": "2024-03-06T00:00:00Z",
    "rentalPeriod": 12,
    "paymentType": "POSTPAID",
    "rentalPrice": 1200000,
    "rentalPaymentBasis": 1,
    "rentalIntention": "TENANCY",
    "deposit": 4000000,
    "depositPaid": false,
    "electricitySetupBy": "LANDLORD",
    "electricityPaymentType": "RETAIL",
    "electricityCustomerCode": "PD11000059980",
    "electricityProvider": "EVN Hà Nội",
    "electricityPrice": null,
    "waterSetupBy": "TENANT",
    "waterPaymentType": null,
    "waterPrice": null,
    "waterCustomerCode": null,
    "waterProvider": null,
    "note": null,
    "createdAt": "2024-04-29T11:06:16.448337+07:00",
    "updatedAt": "2024-04-29T11:06:16.448337+07:00",
    "coaps": [
      {
        "rentalId": 13,
        "fullName": "Nguyen Van A",
        "dob": "2006-03-15T00:00:00Z",
        "job": "Luật sư",
        "income": 50000000,
        "email": "alpha@email.com",
        "phone": "0912142214",
        "description": "asndfjn efnjn wqnei asdf"
      },
      {
        "rentalId": 13,
        "fullName": "Nguyen Duc B",
        "dob": "2006-03-02T00:00:00Z",
        "job": "Luật sư",
        "income": 40000000,
        "email": "beta@email.com",
        "phone": "0941901190",
        "description": "sadfio qwdiqwn qwioe sndaion"
      }
    ],
    "minors": [
      {
        "rentalId": 13,
        "fullName": "Tran Van C",
        "dob": "2024-03-14T00:00:00Z",
        "email": null,
        "phone": null,
        "description": "asdf sadfnqw eqwe"
      },
      {
        "rentalId": 13,
        "fullName": "Dang Van D",
        "dob": "2024-03-21T00:00:00Z",
        "email": null,
        "phone": null,
        "description": "asdif qwei adnsfin"
      }
    ],
    "pets": [
      {
        "rental_id": 13,
        "type": "dog",
        "weight": 6,
        "description": "sadjfn asdfnna qwjne"
      },
      {
        "rental_id": 13,
        "type": "cat",
        "weight": 4,
        "description": "asdijfj qweniwq ef"
      }
    ],
    "services": [
      {
        "id": 23,
        "rental_id": 13,
        "name": "Internet",
        "setupBy": "LANDLORD",
        "provider": "FPT",
        "price": 250000
      },
      {
        "id": 24,
        "rental_id": 13,
        "name": "Bãi đậu xe",
        "setupBy": "LANDLORD",
        "provider": null,
        "price": 150000
      }
    ],
    "policies": null
  },
];
