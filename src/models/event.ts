export type Event = {
  id: number;
  name: string;
  description: string;
  startAt: Date;
  endAt: Date;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  status: "PENDING" | "ACTIVE" | "CANCELLED";
};
