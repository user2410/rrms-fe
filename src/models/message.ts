export type MsgGroupMember = {
  userId: string;
  groupId: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type MsgGroup = {
  groupId: number;
  name: string;
  createdAt: Date;
  createdBy: Date;

  members: MsgGroupMember[];
};

export type Message = {
  id: number;
  groupId: number;
  fromUser: string;
  content: string;
  status: "ACTIVE" | "DELETED";
  type: "TEXT" | "IMAGE" | "FILE";
  createdAt: Date;
  updatedAt: Date;
};

export function getApplicationMsgGroupName(applicationId: number) {
  return `APPLICATION-${applicationId}`;
}


export const mockMessages: Message[] = [
  {
    id: 1,
    groupId: 1,
    fromUser: "e0a8d123-c55b-4230-91e8-bd1b7b762366",
    content: "Message 1",
    type: "TEXT",
    createdAt: new Date("2024-03-15T03:02:15.873Z"),
    updatedAt: new Date("2024-03-15T03:02:15.873Z"),
    status: "ACTIVE",
  },
  {
    id: 2,
    groupId: 1,
    fromUser: "f47ac10b-58cc-0372-8567-0e02b2c3d479",
    content: "Message 2",
    type: "TEXT",
    createdAt: new Date("2024-02-15T03:02:15.873Z"),
    updatedAt: new Date("2024-02-15T03:02:15.873Z"),
    status: "ACTIVE",
  },
  {
    id: 3,
    groupId: 1,
    fromUser: "f47ac10b-58cc-0372-8567-0e02b2c3d479",
    content: "Message 2",
    type: "TEXT",
    createdAt: new Date("2024-02-15T03:02:15.873Z"),
    updatedAt: new Date("2024-02-15T03:02:15.873Z"),
    status: "ACTIVE",
  },
  {
    id: 4,
    groupId: 1,
    fromUser: "f47ac10b-58cc-0372-8567-0e02b2c3d479",
    content: "Message 2",
    type: "TEXT",
    createdAt: new Date("2024-02-15T03:02:15.873Z"),
    updatedAt: new Date("2024-02-15T03:02:15.873Z"),
    status: "ACTIVE",
  },
  {
    id: 5,
    groupId: 1,
    fromUser: "e0a8d123-c55b-4230-91e8-bd1b7b762366",
    content: "Message 1",
    type: "TEXT",
    createdAt: new Date("2024-03-15T03:02:15.873Z"),
    updatedAt: new Date("2024-03-15T03:02:15.873Z"),
    status: "ACTIVE",
  },
  {
    id: 6,
    groupId: 1,
    fromUser: "e0a8d123-c55b-4230-91e8-bd1b7b762366",
    content: "Message 1",
    type: "TEXT",
    createdAt: new Date("2024-03-15T03:02:15.873Z"),
    updatedAt: new Date("2024-03-15T03:02:15.873Z"),
    status: "ACTIVE",
  },
  {
    id: 7,
    groupId: 1,
    fromUser: "f47ac10b-58cc-0372-8567-0e02b2c3d479",
    content: "Message 2",
    type: "TEXT",
    createdAt: new Date("2024-02-15T03:02:15.873Z"),
    updatedAt: new Date("2024-02-15T03:02:15.873Z"),
    status: "ACTIVE",
  },
  {
    id: 8,
    groupId: 1,
    fromUser: "f47ac10b-58cc-0372-8567-0e02b2c3d479",
    content: "Message 2",
    type: "TEXT",
    createdAt: new Date("2024-02-15T03:02:15.873Z"),
    updatedAt: new Date("2024-02-15T03:02:15.873Z"),
    status: "ACTIVE",
  },
];
