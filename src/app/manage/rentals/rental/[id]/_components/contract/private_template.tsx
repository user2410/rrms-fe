import { getPropertyFullAddress } from "@/models/property";
import { readMoneyVi, readNumberVi } from "@/utils/currency";
import { addMonths } from "date-fns";
import { forwardRef, ReactNode } from "react";
import { RentalData } from "../../_context/data.context";
import { ContractFormValues } from "./contract_data";
import { Contract } from "@/models/contract";

type Props = {
  children?: ReactNode;
  className?: string;
  contract: Contract;
  data: RentalData;
}

const placeholder = ".................................";

const PrivateTemplate = forwardRef<HTMLDivElement, Props>(function Render(props, ref) {
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
      <p className="ql-align-center"><strong><u>Độc lập - Tự do - Hạnh phúc</u></strong></p>
      <p className="ql-align-right"><em>{contract.createdAtPlace}, ngày {today.getDate()} tháng {today.getMonth()} năm {today.getFullYear()}</em></p>
      <p className="ql-align-center"><strong>HỢP ĐỒNG THUÊ NHÀ</strong></p>
      <p><em>- Căn cứ&nbsp;Bộ luật Dân sự số 91/2015/QH13 ngày 24/11/2015;</em></p>
      <p><em>- Căn cứ vào&nbsp;Luật Thương mại số 36/2005/QH11 ngày 14 tháng 06 năm 2005;</em></p>
      <p><em>- Căn cứ vào nhu cầu và sự thỏa thuận của các bên tham gia Hợp đồng;</em></p>
      <p>Hôm nay, ngày {today.getDate()} tháng {today.getMonth()} năm {today.getFullYear()}, các Bên gồm:</p>
      <p><strong>BÊN CHO THUÊ (Bên A):</strong></p>
      <p>Ông/bà: {contract.aFullName}. Ngày sinh: {aDob}</p>
      <p>CMND/CCCD số: {contract.aIdentity} Ngày cấp: {aIdentityIssuedAt} Nơi cấp: {contract.aIdentityIssuedBy}</p>
      <p>Nơi ĐKTT: {contract.aHouseholdRegistration}</p>
      <p><strong>BÊN THUÊ (Bên B) :</strong></p>
      <p>Ông/bà: {data.rental.tenantName}</p>
      <p>CMND/CCCD số: {contract.bIdentity} Ngày cấp: {bIdentityIssuedAt} Nơi cấp: {contract.bIdentityIssuedBy}</p>
      <p>Nơi ĐKTT: {contract.aHouseholdRegistration}</p>
      <p>Bên A và Bên B sau đây gọi chung là&nbsp;“Hai Bên”&nbsp;hoặc&nbsp;“Các Bên”.</p>
      <p>Sau khi thảo luận, Hai Bên thống nhất đi đến ký kết Hợp đồng thuê nhà (“Hợp Đồng”) với các điều khoản và điều kiện dưới đây:</p>
      <p><strong>Điều 1. Nhà ở và các tài sản cho thuê kèm theo nhà ở:</strong></p>
      <p>1.1. Bên A đồng ý cho Bên B thuê và Bên B cũng đồng ý thuê quyền sử dụng đất và một căn nhà {data.property.numberOfFloors} tầng gắn liền với quyền sử dụng đất tại địa chỉ {propertyAddress} để sử dụng làm nơi để ở.</p>
      <p>Diện tích quyền sử dụng đất: {data.property.area} m2;</p>
      <p>Diện tích căn nhà : {data.unit.area} m2;</p>
      <p>1.2. Bên A cam kết quyền sử sụng đất và căn nhà gắn liền trên đất trên là tài sản sở hữu hợp pháp của Bên A. Mọi tranh chấp phát sinh từ tài sản cho thuê trên Bên A hoàn toàn chịu trách nhiệm trước pháp luật.</p>
      <p><strong>Điều 2. Bàn giao và sử dụng diện tích thuê:</strong></p>
      <p>2.1. Thời điểm Bên A bàn giao tài sản thuê vào ngày {startDate.getDate()} tháng {startDate.getMonth()} năm {startDate.getFullYear()};</p>
      <p>2.2. Bên B được toàn quyền sử dụng tài sản thuê kể từ thời điểm được Bên A bàn giao từ thời điểm quy định tại Mục 2.1 trên đây.</p>
      <p><strong>Điều 3. Thời hạn thuê</strong></p>
      <p>3.1. Bên A cam kết cho Bên B thuê tài sản thuê với thời hạn là {data.rental.rentalPeriod} tháng kể từ ngày bàn giao Tài sản thuê;</p>
      <p>3.2. Hết thời hạn thuê nêu trên nếu bên B có nhu cầu tiếp tục sử dụng thì Bên A phải ưu tiên cho Bên B tiếp tục thuê.</p>
      <p><strong>Điều 4. Đặc cọc tiền thuê nhà</strong></p>
      <p>4.1. Bên B sẽ giao cho Bên A một khoản tiền là {data.rental.deposit.toLocaleString()}&nbsp;VNĐ&nbsp;(bằng chữ: {readMoneyVi(data.rental.deposit)})&nbsp;ngay sau khi ký hợp đồng này. Số tiền này là tiền đặt cọc để đảm bảm thực hiện Hợp đồng cho thuê nhà.</p>
      <p>4.2. Nếu Bên B đơn phương chấm dứt hợp đồng mà không thực hiện nghĩa vụ báo trước tới Bên A thì Bên A sẽ không phải hoàn trả lại Bên B số tiền đặt cọc này.</p>
      <p>Nếu Bên A đơn phương chấm dứt hợp đồng mà không thực hiện nghĩa vụ báo trước tới bên B thì bên A sẽ phải hoàn trả lại Bên B số tiền đặt cọc và phải bồi thường thêm một khoản bằng chính tiền đặt cọc.</p>
      <p>4.3. Tiền đặt cọc của Bên B sẽ không được dùng để thanh toán tiền thuê. Nếu Bên B vi phạm Hợp Đồng làm phát sinh thiệt hại cho Bên A thì Bên A có quyền khấu trừ tiền đặt cọc để bù đắp các chi phí khắc phục thiệt hại phát sinh. Mức chi phí bù đắp thiệt hại sẽ được Các Bên thống nhất bằng văn bản.</p>
      <p>4.4. Vào thời điểm kết thúc thời hạn thuê hoặc kể từ ngày chấm dứt Hợp đồng, Bên A sẽ hoàn lại cho Bên B số tiền đặt cọc sau khi đã khấu trừ khoản tiền chi phí để khắc phục thiệt hại (nếu có).</p>
      <p><strong>Điều 5. Tiền thuê nhà:</strong></p>
      <p>5.1 Tiền thuê nhà đối với diện tích thuê nêu tại mục 1.1 Điều 1 là:&nbsp;{data.rental.rentalPrice.toLocaleString()} VNĐ/tháng&nbsp;(Bằng chữ:{readMoneyVi(data.rental.rentalPrice)})</p>
      <p>5.2 Tiền thuê nhà không bao gồm chi phí khác như tiền điện, nước, vệ sinh.... Khoản tiền này sẽ do bên B trả theo khối lượng, công suất sử dụng thực tế của Bên B hàng tháng, được tính theo đơn giá của nhà nước.</p>
      <p><strong>Điều 6. Phương thức thanh toán tiền thuê nhà</strong></p>
      <p>Tiền thuê nhà được thanh toán theo 01 (một) tháng/lần vào ngày 05 (năm) hàng tháng.</p>
      <p>Các chi phí khác được bên B tự thanh toán với các cơ quan, đơn vị có liên quan khi được yêu cầu.</p>
      <p>Việc thanh toán tiền thuê nhà được thực hiện bằng đồng tiền Việt Nam theo hình thức trả trực tiếp bằng tiền mặt.</p>
      <p><strong>Điều 7. Quyền và nghĩa vụ của bên cho thuê nhà</strong></p>
      <p>7.1. Quyền lợi</p>
      <p>- Yêu cầu Bên B thanh toán tiền thuê và chi phí khác đầy đủ, đúng hạn theo thoả thuận trong Hợp Đồng;</p>
      <p>- Yêu cầu Bên B phải sửa chữa phần hư hỏng, thiệt hại do lỗi của Bên B gây ra.</p>
      <p>7.2. Nghĩa vụ của</p>
      <p>- Bàn giao diện tích thuê cho Bên B theo đúng thời gian quy định trong Hợp đồng;</p>
      <p>- Đảm bảo việc cho thuê theo Hợp đồng này là đúng quy định của pháp luật;</p>
      <p>- Đảm bảo cho Bên B thực hiện quyền sử dụng diện tích thuê một cách độc lập và liên tục trong suốt thời hạn thuê, trừ trường hợp vi phạm pháp luật và/hoặc các quy định của Hợp đồng này.</p>
      <p>- Không xâm phạm trái phép đến tài sản của Bên B trong phần diện tích thuê. Nếu Bên A có những hành vi vi phạm gây thiệt hại cho Bên B trong thời gian thuê thì Bên A phải bồi thường.</p>
      <p>- Tuân thủ các nghĩa vụ khác theo thoả thuận tại Hợp đồng này hoặc/và các văn bản kèm theo Hợp đồng này; hoặc/và theo quy định của pháp luật Việt Nam.</p>
      <p><strong>Điều 8. Quyền và nghĩa vụ của bên thuê nhà</strong></p>
      <p>8.1. Quyền lợi</p>
      <p>- Nhận bàn giao diện tích thuê theo đúng thoả thuận trong Hợp đồng;</p>
      <p>- Được sử dụng phần diện tích thuê làm nơi ở và các hoạt động hợp pháp khác;</p>
      <p>- Yêu cầu Bên A sửa chữa kịp thời những hư hỏng không phải do lỗi của Bên B trong phần diện tích thuê để bảo đảm an toàn;</p>
      <p>- Được tháo dỡ và đem ra khỏi phần diện tích thuê các tài sản, trang thiết bị của Bên B đã lắp đặt trong phần diện tích thuê khi hết thời hạn thuê hoặc đơn phương chấm dứt hợp đồng.</p>
      <p>8.2. Nghĩa vụ</p>
      <p>- Sử dụng diện tích thuê đúng mục đích đã thỏa thuận, giữ gìn nhà ở và có trách nhiệm trong việc sửa chữa những hư hỏng do mình gây ra;</p>
      <p>- Thanh toán tiền đặt cọc, tiền thuê đầy đủ, đúng thời hạn đã thỏa thuận;</p>
      <p>- Trả lại diện tích thuê cho Bên A khi hết thời hạn thuê hoặc chấm dứt Hợp đồng thuê;</p>
      <p>- Mọi việc sửa chữa, cải tạo, lắp đặt bổ sung các trang thiết bị làm ảnh hưởng đến kết cấu của căn phòng…, Bên B phải có văn bản thông báo cho Bên A và chỉ được tiến hành các công việc này sau khi có sự đồng ý bằng văn bản của Bên A;
      </p>
      <p>- Tuân thủ một cách chặt chẽ quy định tại Hợp đồng này và các quy định của pháp luật Việt Nam.</p>
      <p><strong>Điều 9. Đơn phương chấm dứt&nbsp;hợp đồng thuê nhà:</strong></p>
      <p>Trong trường hợp một trong Hai Bên muốn đơn phương chấm dứt Hợp đồng trước hạn thì phải thông báo bằng văn bản cho bên kia trước 30 (ba mươi) ngày so với ngày mong muốn chấm dứt. Nếu một trong Hai Bên không thực hiện nghĩa vụ thông báo cho Bên kia thì sẽ phải bồi thường cho bên đó một khoản tiền thuê tương đương với thời gian không thông báo và các thiệt hại khác phát sinh do việc chấm dứt Hợp đồng trái quy định.</p>
      <p><strong>Điều 10. Điều khoản thi hành</strong></p>
      <p>- Hợp đồng này có hiệu lực kể từ ngày hai bên cùng ký kết;</p>
      <p>- Các Bên cam kết thực hiện nghiêm chỉnh và đầy đủ các thoả thuận trong Hợp đồng này trên tinh thần hợp tác, thiện chí;</p>
      <p>- Mọi sửa đổi, bổ sung đối với bất kỳ điều khoản nào của Hợp đồng phải được lập thành văn bản, có đầy đủ chữ ký của mỗi Bên. Văn bản sửa đổi bổ sung Hợp đồng có giá trị pháp lý như Hợp đồng, là một phần không tách rời của Hợp đồng này.</p>
      <p>- Hợp đồng được lập thành {contract.nCopies} ({readNumberVi(contract.nCopies)}) bản, mỗi bên giữ một bản và có giá trị như nhau.</p>
    </div>
  );
});

export default PrivateTemplate;
