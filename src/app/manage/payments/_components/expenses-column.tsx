import { getPaymentGroup, getPaymentObjectID, getPaymentType, Payment } from "@/models/payment";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const expensesColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "orderId",
    header: "Mã thanh toán",
  },
  {
    header: "Dịch vụ",
    cell: ({ row }) => {
      const {orderInfo} = row.original;
      const paymentType = getPaymentType(orderInfo);
      const paymentGroup = getPaymentGroup(paymentType);
      const paymentObjectID = getPaymentObjectID(orderInfo);

      return (
        paymentGroup === "LISTING" && (
          <Link 
            href={`/manage/listings/listing/${paymentObjectID}`} 
            className="font-semibold text-blue-600 hover:underline"
          >
            Tin đăng
          </Link>
        )
      );
    },
  },
  {
    header: "Nội dung",
    cell: ({ row }) => (
      <span className="font-semibold">
        {row.original.orderInfo.slice(row.original.orderInfo.indexOf(']') + 1)}
      </span>
    ),
  },
  {
    header: "Thành tiền",
    cell: ({ row }) => (
      <span>
        {row.original.amount.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}
      </span>
    ),
  },
  {
    header: "Trạng thái",
    cell: ({ row }) => (
      <span>
        {
          row.original.status === "PENDING"
            ? "Đang chờ thanh toán"
            : row.original.status === "SUCCESS"
            && "Thanh toán thành công"
        }
      </span>
    ),
  },
  {
    header: "Hành động",
    cell: ({ row }) => (
      <Link href={`/manage/payments/payment/${row.original.id}`} className="text-blue-600 hover:underline">
        Xem chi tiết
      </Link>
    )
  },
];
