import { Property } from "@/models/property";
import { getRentalPaymentReasonText, getTotalAmount, Rental, RentalPayment, rentalPaymentStatus } from "@/models/rental";
import { ColumnDef } from "@tanstack/react-table";
import { Session } from "next-auth";
import PlanDialog from "./plan_dialog";
import WaitingPaymentDialog from "./waiting_payment-dialog";
import { addDays } from "date-fns";
import IssueDialog from "./issue_dialog";
import ConfirmRequest2PayDialog from "./confirm_request2pay_dialog";
import ConfirmFinePaymentDialog from "./confirm-finepayment_dialog";

function basecolumns(rental: Rental): ColumnDef<RentalPayment>[] {
  return ([
    {
      accessorKey: "code",
      header: "Mã hóa đơn",
    },
    {
      header: "Dịch vụ",
      cell: ({ row }) => {
        return (
          <span>{getRentalPaymentReasonText(row.original, rental.services)}</span>
        );
      },
    },
    {
      header: "Từ ngày - đến ngày",
      cell: ({ row }) => {
        return (
          <span>{`${row.original.startDate.toLocaleDateString('vi-VN')} - ${row.original.endDate.toLocaleDateString('vi-VN')}`}</span>
        );
      },
    },
    {
      header: "Số tiền",
      cell: ({ row }) => {
        return (
          <span>{row.original.amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || "-"}</span>
        );
      },
    },
  ]);
}

export function planPaymentsColumns(
  sessionData: Session,
  rental: Rental,
  property: Property,
  changePayment: (data: RentalPayment) => void,
): ColumnDef<RentalPayment>[] {
  return ([
    ...basecolumns(rental),
    {
      header: "Trạng thái",
      cell: ({ row }) => {
        return (
          <span>{
            (row.original.status === "PLAN" && !!row.original.note)
            ? "Yêu cầu xem xét lại"
            : rentalPaymentStatus[row.original.status]
          }</span>
        );
      },
    },
    {
      header: "Thao tác",
      cell: ({ row }) => (
        <PlanDialog
          payment={row.original}
          changePayment={changePayment}
          sessionData={sessionData}
          rental={rental}
          property={property}
        />
      )
    },
  ]);
}

export function waitingPaymentsColumns(
  sessionData: Session,
  rental: Rental,
  isSideA: boolean,
  changePayment: (data: RentalPayment) => void,
): ColumnDef<RentalPayment>[] {
  const cols: ColumnDef<RentalPayment>[] = ([
    ...basecolumns(rental),
    {
      header: "Hạn thanh toán",
      cell: ({ row }) => {
        return (
          <span>{row.original.expiryDate!.toLocaleDateString("vi-VN")} <br /> (ân hạn {addDays(row.original.expiryDate!, rental.gracePeriod).toLocaleDateString("vi-VN")})</span>
        );
      },
    },
    {
      header: "Khấu trừ",
      cell: ({ row }) => {
        return (
          <span>{row.original.discount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || "-"}</span>
        );
      },
    },
    {
      header: "Đã thanh toán",
      cell: ({ row }) => {
        return (
          <span>{row.original.paid.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || "-"}</span>
        );
      },
    },
    {
      header: "Phải thanh toán",
      cell: ({ row }) => {
        return (
          <span>{getTotalAmount(row.original, rental).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
        );
      },
    },
    {
      header: "Trạng thái",
      cell: ({ row }) => {
        return (
          <span>{rentalPaymentStatus[row.original.status]}</span>
        );
      },
    },
  ]);

  if (!isSideA) {
    return ([...cols,
    {
      header: "Thao tác",
      cell: ({ row }) => (
        <WaitingPaymentDialog
          payment={row.original}
          changePayment={changePayment}
          sessionData={sessionData}
          rental={rental}
        />
      )
    }]);
  }
  return cols;
}

export function waitingConfirmationColumns(
  sessionData: Session,
  rental: Rental,
  isSideA: boolean,
  changePayment: (data: RentalPayment) => void,
): ColumnDef<RentalPayment>[] {
  return ([
    ...basecolumns(rental),
    {
      header: "Khấu trừ",
      cell: ({ row }) => {
        return (
          <span>{row.original.discount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || "-"}</span>
        );
      },
    },
    {
      header: "Trạng thái",
      cell: ({ row }) => {
        return (
          <span>{rentalPaymentStatus[row.original.status]}</span>
        );
      },
    },
    {
      header: "Thao tác",
      cell: ({ row }) => (
        (!isSideA && row.original.status === "ISSUED") ? (
          <IssueDialog
            payment={row.original}
            changePayment={changePayment}
            sessionData={sessionData}
            rental={rental}
          />
        ) : (isSideA && row.original.status === "REQUEST2PAY") ? (
          <ConfirmRequest2PayDialog
            payment={row.original}
            changePayment={changePayment}
            sessionData={sessionData}
            rental={rental}
          />
        ) : ((isSideA && row.original.status === "PAYFINE") && (
          <ConfirmFinePaymentDialog
            payment={row.original}
            changePayment={changePayment}
            sessionData={sessionData}
            rental={rental}
          />
        ))
      )
    },
  ]);
}

export function historyColumns(
  rental: Rental,
): ColumnDef<RentalPayment>[] {
  return ([
    ...basecolumns(rental),
    {
      header: "Khấu trừ",
      cell: ({ row }) => {
        return (
          <span>{row.original.discount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || "-"}</span>
        );
      },
    },
    {
      header: "Tiền phạt",
      cell: ({ row }) => {
        return (
          <span>{row.original.fine?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || "-"}</span>
        );
      },
    },
    {
      header: "Đã thanh toán",
      cell: ({ row }) => {
        return (
          <span>{row.original.paid.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || "-"}</span>
        );
      },
    },
    {
      header: "Trạng thái",
      cell: ({ row }) => {
        return (
          <span>{rentalPaymentStatus[row.original.status]}</span>
        );
      },
    },
  ]);
}
