export type PaymentItem = {
  payment_id: number;
  name: string;
  price: number;
  quantity: number;
  discount: number;
};

export type Payment = {
  id: number;
  userID: string;
  orderID: string;
  orderInfo: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
  items: PaymentItem[];
};
