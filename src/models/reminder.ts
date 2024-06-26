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
  resourceTag: string;
  priority: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
};

export function genReminderResourceTag(resource: string, id: string | number) {
  return `[${resource}_${id}]`;
}
