
import CreateApplication from "@/actions/application/create";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import { DialogClose } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { Fragment, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaCheckCircle, FaUserShield } from "react-icons/fa";
import { ApplicationForm } from "./main_form";

const TermsAgreement = () => {
  const session = useSession();
  const form = useFormContext<ApplicationForm>();
  const modalBtnRef = useRef<HTMLButtonElement>(null);

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [commitAgreed, setCommitAgreed] = useState(false);

  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  async function handleUploading() {
    console.log('handle uploading');
    if(session.status !== 'authenticated') return;
    try {
      setUploading(true);
      const data = form.getValues();
      console.log(data);
      const newApplication = await CreateApplication(data, session.data?.user.accessToken);
      // wait 1s
      // await wait(1000);
      console.log(newApplication);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Fragment>
      <Dialog>
        <DialogTrigger asChild><button ref={modalBtnRef} hidden/></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="w-full flex flex-row justify-center">
            <DialogTitle>
              {uploading ? "Đang tải lên dữ liệu ..." 
              : error ? "Có lỗi xảy ra" 
              : "Đăng kí thuê nhà thành công"}
            </DialogTitle>
          </DialogHeader>
          <div className="w-full h-full flex justify-center items-center">
            {uploading ? (<Spinner/>) 
              : error ? (<div>Có lỗi xảy ra: {JSON.stringify(error)}</div> )
              : <FaCheckCircle size={32} color="green" />}
          </div>
          {(!uploading && !error) && (
            <DialogFooter className="flex flex-row !justify-center">
              <DialogClose asChild>
                <Button type="submit">OK</Button>
              </DialogClose>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
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
          Tôi cam đoan rằng tất cả các thông tin trên là đúng sự thật và chịu trách nhiệm pháp lý với những thông tin đã khai.
        </label>
      </div>

      <div className="flex flex-row w-full justify-center">
        <Button type="submit" className="w-2/5" 
          disabled={!(termsAgreed && commitAgreed)} 
          onClick={() => {
            console.log("submitting");
            modalBtnRef.current?.click();
            handleUploading();
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
        <CardTitle className="text-3xl">Đơn ứng tuyển của bạn đã hoàn thành</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* <p>Đơn đăng ký của bạn bao gồm các báo cáo tín dụng, tiền án. Bạn cần xác minh danh tính của mình và trả lời một số câu hỏi bảo mật.</p> */}
        <p>Nếu bạn nộp đơn cùng với người khác, đơn đăng ký của bạn sẽ được nộp cho chủ nhà khi tất cả người nộp đơn đã hoàn tất. Nếu họ quyết định cho bạn thuê, bạn sẽ được thông báo qua email. Trong thời gian chờ đợi, bạn có thể tiếp tục đăng ký thuê trên RRMS trong 30 ngày tới.</p>
        <p>Bạn có thể xem trạng thái ứng tuyển thuê nhà trong dashboard của bạn.</p>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2 my-2">
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
        </Card>

        <Separator />

        <CardTitle>Điều khoản</CardTitle>
        <ScrollArea className="w-full h-72 rounded-sm border">
          <div className="p-4 text-sm font-light">
            <p>Chào mừng đến với RRMS.</p>
            <p>Sau khi chấp thuận những điều khoản này, bạn sẽ được yêu cầu xác thực danh tính (sử dụng những thông tin từ hồ sơ công khai và thông tin tín dụng liên quan để xác thực những thông tin bạn đã cung cấp (ví dụ: Số an sinh xã hội, Ngày tháng năm sinh))</p>
            <h2 className="font-semibold text-lg">Introduction and Agreement</h2>
            <p>These Terms of Service apply to the services offered by CoStar Realty Information, Inc. (“Apartments.com”) in connection with the Apartments.com, Apartamentos.com and ApartmentHomeLiving.com websites and related mobile applications, as well as any publicly available versions that may be offered through a distribution partner (collectively the “Site”). You may have arrived at a version of the Site from a distribution partners website, in which case, that partner, if any, will be identified at the top of this page. Any individual who visits, views, accesses or uses any version of the Site, including through a bot or other automated means, (“You” or “User”) is bound by these Terms of Service. By using the Site, You represent and warrant that You are at least eighteen (18) years of age and You hereby agree to be bound by all of the following provisions of these Terms of Service, which form a legally binding contract between You and Apartments.com. You further represent and warrant that You are not a competitor of Apartments.com or any of its affiliates. If You do not agree to these Terms of Service, You are prohibited from accessing the Site and must immediately discontinue such access.
            </p>
            <h2 className="font-semibold text-lg">Apartments.com is an Advertising and Information Service</h2>
            <p>The Site is an online advertising, searching and information service for apartment hunters, dwellers, landlords, and property managers. Apartments.com does not (a) broker, lease, or sublease or offer to broker, lease or sublease, or own apartments directly and is not a party to any transaction between landlords (including, as applicable, property management companies and/or property managers) and renters, (b) guarantee or ensure any apartment or any transaction between a renter and landlord, (c) conduct background screening on rental candidates, execute any lease or sublease documentation on behalf of renters or landlords or collect payment on behalf of renters or landlords, or (d) act as a property manager, broker, payment processor, money transmitter, payment manager, debt collector, or credit reporting agency, and does not guarantee any results from using the Service. The Site facilitates certain services provided by third parties, including, without limitation, background screening and payment collection and processing. You may be subject to additional third party terms and conditions for such services, which will be provided to you for review and acceptance, if applicable, at the time of use of such services. You are strongly encouraged to personally inspect any apartment advertised for rent prior to: signing any lease documentation; providing personal information such as a social security number on a lease application; or wiring or otherwise sending money for any deposit, rent payment or application fee. By using the Site, You acknowledge that published rents and availabilities are subject to change at the sole discretion of the property owner or manager at any time and without further notice.</p>
          </div>
        </ScrollArea>

        <TermsAgreement />
      </CardContent>
    </Card>
  );
};
