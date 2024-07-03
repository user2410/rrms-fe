export type NotificationModel = {
  id: number;
  userId: string;
  title: string;
  content: string;
  seen: boolean;
  target: string;
  channel: "EMAIL" | "PUSH" | "SMS";
  data: any;
  createdAt: Date;
  updatedAt: Date;
};

export function getNotificationActionLink(n: NotificationModel): string {
  // event type =
  switch (n.data.notificationType) {
    case "CREATE_APPLICATION":
    case "UPDATE_APPLICATION":
      try {
        const applicationId = JSON.parse(n.data.applicationId);
        return `/manage/applications/application/${applicationId}`;
      } catch (e) {
        return `/manage/applications/application/${n.data.applicationId}`;
      }
    case "CREATE_PRERENTAL":
      try {
        const preRentalId = JSON.parse(n.data.prerentalId);
        return `/manage/prerentals/prerental/${preRentalId}`;
      } catch (e) {
        return `/manage/prerentals/prerental/${n.data.prerentalId}`;
      }
    case "UPDATE_PRERENTAL":
      return "#";
    case "CREATE_RENTALPAYMENT":
    case "UPDATE_RENTALPAYMENT":
    case "CREATE_CONTRACT":
    case "UPDATE_CONTRACT":
    case "CREATE_RENTALCOMPLAINT":
    case "UPDATE_RENTALCOMPLAINTSTATUS":
    case "CREATE_RENTALCOMPLAINTREPLY":
      try {
        const rentalId = JSON.parse(n.data.rentalId);
        return `/manage/rentals/rental/${rentalId}`;
      } catch (e) {
        return `/manage/rentals/rental/${n.data.rentalId}`;
      }
  }
  return "/";
}
