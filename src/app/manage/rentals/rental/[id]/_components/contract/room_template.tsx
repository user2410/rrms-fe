import { getPropertyFullAddress } from "@/models/property";
import { forwardRef, ReactNode } from "react";
import { RentalData } from "../../_context/data.context";
import { ContractAFormValues } from "./create_contract_a";
import { readMoneyVi, readNumberVi } from "@/utils/currency";
import { Contract, paymentMethods } from "@/models/contract";
import { ContractFormValues } from "./contract_data";

type Props = {
  children?: ReactNode;
  className?: string;
  contract: Contract;
  data: RentalData;
}

const placeholder = ".................................";

const RoomTemplate = forwardRef<HTMLDivElement, Props>(function Render(props, ref) {
  const today = new Date();
  const {contract, data} = props;
  
  const aDob = new Date(contract.aDob).toLocaleDateString('vi-VN');
  const aIdentityIssuedAt = new Date(contract.aIdentityIssuedAt).toLocaleDateString('vi-VN');
  const bDob = contract.bDob ? new Date(contract.bDob).toLocaleDateString('vi-VN') : placeholder;
  const bIdentityIssuedAt = contract.bIdentityIssuedAt ? new Date(contract.bIdentityIssuedAt).toLocaleDateString('vi-VN') : placeholder;
  const bOrganizationCodeIssuedAt = contract.bOrganizationCodeIssuedAt ? new Date(contract.bOrganizationCodeIssuedAt).toLocaleDateString('vi-VN') : placeholder;


  const startDate = new Date(data.rental.startDate);
  const propertyAddress = getPropertyFullAddress(data.property);

  return (
    <div ref={ref} className={props.className}>
      <p className="ql-align-center"><strong>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></p>
      <p className="ql-align-center"><strong><u>Độc lập - Tự do - Hạnh phúc</u></strong></p>
      <p className="ql-align-center"><br/></p>
      <p className="ql-align-center"><strong>HỢP ĐỒNG THUÊ NHÀ TRỌ</strong></p>
      <p className="ql-align-center"><em>(Số: ................/HĐTNO)</em></p>
      <p><em>Hôm nay, ngày {today.getDate()} tháng {today.getMonth()} năm {today.getFullYear()}, tại {contract.createdAtPlace} Chúng tôi gồm có:</em></p>
      <p><strong>BÊN CHO THUÊ (BÊN A):</strong></p>
      <p>Ông/bà: {contract.aFullName}. Ngày sinh: {aDob}</p>
      <p>CMND/CCCD số: {contract.aIdentity} Ngày cấp: {aIdentityIssuedAt} Nơi cấp: {contract.aIdentityIssuedBy}</p>
      <p>Hộ khẩu: {contract.aHouseholdRegistration}</p>
      <p>Địa chỉ: {contract.aAddress}</p>
      <p>Điện thoại: {contract.aPhone}</p>
      <p>Là chủ sở hữu nhà ở: {propertyAddress}</p>
      <p>Các chứng từ sở hữu và tham khảo về nhà ở đã được cơ quan có thẩm quyền cấp cho Bên A gồm có:</p>
      {contract.aDocuments.map((doc, index) => (
        <p key={index}>- {doc}</p>
      ))}
      <p><strong>BÊN THUÊ (BÊN B):</strong></p>
      <p>Ông/bà: {data.rental.tenantName}. Ngày sinh: {bDob}</p>
      <p>CMND/CCCD số: {contract.bIdentity} Ngày cấp: {bIdentityIssuedAt} Nơi cấp: {contract.bIdentityIssuedBy}</p>
      <p>Hộ khẩu: {contract.bHouseholdRegistration}</p>
      <p>Địa chỉ: {contract.bAddress}</p>
      <p>Điện thoại: {data.rental.tenantPhone}</p>
      <p>Mã số thuế: {contract.bTaxCode}</p>
      <p>Tài khoản số: {contract.bBankAccount || contract.bBankAccount} Mở tại ngân hàng: {contract.bBank}</p>
      <p><strong>Hai bên cùng thỏa thuận ký hợp đồng với những nội dung sau:</strong></p>
      <p><strong>ĐIỀU 1. ĐỐI TƯỢNG CỦA HỢP ĐỒNG</strong></p>
      <p>Bên A&nbsp;đồng ý cho&nbsp;Bên B&nbsp;thuê căn hộ (căn nhà) tại địa chỉ {propertyAddress} thuộc sở hữu hợp pháp của&nbsp;Bên A.</p>
      <p>Chi tiết căn hộ như sau:</p>
      <p>Bao gồm: Ban công, hệ thống điện nước đã sẵn sàng sử dụng được, các bóng đèn trong các phòng và hệ thống công tắc, các bồn rửa mặt, bồn vệ sinh đều sử dụng tốt.</p>
      <p><strong>ĐIỀU 2.&nbsp;GIÁ CHO THUÊ NHÀ Ở VÀ PHƯƠNG THỨC THANH TOÁN</strong></p>
      <p>2.1. Giá cho thuê nhà ở là {data.rental.rentalPrice} VNĐ/tháng&nbsp;(Bằng chữ:{readMoneyVi(data.rental.rentalPrice)})</p>
      <p>Giá cho thuê này đã bao gồm các chi phí về quản lý, bảo trì và vận hành nhà ở.</p>
      <p>2.2. Các chi phí sử dụng điện, nước, điện thoại và các dịch vụ khác do bên B thanh toán cho bên cung cấp điện, nước, điện thoại và các cơ quan quản lý dịch vụ.</p>
      <p>2.3. Phương thức thanh toán: bằng {paymentMethods[contract.paymentMethod as keyof typeof paymentMethods]}, trả vào ngày {contract.paymentDay} hàng tháng.</p>
      <p><strong>ĐIỀU 3. THỜI HẠN THUÊ VÀ THỜI ĐIỂM GIAO NHẬN NHÀ Ở</strong></p>
      <p>3.1. Thời hạn thuê ngôi nhà nêu trên là {data.rental.rentalPeriod} tháng kể từ {startDate.getDay()} tháng {startDate.getMonth()} năm {startDate.getFullYear()}</p>
      <p>3.2. Thời điểm giao nhận nhà ở là ngày {startDate.getDay()} tháng {startDate.getMonth()} năm {startDate.getFullYear()}</p>
      <p><strong>ĐIỀU 4. NGHĨA VỤ VÀ QUYỀN CỦA BÊN A</strong></p>
      <p>4.1. Nghĩa vụ của bên A:</p>
      <p>a) Giao nhà ở và trang thiết bị gắn liền với nhà ở (nếu có) cho bên B theo đúng hợp đồng;</p>
      <p>b) Phổ biến cho bên B quy định về quản lý sử dụng nhà ở;</p>
      <p>c) Bảo đảm cho bên B sử dụng ổn định nhà trong thời hạn thuê;</p>
      <p>d) Bảo dưỡng, sửa chữa nhà theo định kỳ hoặc theo thỏa thuận; nếu bên A không bảo dưỡng, sửa chữa nhà mà gây thiệt hại cho bên B, thì phải bồi thường;</p>
      <p>e) Tạo điều kiện cho bên B sử dụng thuận tiện diện tích thuê;</p>
      <p>f) Nộp các khoản thuế về nhà và đất (nếu có);</p>
      <p>g) Hướng dẫn, đôn đốc bên B thực hiện đúng các quy định về đăng ký tạm trú.</p>
      <p>4.2. Quyền của bên A:</p>
      <p>a) Yêu cầu bên B trả đủ tiền thuê nhà đúng kỳ hạn như đã thỏa thuận;</p>
      <p>b) Trường hợp chưa hết hạn hợp đồng mà bên A cải tạo nhà ở và được bên B đồng ý thì bên A được quyền điều chỉnh giá cho thuê nhà ở. Giá cho thuê nhà ở mới do các bên thoả thuận; trong trường hợp không thoả thuận được thì bên A có quyền đơn phương chấm dứt hợp đồng thuê nhà ở và phải bồi thường cho bên B theo quy định của pháp luật;</p>
      <p>c) Yêu cầu bên B có trách nhiệm trong việc sửa chữa phần hư hỏng, bồi thường thiệt hại do lỗi của bên B gây ra;</p>
      <p>d) Cải tạo, nâng cấp nhà cho thuê khi được bên B đồng ý, nhưng không được gây phiền hà cho bên B sử dụng chỗ ở;</p>
      <p>e) Được lấy lại nhà cho thuê khi hết hạn hợp đồng thuê, nếu hợp đồng không quy định thời hạn thuê thì bên cho thuê muốn lấy lại nhà phải báo cho bên thuê biết trước ........ ngày;</p>
      <p>f) Đơn phương chấm dứt thực hiện hợp đồng thuê nhà nhưng phải báo cho bên B biết trước ít nhất ...... ngày nếu không có thỏa thuận khác và yêu cầu bồi thường thiệt hại nếu bên B có một trong các hành vi sau đây:</p>
      <p>- Không trả tiền thuê nhà liên tiếp trong ...... trở lên mà không có lý do chính đáng;</p>
      <p>- Sử dụng nhà không đúng mục đích thuê như đã thỏa thuận trong hợp đồng;</p>
      <p>- Tự ý đục phá, cơi nới, cải tạo, phá dỡ nhà ở đang thuê;</p>
      <p>- Bên B chuyển đổi, cho mượn, cho thuê lại nhà ở đang thuê mà không có sự đồng ý của bên A;</p>
      <p>- Làm mất trật tự, vệ sinh môi trường, ảnh hưởng nghiêm trọng đến sinh hoạt của những người xung quanh đã được bên A
        hoặc tổ trưởng tổ dân phố nhắc nhở mà vẫn không khắc phục;</p>
      <p>- Thuộc trường hợp khác theo quy định của pháp luật.</p>
      <p><strong>ĐIỀU 5. NGHĨA VỤ VÀ QUYỀN CỦA BÊN B</strong></p>
      <p><strong>5.1. Nghĩa vụ của bên B:</strong></p>
      <p>a) Sử dụng nhà đúng mục đích đã thỏa thuận, giữ gìn nhà ở và có trách nhiệm trong việc sửa chữa những hư hỏng do mình gây ra;</p>
      <p>b) Trả đủ tiền thuê nhà đúng kỳ hạn đã thỏa thuận;</p>
      <p>c) Trả tiền điện, nước, điện thoại, vệ sinh và các chi phí phát sinh khác trong thời gian thuê nhà;</p>
      <p>d) Trả nhà cho bên A theo đúng thỏa thuận.</p>
      <p>e) Chấp hành đầy đủ những quy định về quản lý sử dụng nhà ở;</p>
      <p>f) Không được chuyển nhượng hợp đồng thuê nhà hoặc cho người khác thuê lại trừ trường hợp được bên A đồng ý bằng văn
        bản;</p>
      <p>g) Chấp hành các quy định về giữ gìn vệ sinh môi trường và an ninh trật tự trong khu vực cư trú;</p>
      <p>h) Giao lại nhà cho bên A trong các trường hợp chấm dứt hợp đồng.</p>
      <p><strong>5.2. Quyền của bên B:</strong></p>
      <p>a) Nhận nhà ở và trang thiết bị gắn liền (nếu có) theo đúng thoả thuận;</p>
      <p>b) Được đổi nhà đang thuê với bên thuê khác, nếu được bên A đồng ý bằng văn bản;</p>
      <p>c) Được cho thuê lại nhà đang thuê, nếu được bên cho thuê đồng ý bằng văn bản;</p>
      <p>d) Được thay đổi cấu trúc ngôi nhà nếu được bên A đồng ý bằng văn bản;</p>
      <p>e) Yêu cầu bên A sửa chữa nhà đang cho thuê trong trường hợp nhà bị hư hỏng nặng;</p>
      <p>g) Được ưu tiên ký hợp đồng thuê tiếp, nếu đã hết hạn thuê mà nhà vẫn dùng để cho thuê;</p>
      <p>h) Được ưu tiên mua nhà đang thuê, khi bên A thông báo về việc bán ngôi nhà;</p>
      <p>i) Đơn phương chấm dứt thực hiện hợp đồng thuê nhà nhưng phải báo cho bên A biết trước ít nhất 30 ngày nếu không có thỏa thuận khác và yêu cầu bồi thường thiệt hại nếu bên A có một trong các hành vi sau đây:</p>
      <p>- Không sửa chữa nhà ở khi có hư hỏng nặng;</p>
      <p>- Tăng giá thuê nhà ở bất hợp lý hoặc tăng giá thuê mà không thông báo cho bên thuê nhà ở biết trước theo thỏa thuận;
      </p>
      <p>- Quyền sử dụng nhà ở bị hạn chế do lợi ích của người thứ ba.</p>
      <p><strong>ĐIỀU 6. QUYỀN TIẾP TỤC THUÊ NHÀ Ở</strong></p>
      <p>6.1. Trường hợp chủ sở hữu nhà ở chết mà thời hạn thuê nhà ở vẫn còn thì bên B được tiếp tục thuê đến hết hạn hợp đồng. Người thừa kế có trách nhiệm tiếp tục thực hiện hợp đồng thuê nhà ở đã ký kết trước đó, trừ trường hợp các bên có thỏa thuận khác. Trường hợp chủ sở hữu không có người thừa kế hợp pháp theo quy định của pháp luật thì nhà ở đó thuộc quyền sở hữu của Nhà nước và người đang thuê nhà ở được tiếp tục thuê theo quy định về quản lý, sử dụng nhà ở thuộc sở hữu nhà nước.</p>
      <p>6.2. Trường hợp chủ sở hữu nhà ở chuyển quyền sở hữu nhà ở đang cho thuê cho người khác mà thời hạn thuê nhà ở vẫn còn thì bên B được tiếp tục thuê đến hết hạn hợp đồng; chủ sở hữu nhà ở mới có trách nhiệm tiếp tục thực hiện hợp đồng thuê nhà ở đã ký kết trước đó, trừ trường hợp các bên có thỏa thuận khác.</p>
      <p>6.3. Khi bên B chết mà thời hạn thuê nhà ở vẫn còn thì người đang cùng sinh sống với bên B được tiếp tục thuê đến hết hạn hợp đồng thuê nhà ở, trừ trường hợp thuê nhà ở công vụ hoặc các bên có thỏa thuận khác hoặc pháp luật có quy định khác.</p>
      <p><strong>ĐIỀU 7. TRÁCH NHIỆM DO VI PHẠM HỢP ĐỒNG</strong></p>
      <p>Trong quá trình thực hiện hợp đồng mà phát sinh tranh chấp, các bên cùng nhau thương lượng giải quyết; trong trường hợp không tự giải quyết được, cần phải thực hiện bằng cách hòa giải; nếu hòa giải không thành thì đưa ra Tòa án có thẩm quyền theo quy định của pháp luật.</p>
      <p><strong>ĐIỀU 8. CÁC THỎA THUẬN KHÁC</strong></p>
      <p>8.1. Việc sửa đổi, bổ sung hoặc hủy bỏ hợp đồng này phải lập thành văn bản mới có giá trị để thực hiện.</p>
      <p>8.2. Việc chấm dứt hợp đồng thuê nhà ở được thực hiện khi có một trong các trường hợp sau đây:</p>
      <p>a) Hợp đồng thuê nhà ở hết hạn; trường hợp trong hợp đồng không xác định thời hạn thì hợp đồng chấm dứt sau 90 ngày, kể từ ngày bên A thông báo cho bên B biết việc chấm dứt hợp đồng;</p>
      <p>b) Nhà ở cho thuê không còn;</p>
      <p>c) Nhà ở cho thuê bị hư hỏng nặng, có nguy cơ sập đổ hoặc thuộc khu vực đã có quyết định thu hồi đất, giải tỏa nhà ở hoặc có quyết định phá dỡ của cơ quan nhà nước có thẩm quyền; nhà ở cho thuê thuộc diện bị Nhà nước trưng mua, trưng dụng để sử dụng vào các mục đích khác.</p>
      <p>Bên A phải thông báo bằng văn bản cho bên B biết trước 30 ngày về việc chấm dứt hợp đồng thuê nhà ở quy định tại điểm này, trừ trường hợp các bên có thỏa thuận khác;</p>
      <p>d) Hai bên thoả thuận chấm dứt hợp đồng trước thời hạn;</p>
      <p>e) Bên B chết hoặc có tuyên bố mất tích của Tòa án mà khi chết, mất tích không có ai đang cùng chung sống;</p>
      <p>f) Chấm dứt khi một trong các bên đơn phương chấm dứt thực hiện hợp đồng thuê nhà ở.</p>
      <p><strong>ĐIỀU 9. CAM KẾT CỦA CÁC BÊN</strong></p>
      <p>Bên A và bên B chịu trách nhiệm trước pháp luật về những lời cùng cam kết sau đây:</p>
      <p>9.1. Đã khai đúng sự thật và tự chịu trách nhiệm về tính chính xác của những thông tin về nhân thân đã ghi trong hợp đồng này.</p>
      <p>9.2. Thực hiện đúng và đầy đủ tất cả những thỏa thuận đã ghi trong hợp đồng này; nếu bên nào vi phạm mà gây thiệt hại, thì phải bồi thường cho bên kia hoặc cho người thứ ba (nếu có).</p>
      <p>Trong quá trình thực hiện nếu phát hiện thấy những vấn đề cần thoả thuận thì hai bên có thể lập thêm Phụ lục hợp đồng. Nội dung Phụ lục hợp đồng có giá trị pháp lý như hợp đồng chính.</p>
      <p>9.3. Hợp đồng này có giá trị kể từ ngày hai bên ký kết.</p>
      <p>Hợp đồng được lập thành {contract.nCopies} ({readNumberVi(contract.nCopies)}) bản, mỗi bên giữ một bản và có giá trị như nhau.</p>
    </div>
  );
});

export default RoomTemplate;
