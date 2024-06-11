export type NotificationModel = {
  id: number;
  userId: string;
  title: string;
  content: string;
  data: any;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
};
