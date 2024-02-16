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
  // role: string;
};
