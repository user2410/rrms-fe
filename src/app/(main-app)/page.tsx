import Places from "./_components/landing-page/listing_byplace";
import ListingInplace from "./_components/landing-page/listings_inplace";
import NewsTab from "./_components/landing-page/news_tab";
import PerfectPropertyManagement from "./_components/landing-page/perfect_property_management";
import Searchbar from "./_components/landing-page/searchbar";

export default function HomePage() {
  return (
    <div>
      <div className="
        bg-[url('/img/hanoi-banner.jpg')] bg-cover bg-center object-fill
        w-screen h-[60vh]
        text-white
      ">
        <div className="w-full h-full bg-slate-900 bg-opacity-75 py-24 px-10 flex flex-col items-center justify-center gap-8">
          <div className="space-y-4">
            <h1 className="w-full text-center text-4xl font-bold">Tìm nhà trọ, căn hộ, văn phòng cho thuê</h1>
            <h3 className="w-full text-center text-2xl">
              Tìm kiếm hàng ngàn bất động sản cho thuê từ chủ nhà và môi giới uy tín
            </h3>
          </div>
          <Searchbar />
        </div>
      </div>
      
      <div className="">
        <div className="bg-white odd:dark:bg-gray-200 even:bg-gray-50 even:dark:bg-gray-800">
          <div className="py-10 container">
            <NewsTab />
          </div>
        </div>
        <div className="bg-white odd:dark:bg-gray-200 even:bg-gray-50 even:dark:bg-gray-800">
          <div className="py-10 container">
            <ListingInplace />
          </div>
        </div>
        <div className="bg-white odd:dark:bg-gray-200 even:bg-gray-50 even:dark:bg-gray-800">
          <div className="py-10 container">
            <Places />
          </div>
        </div>
        <div className="bg-white odd:dark:bg-gray-200 even:bg-gray-50 even:dark:bg-gray-800">
          <div className="py-10 container">
            <PerfectPropertyManagement />
          </div>
        </div>
      </div>
    </div>
  );
}
