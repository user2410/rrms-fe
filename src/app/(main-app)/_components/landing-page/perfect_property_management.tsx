import Image from "next/image";

export default function PerfectPropertyManagement() {
  return (
    <div className="w-full h-full">
      <div className="container space-y-4">
        <h1 className="text-center text-xl font-semibold">QUẢN LÝ & QUẢNG BÁ NHÀ CHO THUÊ CÙNG RRMS</h1>
        <p className="text-center">RRMS là hệ thống quản lý và quảng bá nhà cho thuê giúp bạn quản lý tất cả thông tin về nhà cho thuê của mình một cách dễ dàng và hiệu quả.</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 relative">
              <Image src="/img/landing/it-qldnt.png" alt="quan-ly-da-nen-tang" fill/>
            </div>
            <h3 className="text-lg font-semibold text-center">Quản lý đa nền tảng</h3>
            <p className="text-center">Sử dụng trình duyệt trên máy tính hoặc ứng dụng trên smartphone với dữ liệu đồng bộ.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 relative">
              <Image src="/img/landing/it-lttt.png" alt="quan-ly-luu-tru-thong-tin" fill/>
            </div>
            <h3 className="text-lg font-semibold text-center">Lưu trữ thông tin</h3>
            <p className="text-center">Tất cả thông tin khách thuê được lưu trữ với đầy đủ thông tin. Bạn có thể tra cứu lại thông tin ngay cả khi khách thuê đã chuyển đi.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 relative">
              <Image src="/img/landing/it-dashboard.png" alt="dashboard" fill/>
            </div>
            <h3 className="text-lg font-semibold text-center">Thống kê chi tiết</h3>
            <p className="text-center">Màn hình quản lý hiển thị các thông tin chi tiết về tình hình thu chi, tình hình sử dụng nhà, tình hình thuê nhà.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 relative">
              <Image src="/img/landing/it-contract.png" alt="quan-ly-hop-dong" fill/>
            </div>
            <h3 className="text-lg font-semibold text-center">Quản lý hợp đồng</h3>
            <p className="text-center">Cả hai bên thuê nhà cùng tạo và quản lý hợp đồng thuê nhà trực tuyến theo mẫu chuẩn, giúp việc tạo hợp đồng trở nên minh bạch và dễ dàng hơn.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 relative">
              <Image src="/img/landing/it-tickt.png" alt="minh-bachh-thu-chi" fill/>
            </div>
            <h3 className="text-lg font-semibold text-center">Minh bạch thu chi</h3>
            <p className="text-center">Chức năng quản lý tự động các khoản thu nhà cho thuê hướng tới sự minh bạch của khoản thu và thống nhất của các bên về khoản thu.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 relative">
              <Image src="/img/landing/it_complaint.png" alt="quan-ly-da-nen-tang" fill/>
            </div>
            <h3 className="text-lg font-semibold text-center">Báo cáo vấn đề</h3>
            <p className="text-center">Báo cáo vấn đề phát sinh trong quá trình thuê nhà để giải quyết nhanh chóng và hiệu quả.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
