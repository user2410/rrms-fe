import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Rental } from "@/models/rental";
import { readMoneyVi } from "@/utils/currency";

export default function PaymentinfoCard({
  rental
} : {
  rental: Rental;
}) {

  return (
    <Card className="pt-1">
      <CardHeader>
        <CardTitle className="text-xl">Thông tin thanh toán</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Tiền thuê nhà</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <div className="text-base font-medium">Tiền thuê nhà</div>
              <div className="text-sm font-normal">{rental.rentalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} ({readMoneyVi(rental.rentalPrice)})</div>
            </div>
            <div className="space-y-2">
              <div className="text-base font-medium">Định kì trả</div>
              <div className="text-sm font-normal">{rental.rentalPaymentBasis === 1 ? "Hàng tháng" : `Mỗi ${rental.rentalPaymentBasis} tháng`}</div>
            </div>
            <div className="space-y-2">
              <div className="text-base font-medium">Hình thức trả</div>
              <div className="text-sm font-normal">{rental.paymentType === "PREPAID" ? "Trả trước" : "Trả sau"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-base font-medium">Thời gian ân hạn</div>
              <div className="text-sm font-normal">{rental.gracePeriod} ngày</div>
            </div>
            <div className="space-y-2">
              <div className="text-base font-medium">Hình thức tính phí trễ hạn</div>
              <div className="text-sm font-normal">{rental.latePaymentPenaltyScheme === "FIXED" ? "Cố định" : rental.latePaymentPenaltyScheme === "PERCENT" ? "Phần trăm" : "Nguyên giá"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-base font-medium">Mức phạt</div>
              <div className="text-sm font-normal">{rental.latePaymentPenaltyScheme === "FIXED" ? rental.latePaymentPenaltyAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : rental.latePaymentPenaltyScheme === "PERCENT" ? `${rental.latePaymentPenaltyAmount} %` : 0}</div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Dịch vụ cơ bản</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <div className="text-base font-medium">Tiền điện</div>
              <div className="text-sm font-normal">{rental.electricitySetupBy === "TENANT" ? "Bên thuê đăng ký và đóng phí trực tiếp cho nhà cung cấp dịch vụ" : "Bên cho thuê đăng ký và thu phí từ bên thuê"}</div>
              {rental.electricitySetupBy === "LANDLORD" && (
                <div className="text-sm font-normal">Giá điện: {rental.electricityPaymentType === "RETAIL" ? "Giá bán lẻ điện sinh hoạt" : `Giá cố định hàng tháng: ${rental.electricityPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}</div>
              )}
            </div>
            <div className="space-y-2">
              <div className="text-base font-medium">Tiền nước</div>
              <div className="text-sm font-normal">{rental.waterSetupBy === "TENANT" ? "Bên thuê đăng ký và đóng phí trực tiếp cho nhà cung cấp dịch vụ" : "Bên cho thuê đăng ký và thu phí từ bên thuê"}</div>
              {rental.waterSetupBy === "LANDLORD" && (
                <div className="text-sm font-normal">Giá nước: {rental.waterPaymentType === "RETAIL" ? "Giá bán lẻ nước sinh hoạt" : `Giá cố định hàng tháng: ${rental.waterPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}</div>
              )}
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Dịch vụ khác</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Dịch vụ</TableHead>
                <TableHead className="text-center">Bên lắp đặt</TableHead>
                <TableHead className="text-center">Nhà cung cấp</TableHead>
                <TableHead className="text-center">Giá thuê hàng tháng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rental.services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Chưa có dịch vụ nào</TableCell>
                </TableRow>
              )}
              {rental.services.map((svc, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{svc.name}</TableCell>
                  <TableCell className="text-center">{svc.setupBy === "LANDLORD" ? "Bên cho thuê" : "Bên thuê"}</TableCell>
                  <TableCell className="text-center">{svc.provider ? svc.provider : "-"}</TableCell>
                  <TableCell className="text-center">{svc.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
