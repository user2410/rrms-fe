import Body from "./_components/body";
import Sidebar from "./_components/sidebar";


export default function Page() {

  return (
    <div className="container py-10 space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-center my-10">Tin tức bất động sản mới nhất</h1>
        <p className="text-base text-center">Thông tin mới, đầy đủ, hấp dẫn về thị trường bất động sản Việt Nam thông qua dữ liệu lớn về giá, giao dịch, nguồn cung - cầu.</p>
      </div>
      <div className="container my-10 grid grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="col-span-1 lg:col-span-7">
          <Body/>
        </div>
        <div className="col-span-1 lg:col-span-3">
          <Sidebar/>
        </div>
      </div>
    </div>
  );
};
