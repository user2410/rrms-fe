import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRentalPaymentReasonText, getTotalAmount, RentalPayment, rentalPaymentStatus } from "@/models/rental";
import { useDataCtx } from "../../_context/data.context";
import IssueDialog from "./issue_dialog";
import PaymentDialog from "./payment_dialog";
import PlanDialog from "./plan_dialog";
import { dateDifference } from "@/utils/time";

const statusTitle = {
  'PLAN': 'Khoản thu chưa xác nhận',
  'PENDING': 'Khoản thu chờ thanh toán',
  'ISSUED': 'Khoản thu chờ xác nhận',
  'PAID': 'Khoản thu đã thanh toán',
  'CANCELLED': 'Khoản thu đã hủy',
};
export default function PaymentTable({
  payments,
  status,
}: {
  payments: RentalPayment[];
  status: 'PLAN' | "ISSUED" | 'PENDING' | 'PAID';
}) {
  const { isSideA, rental, sessionData } = useDataCtx();
  const _isSideA = isSideA(sessionData.user.user.id);
  return (
    <>
      <CardHeader className="px-6 py-3">
        <CardTitle className="text-lg">
          {status === "PAID" ? "Lịch sử thu tiền" : statusTitle[status]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã hóa đơn</TableHead>
              <TableHead>Dịch vụ</TableHead>
              <TableHead>Từ ngày - đến ngày</TableHead>
              {['PAID', 'CANCELLED'].includes(status) && (
                <TableHead>Ngày thanh toán</TableHead>
              )}
              <TableHead>Số tiền</TableHead>
              {['PENDING', 'ISSUED'].includes(status) && (<TableHead>Khấu trừ</TableHead>)}
              {status ==="PAID" && (
                <TableHead>Tiền Phạt</TableHead>
              )}
              <TableHead>Trạng thái</TableHead>
              {!['PAID', 'CANCELLED'].includes(status) && (
                <TableHead>Thao tác</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Không có khoản thu nào</TableCell>
              </TableRow>
            ) : payments.map((p, i) => (
              <TableRow key={i} className={p.overdue ? "bg-red-300" : ""}>
                <TableCell className="font-medium">{p.code}</TableCell>
                <TableCell>{getRentalPaymentReasonText(p, rental.services)}</TableCell>
                <TableCell>{p.startDate.toLocaleDateString('vi-VN')} - {p.endDate.toLocaleDateString('vi-VN')}</TableCell>
                {['PAID', 'CANCELLED'].includes(status) && (
                  <TableCell>{p.paymentDate?.toLocaleDateString('vi-VN')} {(p.paymentDate && p.expiryDate && 
                    p.paymentDate > p.expiryDate) ? `(Muộn ${dateDifference(p.paymentDate, p.expiryDate)})` : ''}</TableCell>
                )}
                <TableCell>{p.amount > 0 ? p.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : "-"}</TableCell>
                {!['PLAN', 'PAID'].includes(p.status) && (
                  <TableCell>{p.discount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                )}
                {(p.status ==="PAID" && p.paymentDate && p.expiryDate && p.paymentDate > p.expiryDate) && (
                  <TableCell>{p.penalty ? p.penalty.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : "-"}</TableCell>
                )}p.paymentDate && p.expiryDate
                <TableCell>{rentalPaymentStatus[p.status]}</TableCell>
                {!['PAID', 'CANCELLED'].includes(status) && (
                  <TableCell>
                    {p.status === 'PLAN' && _isSideA ? (
                      <PlanDialog payment={p} />
                    ) : p.status === 'ISSUED' && !_isSideA ? (
                      <IssueDialog payment={p} />
                    ) : (p.status === 'PENDING' && !_isSideA) || (p.status === 'REQUEST2PAY' && _isSideA) ? (
                      <PaymentDialog payment={p} isSideA={_isSideA} />
                    ) : null}
                  </TableCell>
                )}
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
      </CardContent>
      {status === "PENDING" ? (
        <CardFooter>
          <strong>Tổng số tiền cần thanh toán:</strong>{` ${payments.reduce((acc, p) => acc + getTotalAmount(p), 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}
        </CardFooter>
      ) : status === "PAID" ? (
        <CardFooter>
          <strong>Tổng số tiền đã thu:</strong>{` ${payments.filter(p => p.status === "PAID").reduce((acc, p) => acc + getTotalAmount(p), 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}
        </CardFooter>
      ) : null}
    </>
  );
};
