import { Contract } from "@/models/contract";
import { getPropertyFullAddress } from "@/models/property";
import { uAmenities } from "@/models/unit";
import { readMoneyVi, readNumberVi } from "@/utils/currency";
import { addMonths } from "date-fns";
import { forwardRef, ReactNode } from "react";
import { RentalData } from "../../_context/data.context";

type Props = {
  children?: ReactNode;
  className?: string;
  contract: Contract;
  data: RentalData;
}

const placeholder = ".................................";

const OfficeTemplate = forwardRef<HTMLDivElement, Props>(function Render(props, ref) {
  const today = new Date();
  const { contract, data } = props;
  const startDate = new Date(data.rental.startDate);
  const propertyAddress = getPropertyFullAddress(data.property);
  const amenities = data.unit.amenities.map((a) => uAmenities.find(ua => ua.id.toString() === a.amenityId.toString())?.text).join(', ');
  const aDob = new Date(contract.aDob).toLocaleDateString('vi-VN');
  const aIdentityIssuedAt = new Date(contract.aIdentityIssuedAt).toLocaleDateString('vi-VN');
  const bDob = contract.bDob ? new Date(contract.bDob).toLocaleDateString('vi-VN') : placeholder;
  const bIdentityIssuedAt = contract.bIdentityIssuedAt ? new Date(contract.bIdentityIssuedAt).toLocaleDateString('vi-VN') : placeholder;
  const bOrganizationCodeIssuedAt = contract.bOrganizationCodeIssuedAt ? new Date(contract.bOrganizationCodeIssuedAt).toLocaleDateString('vi-VN') : placeholder;

  return (
    <div ref={ref} className={props.className}>
      <p className="ql-align-center"><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></p>
      <p className="ql-align-center"><strong><u>Độc lập - Tự do - Hạnh phúc</u></strong></p>
      <p className="ql-align-center"><br/></p>
      <p className="ql-align-right"><em>{contract.createdAtPlace}, ngày {today.getDate()} tháng {today.getMonth()} năm {today.getFullYear()}</em></p>
      <p className="ql-align-center"><strong>HỢP ĐỒNG THUÊ VĂN PHÒNG</strong></p>
      <p className="ql-align-center"><em>Số: ...../...../HĐTN</em></p>
      <p><em>Hôm nay, ngày {today.getDate()} tháng {today.getMonth()} năm {today.getFullYear()}, tại ......................................</em></p>
      <p><strong>Chúng tôi gồm có:</strong></p>
      <p><strong>BÊN CHO THUÊ (BÊN A):</strong></p>
      <p>Ông/bà: {contract.aFullName} Sinh ngày: {aDob}</p>
      <p>CMND/CCCD số: {contract.aIdentity} Ngày cấp: {aIdentityIssuedAt} Nơi cấp: {contract.aIdentityIssuedBy}</p>
      <p>Địa chỉ thường trú: {contract.aAddress}</p>
      <p>Hộ khẩu: {contract.aHouseholdRegistration}</p>
      <p>Điện thoại: {contract.aPhone}</p>
      <p>Số tài khoản: {contract.aBankAccount || placeholder} mở tại ngân hàng: {contract.aBank || placeholder}</p>
      <p>Là chủ sở hữu nhà ở theo Giấy chứng nhận quyền sở hữu nhà số: {contract.aRegistrationNumber}</p>
      <p><strong>BÊN THUÊ (BÊN B):</strong></p>thuộc
      <p>Công ty {contract.bOrganizationName || placeholder}</p>
      <p>Địa chỉ trụ sở: {contract.bOrganizationHqAddress || placeholder}</p>
      <p>Mã số doanh nghiệp: {contract.bOrganizationCode || placeholder} cấp ngày: {bOrganizationCodeIssuedAt} nơi cấp: {contract.bOrganizationCodeIssuedBy || placeholder}</p>
      <p>Đại diện theo pháp luật: {data.rental.tenantName}</p>
      <p>CMND/CCCD số: {contract.bIdentity} Ngày cấp: {bIdentityIssuedAt} Nơi cấp: {contract.bIdentityIssuedBy}</p>
      <p>Địa chỉ: {contract.bAddress}</p>
      <p>Hộ khẩu: {contract.aHouseholdRegistration}</p>
      <p>Điện thoại: {data.rental.tenantPhone} </p>
      <p><strong>Hai bên cùng thỏa thuận ký hợp đồng với những nội dung sau:</strong></p>
      <p><strong>ĐIỀU 1. ĐỐI TƯỢNG CỦA HỢP ĐỒNG</strong></p>
      <p>Đối tượng của hợp đồng này là ngôi nhà số: {propertyAddress.slice(0, propertyAddress.indexOf(','))}</p>
      <p>- Địa chỉ: {propertyAddress}</p>
      <p>- Tổng diện tích sử dụng: {data.unit.area} m2</p>
      <p>- Trang thiết bị chủ yếu gắn liền với nhà (nếu có): {amenities}</p>
      <p><strong>ĐIỀU 2. GIÁ CHO THUÊ VÀ PHƯƠNG THỨC THANH TOÁN</strong></p>
      <p>2.1. Giá cho thuê nhà là {data.rental.rentalPrice} VNĐ/tháng&nbsp;(Bằng chữ:{readMoneyVi(data.rental.rentalPrice)})</p>
      <p>Giá cho thuê này đã bao gồm các chi phí về quản lý, bảo trì và vận hành nhà.</p>
      <p>2.2. Các chi phí sử dụng điện, nước, điện thoại và các dịch vụ khác do bên B thanh toán cho bên cung cấp điện, nước, điện thoại và các cơ quan quản lý dịch vụ.</p>
      <p>2.3. Phương thức thanh toán: Tiền mặt hoặc chuyển khoản, trả vào ngày {contract.paymentDay} hàng tháng.</p>
      <p><strong>ĐIỀU 3. THỜI HẠN THUÊ, THỜI ĐIỂM GIAO NHẬN NHÀ Ở, MỤC ĐÍCH THUÊ</strong></p>
      <p>3.1. Thời hạn thuê ngôi nhà nêu trên là {data.rental.rentalPeriod} tháng kể từ {startDate.getDay()} tháng {startDate.getMonth()} năm {startDate.getFullYear()}</p>
      <p>3.2. Thời điểm giao nhận nhà ở là ngày {startDate.getDay()} tháng {startDate.getMonth()} năm {startDate.getFullYear()}</p>
      <p>3.2. Mục đích thuê: làm trụ sở chính của Công ty {contract.bOrganizationName || placeholder}</p>
      <p><strong>ĐIỀU 4. QUYỀN VÀ NGHĨA VỤ CỦA BÊN A</strong></p>
      <p><strong>4.1. Nghĩa vụ</strong></p>
      <p>a) Giao nhà ở và trang thiết bị gắn liền với nhà (nếu có) cho bên B theo đúng hợp đồng.</p>
      <p>b) Bảo đảm cho bên B sử dụng ổn định nhà trong thời hạn thuê;</p>
      <p>c) Bảo dưỡng, sửa chữa nhà theo định kỳ hoặc theo thỏa thuận; nếu bên A không bảo dưỡng, sửa chữa nhà mà gây thiệt hại cho bên B, thì phải bồi thường;</p>
      <p>d) Tạo điều kiện cho bên B sử dụng thuận tiện diện tích thuê;</p>
      <p>e) Nộp các khoản thuế về nhà và đất (nếu có); Xuất hoá đơn giá trị gia tăng theo yêu cầu của bên thuê (nếu có).</p>
      <p><strong>4.2. Quyền lợi</strong></p>
      <p>a) Yêu cầu bên B trả đủ tiền thuê nhà đúng kỳ hạn như đã thỏa thuận;</p>
      <p>b) Yêu cầu bên B có trách nhiệm trong việc sửa chữa phần hư hỏng, bồi thường thiệt hại do lỗi của bên B gây ra khi kết thúc hợp đồng.</p>
      <p>c) Đơn phương chấm dứt thực hiện hợp đồng thuê nhà nhưng phải báo cho bên B biết trước ít nhất 30 ngày nếu không có thỏa thuận khác và yêu cầu bồi thường thiệt hại nếu bên B có một trong các hành vi sau đây:</p>
      <p>- Không trả tiền thuê nhà liên tiếp trong ba tháng trở lên mà không có lý do chính đáng;</p>
      <p>- Sử dụng nhà không đúng mục đích thuê như đã thỏa thuận trong hợp đồng;</p>
      <p>- Bên B tự ý đục phá, cơi nới, cải tạo, phá dỡ nhà ở đang thuê;</p>
      <p>- Bên B chuyển đổi, cho mượn, cho thuê lại nhà ở đang thuê mà không có sự đồng ý của bên A;</p>
      <p>- Bên B làm mất trật tự, vệ sinh môi trường, ảnh hưởng nghiêm trọng đến sinh hoạt của những người xung quanh đã được bên A hoặc tổ trưởng tổ dân phố, công an phường lập biên bản đến lần thứ ba mà vẫn không khắc phục.</p>
      <p><strong>ĐIỀU 5. QUYỀN VÀ NGHĨA VỤ CỦA BÊN B:</strong></p>
      <p><strong>5.1. Nghĩa vụ</strong></p>
      <p>a) Sử dụng nhà đúng mục đích đã thỏa thuận, giữ gìn nhà ở và có trách nhiệm trong việc sửa chữa những hư hỏng do mình gây ra;</p>
      <p>b) Trả đủ tiền thuê nhà đúng kỳ hạn đã thỏa thuận;</p>
      <p>c) Trả tiền điện, nước, điện thoại, vệ sinh và các chi phí phát sinh khác trong thời gian thuê nhà;</p>
      <p>d) Trả nhà cho bên A theo đúng thỏa thuận.</p>
      <p>e) Chấp hành đầy đủ những quy định về quản lý sử dụng nhà ở;</p>
      <p>f) Không được chuyển nhượng hợp đồng thuê nhà hoặc cho người khác thuê lại trừ trường hợp được bên A đồng ý bằng văn bản;</p>
      <p>g) Chấp hành các quy định về giữ gìn vệ sinh môi trường và an ninh trật tự trong khu vực cư trú;</p>
      <p>h) Giao lại nhà cho bên A trong các trường hợp chấm dứt hợp đồng quy định tại hợp đồng này.</p>
      <p><strong>5.2. Quyền lợi</strong></p>
      <p>a) Nhận nhà ở và trang thiết bị gắn liền (nếu có) theo đúng thoả thuận;</p>
      <p>b) Được cho thuê lại nhà đang thuê, nếu được bên cho thuê đồng ý bằng văn bản;</p>
      <p>c) Yêu cầu bên A sửa chữa nhà đang cho thuê trong trường hợp nhà bị hư hỏng nặng;</p>
      <p>d) Được ưu tiên ký hợp đồng thuê tiếp, nếu đã hết hạn thuê mà nhà vẫn dùng để cho thuê;</p>
      <p>e) Đơn phương chấm dứt thực hiện hợp đồng thuê nhà nhưng phải báo cho bên A biết trước ít nhất 30 ngày nếu không có thỏa thuận khác và yêu cầu bồi thường thiệt hại nếu bên A có một trong các hành vi sau đây:</p>
      <p>- Không sửa chữa nhà ở khi có hư hỏng nặng mặc dù bên B đã yêu cầu bằng văn bản;</p>
      <p>- Tăng giá thuê nhà ở bất hợp lý hoặc tăng giá thuê mà không thông báo cho bên thuê nhà ở biết trước theo thỏa thuận;
      </p>
      <p>- Quyền sử dụng nhà ở bị hạn chế do lợi ích của người thứ ba.</p>
      <p><strong>ĐIỀU 6. TRÁCH NHIỆM DO VI PHẠM HỢP ĐỒNG</strong></p>
      <p>Trong quá trình thực hiện hợp đồng mà phát sinh tranh chấp, các bên cùng nhau thương lượng giải quyết; trong trường hợp không tự giải quyết được, cần phải thực hiện bằng cách hòa giải; nếu hòa giải không thành thì đưa ra Tòa án có thẩm quyền theo quy định của pháp luật.</p>
      <p><strong>ĐIỀU 7. CÁC THỎA THUẬN KHÁC</strong></p>
      <p>- Việc sửa đổi, bổ sung hoặc hủy bỏ hợp đồng này phải được lập thành văn bản và có chữ ký của hai bên.</p>
      <p>- Hợp đồng thuê nhà này sẽ chỉ chấm dứt trong những trường hợp sau:</p>
      <p>a) Khi hết thời hạn mà không có thoả thuận gia hạn hợp đồng thuê theo quy định tại Điều 3.1 hợp đồng này;</p>
      <p>b) Tài sản thuê bị phá huỷ và hoàn toàn không thể sử dụng được;</p>
      <p>c) Bên thuê bị phá sản;</p>
      <p>d) Nếu Bên cho thuê quyết định chấm dứt Hợp đồng thuê trong trường hợp Bên thuê vi phạm hợp đồng theo khoản c điều 4.2 hợp đồng này.</p>
      <p>e) Trong trường hợp bất khả kháng theo quy định của pháp luật.</p>
      <p><strong>ĐIỀU 8. CAM KẾT CỦA CÁC BÊN</strong></p>
      <p>Bên A và bên B chịu trách nhiệm trước pháp luật về những lời cùng cam kết sau đây:</p>
      <p>1. Đã khai đúng sự thật và tự chịu trách nhiệm về tính chính xác của những thông tin về nhân thân đã ghi trong hợp đồng này.</p>
      <p>2. Thực hiện đúng và đầy đủ tất cả những thỏa thuận đã ghi trong Hợp đồng này; nếu bên nào vi phạm mà gây thiệt hại, thì phải bồi thường cho bên kia hoặc cho người thứ ba (nếu có).</p>
      <p>3. Trong quá trình thực hiện nếu phát hiện thấy những vấn đề cần thoả thuận thì hai bên có thể lập thêm Phụ lục Hợp đồng. Nội dung Phụ lục Hợp đồng có giá trị pháp lý như Hợp đồng chính.</p>
      <p>4. Hợp đồng này có giá trị kể từ ngày hai bên ký kết.</p>
      <p><strong>ĐIỀU 9. ĐIỀU KHOẢN CUỐI CÙNG</strong></p>
      <p>1. Hai bên đã hiểu rõ quyền, nghĩa vụ và lợi ích hợp pháp của mình, ý nghĩa và hậu quả pháp lý của việc công chứng (chứng thực) này, sau khi đã được nghe lời giải thích của người có thẩm quyền công chứng hoặc chứng thực dưới đây.</p>
      <p>2. Hai bên đã tự đọc lại hợp đồng này, đã hiểu và đồng ý tất cả các điều khoản ghi trong hợp đồng này.</p>
      <p>Hợp đồng được lập thành {contract.nCopies} ({readNumberVi(contract.nCopies)}) bản, mỗi bên giữ một bản và có giá trị như nhau.</p>
      <p><br/></p>

    </div>
  );
});

export default OfficeTemplate;
