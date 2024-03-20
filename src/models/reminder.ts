export type Reminder = {
  id: number;
  creatorId: string;
  title: string;
  startAt: Date;
  endAt: Date;
  note: string;
  recurrenceDay: number;
  recurrenceMonth: number;
  recurrenceMode: 'NONE' | 'WEEKLY' | 'MONTHLY';
  priority: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'PENDING' | 'INPROGRESS' | 'COMPLETED' | 'CANCELLED';
};
