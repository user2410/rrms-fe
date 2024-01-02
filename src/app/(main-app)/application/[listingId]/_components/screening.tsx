import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUserShield } from "react-icons/fa";

export default function Screening() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Screening Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Card>
          <CardHeader>
            <CardHeader className="flex flex-row gap-2">
              <FaUserShield size={24} color="green"/>
              <CardTitle>Thông tin của bạn được bảo mật</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc">
                <li>Chủ nhà / quản lý phải xác thực danh tính trước khi xem thông tin bạn cung cấp.</li>
                <li>Thông tin bạn cung cấp sẽ được bảo mật bởi RRMS.</li>
              </ul>
            </CardContent>
          </CardHeader>
        </Card>
      </CardContent>
    </Card>
  );
};
