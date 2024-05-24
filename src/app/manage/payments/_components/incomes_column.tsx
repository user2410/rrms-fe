import { getRentalPaymentReasonText, isSideA, rentalPaymentStatus } from "@/models/rental";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { RentalPaymentItem } from "./incomes_tab";
import { Session } from "next-auth";
import PlanDialog from "../../rentals/rental/[id]/_components/payments/plan_dialog";
import IssueDialog from "../../rentals/rental/[id]/_components/payments/issue_dialog";
import PaymentDialog from "../../rentals/rental/[id]/_components/payments/payment_dialog";

export function pendingPaymentsColumns(sessionData: Session, refetch: () => void): ColumnDef<RentalPaymentItem>[] {
  return ([
    {
      header: "Khách thuê",
      cell: ({ row }) => {
        const { rental } = row.original;
        return (
          <Link
            href={`/manage/rentals/rental/${rental.id}`}
            className="font-semibold text-blue-600 hover:underline"
          >
            {rental.tenantType === "ORGANIZATION" ? rental.organizationName : rental.tenantName}
          </Link>
        );
      }
    },
    {
      header: "Nhà cho thuê",
      cell: ({ row }) => {
        const { property, unit, rental } = row.original;
        return (
          <Link
            href={`/manage/rentals/rental/${rental.id}`}
            className="font-semibold text-blue-600 hover:underline"
          >
            {property.name} - {unit.name}
          </Link>
        );
      }
    },
    {
      header: "Dịch vụ",
      cell: ({ row }) => {
        const { payment, rental } = row.original;
        return (
          <span className="">{getRentalPaymentReasonText(payment, rental.services)}</span>
        );
      },
    },
    {
      header: "Số tiền",
      cell: ({ row }) => {
        const { payment } = row.original;
        return (
          <span className="">
            {payment.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}&nbsp;
            {!!payment.discount && (`(-${payment.discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })})`)}
          </span>
        );
      },
    },
    {
      header: "Trạng thái",
      cell: ({ row }) => (
        <span className="">
          {rentalPaymentStatus[row.original.payment.status]}
        </span>
      ),
    },
    {
      header: "Hành động",
      cell: ({ row }) => {
        const { payment, property, rental } = row.original;
        const _isSideA = isSideA(sessionData.user.user.id, property.managers);

        return (
          <>
            {payment.status === 'PLAN' && _isSideA ? (
              <PlanDialog
                payment={payment}
                changePayment={() => refetch()}
                sessionData={sessionData}
                rental={rental}
                property={property}
              />
            ) : payment.status === 'ISSUED' && !_isSideA ? (
              <IssueDialog
                payment={payment}
                changePayment={() => refetch()}
                sessionData={sessionData}
                rental={rental}
              />
            ) : (payment.status === 'PENDING' && !_isSideA) || (payment.status === 'REQUEST2PAY' && _isSideA) ? (
              <PaymentDialog
                payment={payment}
                isSideA={_isSideA}
                changePayment={() => refetch()}
                sessionData={sessionData}
              />
            ) : null}
          </>
        );
      },
    },
  ]);
}

export const finishedPaymentsColumns: ColumnDef<RentalPaymentItem>[] = [
  {
    header: "Khách thuê",
    cell: ({ row }) => {
      const { rental} = row.original;
      return (
        <Link
          href={`/manage/rentals/rental/${rental.id}`}
          className="font-semibold text-blue-600 hover:underline"
        >
          {rental.tenantType === "ORGANIZATION" ? rental.organizationName : rental.tenantName}
        </Link>
      );
    }
  },
  {
    header: "Nhà cho thuê",
    cell: ({ row }) => {
      const { property, unit, rental } = row.original;
      return (
        <Link
          href={`/manage/rentals/rental/${rental.id}`}
          className="font-semibold text-blue-600 hover:underline"
        >
          {property.name} - {unit.name}
        </Link>
      );
    }
  },
  {
    header: "Dịch vụ",
    cell: ({ row }) => {
      const { payment, rental } = row.original;
      return (
        <span className="">{getRentalPaymentReasonText(payment, rental.services)}</span>
      );
    },
  },
  {
    header: "Số tiền",
    cell: ({ row }) => {
      const { payment } = row.original;
      return (
        <span className="">
          {payment.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}&nbsp;
          {!!payment.discount && (`(-${payment.discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })})`)}
        </span>
      );
    },
  },
  {
    header: "Ngày thanh toán",
    cell: ({ row }) => {
      const { paymentDate } = row.original.payment;
      const paymentDateStr = (paymentDate && paymentDate?.toString() !== "0001-01-01T00:00:00Z") ? new Date(paymentDate).toLocaleDateString("vi-VN") : "";
      return (
        <span className="">
          {paymentDateStr}
        </span>
      );
    },
  },
  {
    header: "Trạng thái",
    cell: ({ row }) => (
      <span className="">
        {rentalPaymentStatus[row.original.payment.status]}
      </span>
    ),
  },
];
