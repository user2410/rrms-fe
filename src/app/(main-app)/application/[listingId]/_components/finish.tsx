
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Fragment, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaUserShield } from "react-icons/fa";
import { ApplicationForm } from "./main_form";
import UploadDialog from "./upload_dialog";
import Link from "next/link";

const TermsAgreement = () => {
  const form = useFormContext<ApplicationForm>();

  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [commitAgreed, setCommitAgreed] = useState(false);

  return (
    <Fragment>
      <UploadDialog
        form={form}
        open={openUploadDialog}
        changeOpen={() => setOpenUploadDialog(v => !v)}
      />
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={termsAgreed}
          onCheckedChange={() => {
            console.log("terms changed");
            setTermsAgreed((v) => (!v));
          }}
          id="terms" />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tôi đã đọc điều khoản và chấp nhận RRMS lưu trữ dữ liệu cá nhân của tôi.
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={commitAgreed}
          onCheckedChange={() => {
            console.log("terms changed");
            setCommitAgreed((v) => (!v));
          }}
          id="commit" />
        <label
          htmlFor="commit"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tôi cam đoan rằng tất cả các thông tin trên là đúng sự thật.
        </label>
      </div>

      <div className="flex flex-row w-full justify-center">
        <Button type="submit" className="w-2/5"
          disabled={!(termsAgreed && commitAgreed)}
          onClick={() => {
            console.log("submitting");
            setOpenUploadDialog(true);
          }}
        >Nộp đơn ứng tuyển</Button>
      </div>
    </Fragment>
  );
};

export default function Finish() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Đơn ứng tuyển của bạn đã hoàn thành</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* <p>Đơn đăng ký của bạn bao gồm các báo cáo tín dụng, tiền án. Bạn cần xác minh danh tính của mình và trả lời một số câu hỏi bảo mật.</p> */}
        <p>Nếu chủ nhà quyết định cho bạn thuê, bạn sẽ được thông báo qua email. Trong thời gian chờ đợi, bạn có thể tiếp tục ứng tuyển thuê nhà tại vào các nhà cho thuê được đăng tin trên RRMS. Bạn có thể theo dõi hồ sơ của mình tại <Link href="/manage/applications/my-applications" className="underline text-blue-600">trang quản lý</Link>.</p>
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2 my-2 text-lg">
              <FaUserShield size={16} color="green" />
              <span>Thông tin của bạn được bảo mật</span>
            </CardTitle>
            <CardContent>
              <ul className="list-disc">
                <li>Thông tin này được RRMS lưu trữ và bảo mật, không được chia sẻ cho bất kỳ bên thứ ba nào.</li>
                <li>Phía chủ nhà / quản lý có trách nhiệm xác thực danh tính trước khi xem đơn ứng tuyển của bạn.</li>
                <li>Thông tin này sẽ được xóa khỏi hệ thống sau 30 ngày nếu bạn không thuê nhà.</li>
              </ul>
            </CardContent>
          </CardHeader>
        </Card> */}

        <Separator />

        <CardTitle className="text-lg">Điều Khoản và Cam Kết Bảo Mật Thông Tin Khách Thuê - RRMS</CardTitle>
        <ScrollArea className="w-full h-72 rounded-sm border">
          <div className="p-4">
            <h2 className="text-xl font-semibold my-3">Điều Khoản và Cam Kết Bảo Mật Thông Tin Khách Thuê - RRMS</h2>

            <Separator className="my-2"/>

            <h3 className="text-lg font-semibold">1. Mục đích và phạm vi thu thập thông tin</h3>
            <p>RRMS cam kết chỉ thu thập các thông tin cá nhân cần thiết để thực hiện chức năng ứng tuyển thuê nhà, bao gồm họ tên, thông tin liên lạc, việc làm, thu nhập và các thông tin khác liên quan. Thông tin này được sử dụng để xác thực danh tính người thuê, đánh giá khả năng thanh toán và duy trì liên lạc trong quá trình thuê nhà.</p>

            <h3 className="text-lg font-semibold">2. Phương thức thu thập thông tin</h3>
            <p>Thông tin cá nhân của khách thuê sẽ được thu thập thông qua các biểu mẫu điện tử trên hệ thống RRMS. Chúng tôi đảm bảo rằng quy trình thu thập thông tin tuân thủ các quy định pháp luật hiện hành về bảo mật và quyền riêng tư.</p>

            <h3 className="text-lg font-semibold">3. Mục đích sử dụng thông tin</h3>
            <ul>
              <li>Xác thực danh tính và liên lạc: Sử dụng thông tin để xác thực người thuê và liên lạc trong quá trình ứng tuyển và thuê nhà.</li>
              <li>Đánh giá khả năng thanh toán: Thông tin về việc làm và thu nhập sẽ giúp chủ nhà đánh giá khả năng thanh toán của người thuê.</li>
              <li>Quản lý hợp đồng và bảo trì: Thông tin cá nhân sẽ được sử dụng để quản lý hợp đồng thuê nhà và xử lý các yêu cầu bảo trì.</li>
            </ul>

            <h3 className="text-lg font-semibold">4. Bảo mật thông tin cá nhân</h3>
            <p>RRMS cam kết bảo mật tuyệt đối thông tin cá nhân của khách thuê bằng các biện pháp kỹ thuật và quản lý hiện đại nhất. Thông tin cá nhân sẽ được lưu trữ an toàn trên hệ thống và chỉ được truy cập bởi các nhân viên có thẩm quyền.</p>

            <h3 className="text-lg font-semibold">5. Quyền của người thuê nhà</h3>
            <p>Người thuê nhà có quyền truy cập, chỉnh sửa và xóa bỏ thông tin cá nhân của mình trên hệ thống RRMS. Mọi yêu cầu về việc này có thể được gửi qua các kênh liên lạc chính thức của chúng tôi và sẽ được xử lý trong thời gian sớm nhất.</p>

            <h3 className="text-lg font-semibold">6. Chia sẻ thông tin với bên thứ ba</h3>
            <p>RRMS cam kết không chia sẻ thông tin cá nhân của khách thuê với bất kỳ bên thứ ba nào nếu không có sự đồng ý của khách thuê, trừ các trường hợp theo yêu cầu của cơ quan chức năng có thẩm quyền.</p>

            <h3 className="text-lg font-semibold">7. Thời gian lưu trữ thông tin</h3>
            <p>Thông tin cá nhân của khách thuê sẽ được lưu trữ trong suốt thời gian thuê nhà và một khoảng thời gian nhất định sau khi kết thúc hợp đồng thuê để giải quyết các vấn đề hậu kỳ, sau đó sẽ được xóa bỏ theo quy định của RRMS.</p>

            <h3 className="text-lg font-semibold">8. Cam kết bảo mật</h3>
            <p>RRMS cam kết tuân thủ các quy định về bảo mật thông tin cá nhân và thực hiện các biện pháp cần thiết để bảo vệ thông tin của khách thuê trước các nguy cơ mất mát, lạm dụng hoặc truy cập trái phép.</p>

            <Separator className="my-2"/>

            <p>RRMS luôn nỗ lực để bảo vệ quyền riêng tư của khách thuê và đảm bảo rằng thông tin cá nhân của bạn được xử lý một cách an toàn và bảo mật. Mọi câu hỏi hoặc yêu cầu liên quan đến chính sách bảo mật có thể được gửi tới bộ phận hỗ trợ khách hàng của chúng tôi.</p>
          </div>
        </ScrollArea>

        <TermsAgreement />
      </CardContent>
    </Card>
  );
};
