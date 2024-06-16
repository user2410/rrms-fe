import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRentalPaymentReasonText, getTotalAmount, RentalPayment, rentalPaymentStatus } from "@/models/rental";
import { dateDifference } from "@/utils/time";
import { addDays } from "date-fns";
import { useDataCtx } from "../../_context/data.context";
import ConfirmFinePaymentDialog from "./confirm-finepayment_dialog";
import ConfirmRequest2PayDialog from "./confirm_request2pay_dialog";
import IssueDialog from "./issue_dialog";
import PlanDialog from "./plan_dialog";
import WaitingPaymentDialog from "./waiting_payment-dialog";
import { DataTable } from "./data_table";
import { historyColumns, planPaymentsColumns, waitingConfirmationColumns, waitingPaymentsColumns } from "./columns";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";

export function PaymentTablePlan({
  payments,
}: {
  payments: RentalPayment[];
}) {
  const { isSideA, rental, property, changePayment, sessionData } = useDataCtx();
  const _isSideA = isSideA(sessionData.user.user.id);

  return (
    <div>
      <CardHeader className="px-6 py-3">
        <CardTitle className="text-lg">Khoản thu chưa xác nhận</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={payments}
          columns={planPaymentsColumns(sessionData, rental, property, changePayment)}
        />
      </CardContent>
    </div>
  );
}

export function PaymentTableWaitingForPayment({
  payments,
}: {
  payments: RentalPayment[];
}) {
  const { isSideA, rental, property, changePayment, sessionData } = useDataCtx();
  const _isSideA = isSideA(sessionData.user.user.id);

  return (
    <div>
      <CardHeader className="px-6 py-3">
        <CardTitle className="text-lg">Khoản thu chờ thanh toán</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={payments}
          columns={waitingPaymentsColumns(sessionData, rental, _isSideA, changePayment)}
        />
      </CardContent>
      <CardFooter>
        <strong>Tổng số tiền cần thanh toán:</strong>&nbsp;{` ${payments.reduce((acc, p) => acc + getTotalAmount(p, rental), 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}
      </CardFooter>
    </div>
  );
}

export function PaymentTableWaitingForConfirmation({
  payments,
}: {
  payments: RentalPayment[];
}) {
  const { isSideA, rental, property, changePayment, sessionData } = useDataCtx();
  const _isSideA = isSideA(sessionData.user.user.id);

  return (
    <div>
      <CardHeader className="px-6 py-3">
        <CardTitle className="text-lg">Khoản thu chờ xác nhận</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={payments}
          columns={waitingConfirmationColumns(sessionData, rental, _isSideA, changePayment)}
        />
      </CardContent>
    </div>
  );
}

export function PaymentTableHistory({
  payments,
}: {
  payments: RentalPayment[];
}) {
  const { rental } = useDataCtx();

  return (
    <div>
      <CardHeader className="px-6 py-3">
        <CardTitle className="text-lg">Lịch sử thu tiền</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={payments}
          columns={historyColumns(rental)}
        />
      </CardContent>
      <CardFooter>
        <strong>Tổng số tiền đã thu:&nbsp;</strong>{` ${payments.filter(p => p.status === "PAID").reduce((acc, p) => acc + p.paid, 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}
      </CardFooter>
    </div>
  );
}
