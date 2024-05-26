import clsx from "clsx";
import Link from "next/link";

type Place = {
  code: string;
  title: string;
  bgImg: string;
};

function Placecard({ place }: { place: Place }) {
  return (
    <Link
      href={`/search?pcity=${place.code}`}
      className="hover:underline pt-4 pl-4 space-y-2 bg-cover bg-center bg-no-repeat aspect-[4/3] text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1)), url(${place.bgImg})`,
      }}
    >
      <h3 className="text-lg font-semibold">{place.title}</h3>
    </Link>
  );
}

export default function Places() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Tin đăng theo địa điểm</h2>
      <div className="grid grid-cols-2 gap-8">
        <Placecard
          place={{
            code: "hn",
            title: "Hà Nội",
            bgImg: "https://file4.batdongsan.com.vn/images/newhome/cities1/HN-web-1.jpg",
          }}
        />
        <div className="grid grid-cols-2 gap-4">
          <Placecard
            place={{
              code: "hcm",
              title: "Hồ Chí Minh",
              bgImg: "https://file4.batdongsan.com.vn/images/newhome/cities1/HCM-web-1.jpg",
            }}
          />
          <Placecard
            place={{
              code: "hcm",
              title: "Hồ Chí Minh",
              bgImg: "https://file4.batdongsan.com.vn/images/newhome/cities1/HCM-web-1.jpg",
            }}
          />
          <Placecard
            place={{
              code: "hcm",
              title: "Hồ Chí Minh",
              bgImg: "https://file4.batdongsan.com.vn/images/newhome/cities1/HCM-web-1.jpg",
            }}
          />
          <Placecard
            place={{
              code: "hcm",
              title: "Hồ Chí Minh",
              bgImg: "https://file4.batdongsan.com.vn/images/newhome/cities1/HCM-web-1.jpg",
            }}
          />
        </div>
      </div>
    </div>
  );
};
