import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Hướng dẫn tạo thông tin nhà cho thuê',
};

export default function Page() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl">Hướng dẫn lấy tọa độ nhà cho thuê bản đồ Google Map</h1>
      <Separator />
      <p className="mt-4">
        Để lấy tọa độ bản đồ Google Map, bạn cần thực hiện các bước sau:
      </p>
      <ul className="list-disc ml-6 mt-4">
        <li>
          Bước 1: Truy cập trang web <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps</a>
        </li>
        <li>
          Bước 2: Tìm kiếm địa chỉ cụ thể của nhà cho thuê
          <img src="https://iili.io/dfn40Ij.png" alt="Screenshot from 2024 07 08 11 23 41" className="my-2"/>
          <img src="https://iili.io/dfn41hx.png" alt="Screenshot from 2024 07 08 11 24 37" className="my-2"/>
        </li>
        <li>
          Bước 3: Click chuột phải vào vị trí nhà cho thuê, chọn <strong>Chia sẻ</strong>
          <img src="https://iili.io/dfn4cmb.png" alt="Screenshot from 2024 07 08 11 24 47" className="my-2"/>
        </li>
        <li>
          Bước 4: Link chia sẻ vị trí nhà cho thuê sẽ hiện ra, bạn copy link đó và nhập vào trường <strong>Link vị trí</strong>. Tọa độ của nhà cho thuê sẽ được tự động lấy từ link đó.
        </li>
      </ul>
    </div>
  );
};
