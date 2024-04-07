import { MapRentalIntentionToText } from "@/models/application";
import { getPropertyFullAddress } from "@/models/property";
import { readMoneyVi, readNumberVi } from "@/utils/currency";
import { addMonths } from "date-fns";
import { forwardRef, ReactNode } from "react";
import { RentalData } from "../../_context/data.context";
import { Contract } from "@/models/contract";

type Props = {
  children?: ReactNode;
  className?: string;
  contract: Contract;
  data: RentalData;
}

const placeholder = ".................................";

const ApartmentTemplate = forwardRef<HTMLDivElement, Props>(function Render(props, ref) {
  const today = new Date();
  const { contract, data } = props;
  const startDate = new Date(data.rental.startDate);
  const propertyAddress = getPropertyFullAddress(data.property);
  const endDate = addMonths(startDate, data.rental.rentalPeriod);
  
  const aDob = new Date(contract.aDob).toLocaleDateString('vi-VN');
  const aIdentityIssuedAt = new Date(contract.aIdentityIssuedAt).toLocaleDateString('vi-VN');
  const bDob = contract.bDob ? new Date(contract.bDob).toLocaleDateString('vi-VN') : placeholder;
  const bIdentityIssuedAt = contract.bIdentityIssuedAt ? new Date(contract.bIdentityIssuedAt).toLocaleDateString('vi-VN') : placeholder;
  const bOrganizationCodeIssuedAt = contract.bOrganizationCodeIssuedAt ? new Date(contract.bOrganizationCodeIssuedAt).toLocaleDateString('vi-VN') : placeholder;


  return (
    <div ref={ref} className={props.className}>
      <p className="ql-align-center"><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></p>
      <p className="ql-align-center"><strong>Độc lập - Tự do - Hạnh phúc</strong></p>
      <p className="ql-align-center"><strong>&nbsp;</strong></p>
      <p className="ql-align-center"><strong>HỢP ĐỒNG THUÊ CĂN HỘ NHÀ CHUNG CƯ</strong></p>
      <p>&nbsp;Hôm nay, ngày {today.getDate()} tháng {today.getMonth()} năm {today.getFullYear()}, tại {contract.createdAtPlace}</p>
      <p>Chúng tôi gồm:</p>
      <p><strong>BÊN CHO THUÊ (Sau đây gọi tắt là bên A):&nbsp;</strong></p>
      <p>Ông/bà: {contract.aFullName}</p>
      <p>CMND/CCCD số: {contract.aIdentity} Ngày cấp: {aIdentityIssuedAt} Nơi cấp: {contract.aIdentityIssuedBy}</p>
      <p>Nơi ĐKTT:{contract.aHouseholdRegistration}</p>
      <p><strong>BÊN THUÊ (Sau đây gọi tắt là bên B):</strong></p>
      <p>Ông/bà: {contract.bFullName}</p>
      <p>CMND/CCCD số: {contract.bIdentity} Ngày cấp: {bIdentityIssuedAt} Nơi cấp: {contract.bIdentityIssuedBy || placeholder}</p>
      <p>Nơi ĐKTT: {contract.bHouseholdRegistration}</p>
      <p><strong>Hai bên đồng ý thoả thuận việc ký kết Hợp đồng thuê căn hộ chung cư và tài sản kèm theo với các nội dung sau:</strong></p>
      <p className="ql-align-center"><strong>ĐIỀU 1</strong></p>
      <p className="ql-align-center"><strong>CĂN HỘ CHUNG CƯ CHO THUÊ</strong></p>
      <p>Bên A đồng ý cho bên B thuê căn hộ chung cư thuộc quyền sở hữu, quyền sử dụng, quản lý hợp pháp của bên A tại địa chỉ: Căn hộ số {data.unit.name}; Tầng {data.unit.floor}, thuộc tòa nhà {data.property.building} Khu chung cư {data.property.project}</p>
      <p>Thông tin cụ thể về căn hộ chung cư như sau:</p>
      <p><em>* Đặc điểm về căn hộ:</em></p>
      <p>&nbsp;- Địa chỉ căn hộ: {propertyAddress}</p>
      <p>&nbsp;- Diện tích sàn căn hộ:&nbsp;{data.unit.area} m2 (Bằng chữ: {readNumberVi(data.unit.area)} mét vuông)</p>
      <p>* Đặc điểm đất xây dựng tòa nhà chung cư có căn hộ nêu trên:</p>
      <p>- Thửa đất số: ............................</p>
      <p>- Tờ bản đồ số: ............................</p>
      <p className="ql-align-center"><strong>ĐIỀU 2</strong></p>
      <p className="ql-align-center"><strong>MỤC ĐÍCH THUÊ</strong></p>
      <p>Mục đích thuê căn hộ chung cư nêu tại Điều 1 của Hợp đồng này là {MapRentalIntentionToText[data.rental.rentalIntention as keyof typeof MapRentalIntentionToText]}</p>
      <p className="ql-align-center"><strong>ĐIỀU 3</strong></p>
      <p className="ql-align-center"><strong>THỜI HẠN THUÊ</strong></p>
      <p>Thời hạn thuê căn hộ nhà chung cư nói tại Điều 1 của Hợp đồng này là {data.rental.rentalPeriod} tháng ({readNumberVi(data.rental.rentalPeriod)} tháng), kể từ ngày {startDate.toLocaleDateString('vi-VN')} đến ngày {endDate.toLocaleDateString('vi-VN')}</p>
      <p>Hết thời hạn thuê nếu bên B có nhu cầu thuê tiếp thì bên A sẽ ưu tiên cho bên B tiếp tục thuê trên cơ sở giá thuê được thoả thuận theo thời điểm (nếu bên A có nhu cầu cho thuê).</p>
      <p className="ql-align-center"><strong>ĐIỀU 4</strong></p>
      <p className="ql-align-center"><strong>GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN</strong></p>
      <p>1. Giá thuê căn hộ nhà chung cư nêu tại Điều 1 của Hợp đồng này được tính như sau:</p>
      <p>- Tổng số tiền thuê trong {data.rental.rentalPeriod} tháng (từ ngày {startDate.toLocaleDateString('vi-VN')} đến ngày {endDate.toLocaleDateString('vi-VN')}) là: {data.rental.rentalPrice} đồng/tháng;</p>
      <p>Số tiền thuê căn hộ nhà chung cư hàng tháng nói trên không bao gồm các chi phí dịch vụ như: điện, nước, điện thoại, internet, fax, dọn vệ sinh... Các chi phí này sẽ do Bên B trực tiếp thanh toán hàng tháng với các cơ quan cung cấp dịch vụ cho khu chung cư kể từ sau ngày ký Hợp đồng này.</p>
      <p>Giá trên không bao gồm thuế VAT, thuế môn bài, thuế nhà hoặc các loại thuế khác (Các chi phí này nếu phát sinh thì sẽ do bên thuê nhà thanh toán).</p>
      <p>Những đồ dùng trang thiết bị (đính kèm theo Hợp đồng này) bên A để lại cho bên B sử dụng, bên B phải có trách nhiệm đặt cọc {data.rental.deposit} VNĐ (Bằng chữ: {readMoneyVi(data.rental.deposit)} chẵn).&nbsp;</p>
      <p>2. Phương thức, thời điểm thanh toán:</p>
      <p>- Phương thức thanh toán: bằng {contract.paymentMethod}. Số tiền {data.rental.rentalPrice} VNĐ/tháng&nbsp;(Bằng chữ:{readMoneyVi(data.rental.rentalPrice)}).</p>
      <p>- Thời điểm thanh toán: ngày {contract.paymentDay} hàng tháng</p>
      <p>+ Lần thứ nhất: vào ngày đầu tiên của kỳ thuê.</p>
      <p>+ Các lần sau đó:.........................</p>
      <p>3. Việc giao và nhận số tiền nêu tại khoản 1 Điều này do hai bên tự thực hiện và chịu trách nhiệm trước pháp luật.
      </p>
      <p className="ql-align-center"><strong>ĐIỀU 5</strong></p>
      <p className="ql-align-center"><strong>TRÁCH NHIỆM VÀ QUYỀN CỦA&nbsp;CÁC BÊN</strong></p>
      <p>1. Quyền và Trách nhiệm của Bên A:</p>
      <p>- Bàn giao cho Bên B căn hộ nhà chung cư sử dụng cùng các thiết bị đi kèm (Kèm theo phụ lục) ngay sau khi ký Hợp
        đồng. Số lượng, chủng loại và chất lượng các thiết bị được ghi trong Biên bản bàn giao đính kèm Hợp đồng này với chữ
        ký của Đại diện hai bên.</p>
      <p>- Bảo đảm quyền cho thuê căn hộ nhà chung cư và cam kết không có bất kỳ một tranh chấp, khiếu nại nào đối với nhà cho Bên B thuê.&nbsp;&nbsp;</p>
      <p>- Bảo đảm quyền sử dụng trọn vẹn và riêng rẽ của Bên B đối với phần diện tích cho thuê đã nói ở Điều 1.</p>
      <p>- Tạo mọi điều kiện cho Bên B trong việc sử dụng căn hộ nhà chung cư, đảm bảo về quyền sử dụng dịch vụ công cộng của các nhà cung cấp cho bên thuê B.</p>
      <p>- Không được đơn phương chấm dứt hợp đồng trong suốt thời hạn thuê nếu không thống nhất được với bên B.</p>
      <p>- Phối hợp và giúp đỡ bên thuê trong những vấn đề liên quan đến bên thứ 3 nếu có phát sinh và pháp luật có quy định bắt buộc (Mọi chi phí nếu có thuộc bên B).&nbsp;</p>
      <p>- Không được tăng giá cho thuê nhà trong suốt thời gian của hợp đồng thuê căn hộ nhà chung cư.</p>
      <p>2. Quyền và Trách nhiệm của Bên B</p>
      <p>- Sử dụng diện tích căn hộ chung cư nói tại Điều 1 đúng mục đích và không được sử dụng vào các mục đích khác như ký hợp đồng cho thuê lại hoặc chuyển nhượng hợp đồng thuê căn hộ nhà chung cư này cho bất kỳ một bên thứ ba nào.</p>
      <p>- Thanh toán đầy đủ, đúng hạn tiền thuê căn hộ nhà chung cư theo Điều 3.</p>
      <p>- Bảo quản, giữ gìn mọi trang thiết bị thuộc sở hữu của Bên A. Trường hợp xảy ra hỏng hóc do lỗi Bên B gây ra thì Bên B phải hoàn lại theo giá trị thiệt hại (Hoặc tự lắp đặt lại thiết bị nếu bên cho thuê đồng ý).</p>
      <p>- Sử dụng căn hộ nhà chung cư thuê đúng pháp luật, tuân thủ các quy định về đảm bảo vệ sinh, trật tự, an toàn và phòng chống cháy, nổ theo quy định chung của Nhà nước và nội quy bảo vệ của toàn bộ khu nhà.</p>
      <p>- Bàn giao lại căn hộ nhà chung cư và trang thiết bị cho Bên B khi hết hạn hợp đồng. Khi dời căn hộ nhà chung cư thuê, Bên B không được quyền tháo dỡ trang thiết bị do Bên A lắp đặt.</p>
      <p>- Trong thời hạn Hợp đồng, nếu không còn nhu cầu thuê nữa, Bên B phải báo cho Bên A trước ..... (.....) tháng để hai bên cùng quyết toán tiền thuê căn hộ nhà chung cư và các khoản khác (nếu được bên A đồng ý).</p>
      <p>- Có trách nhiệm đóng góp về chi phí bảo vệ và vệ sinh theo quy định của toàn bộ khu căn hộ nhà chung cư.</p>
      <p>- Trong quá trình thuê không được tự ý sửa chữa, thay đổi kết cấu và kiến trúc căn hộ nhà chung cư.</p>
      <p>- Bên A có quyền đề xuất hoặc thỏa thuận chia sẻ chi phí với bên B về việc sửa chữa, bảo dưỡng căn hộ nhà chung cư nếu căn hộ nhà chung cư cho thuê có dấu hiệu xuống cấp, chất lượng căn hộ nhà chung cư xuống cấp trong thời hạn của hợp đồng.</p>
      <p>3. Hai bên thoả thuận:</p>
      <p>- Trường hợp một trong hai bên tự ý đơn phương chấm dứt hợp đồng, không có lý do chính đáng và không được sự đồng ý của bên kia thì phải bồi thường thiệt hại cho bên bên bị đơn phương chấm dứt hợp đồng số tiền là bằng tiền thuê.&nbsp;&nbsp;</p>
      <p className="ql-align-center"><strong>ĐIỀU 6</strong></p>
      <p className="ql-align-center"><strong>PHƯƠNG THỨC GIẢI QUYẾT TRANH CHẤP</strong></p>
      <p>Trong quá trình thực hiện Hợp đồng này, nếu phát sinh tranh chấp, các bên cùng nhau thương lượng giải quyết trên nguyên tắc tôn trọng quyền lợi của nhau; trong trường hợp không thương lượng được thì một trong hai bên có quyền khởi kiện để yêu cầu toà án có thẩm quyền giải quyết theo quy định của pháp luật.</p>
      <p className="ql-align-center"><strong>ĐIỀU 7</strong></p>
      <p className="ql-align-center"><strong>CAM ĐOAN CỦA CÁC BÊN</strong></p>
      <p>Bên A và bên B chịu trách nhiệm trước pháp luật về những lời cam đoan sau đây:</p>
      <p>1. Bên A cam đoan</p>
      <p>1.1. Những thông tin về nhân thân, về căn hộ nhà chung cư đã ghi trong Hợp đồng này là đúng sự thật;</p>
      <p>1.2. Căn hộ nhà chung cư thuộc trường hợp được cho thuê theo quy định của pháp luật;</p>
      <p>1.3 Tại thời điểm giao kết Hợp đồng này:</p>
      <p>a) Căn hộ nhà chung cư không có tranh chấp;</p>
      <p>b) Căn hộ nhà chung cư không bị kê biên để bảo đảm thi hành án;</p>
      <p>1.4. Việc giao kết Hợp đồng này hoàn toàn tự nguyện, không bị lừa dối, không bị ép buộc;</p>
      <p>1.5. Thực hiện đúng và đầy đủ các thoả thuận đã ghi trong Hợp đồng này.</p>
      <p>2. Bên B cam đoan</p>
      <p>2.1. Những thông tin về nhân thân đã ghi trong Hợp đồng này là đúng sự thật;</p>
      <p>2.2. Đã xem xét kỹ, biết rõ về Căn hộ nhà chung cư nêu tại Điều 1 của Hợp đồng này và các giấy tờ về quyền sở hữu căn hộ chung cư nêu trên.</p>
      <p>2.3. Việc giao kết Hợp đồng này hoàn toàn tự nguyện, không bị lừa dối, không bị ép buộc;</p>
      <p>2.4. Thực hiện đúng và đầy đủ các thoả thuận đã ghi trong Hợp đồng này.</p>
      <p className="ql-align-center"><strong>ĐIỀU 8</strong></p>
      <p className="ql-align-center"><strong>ĐIỀU KHOẢN CUỐI CÙNG</strong></p>
      <p>Hai bên đã hiểu rõ quyền, nghĩa vụ, lợi ích hợp pháp của mình và hậu quả pháp lý của việc giao kết Hợp đồng này.</p>
      <p><strong>BẢNG KÊ VẬT DỤNG SINH HOẠT ĐÍNH KÈM HỢP ĐỒNG THUÊ CĂN HỘ NHÀ CHUNG CƯ</strong></p>
    </div>
  );
});

export default ApartmentTemplate;
