import { GetLocationName } from "@/utils/dghcvn";

export type User = {
  id: string,
  email: string,
  groupID: string,
  createdAt: Date,
  updatedAt: Date,
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  avatar?: string;
  role: string;
};

export function userRoleName(role?: string) : string {
  switch(role) {
    case "LANDLORD":
      return "Chủ nhà";
    case "TENANT":
      return "Người thuê";
    case "ADMIN":
      return "Quản trị viên";
    default:
      return "Khách";
  }
}

export function getFullName(user: User) : string {
  return `${user.firstName} ${user.lastName}`;
}

export function getFullAddress(user: User) : string {
  const dghc = GetLocationName(user.city || "", user.district || "", user.ward || "");
  return `${user.address}, ${dghc}`;
}
