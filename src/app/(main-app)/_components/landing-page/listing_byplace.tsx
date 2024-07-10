"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSearchURL } from "../../search/_components/get_searchurl";

type Place = {
  code: string;
  title: string;
  bgImgs: string[];
};

function Placecard({ place }: { place: Place }) {
  const [bgImageIndex, setBgImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBgImageIndex((prevIndex) => (prevIndex + 1) % place.bgImgs.length);
    }, 5000); // change image every 5 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [place.bgImgs.length]);

  return (
    <Link
      href={getSearchURL({pcity: place.code})}
      className="hover:underline pt-4 pl-4 space-y-2 bg-cover bg-center bg-no-repeat aspect-[4/3] text-white transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1)), url(${place.bgImgs[bgImageIndex]})`,
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
            code: "HN",
            title: "Hà Nội",
            bgImgs: [
              "https://file4.batdongsan.com.vn/images/newhome/cities1/HN-web-1.jpg",
              "https://file4.batdongsan.com.vn/images/newhome/cities1/HN-web-2.jpg",
              "https://file4.batdongsan.com.vn/images/newhome/cities1/HN-web-3.jpg",
            ],
          }}
        />
        <div className="grid grid-cols-2 gap-4">
          <Placecard
            place={{
              code: "SG",
              title: "Hồ Chí Minh",
              bgImgs: [
                "https://file4.batdongsan.com.vn/images/newhome/cities1/HCM-web-1.jpg",
                "https://file4.batdongsan.com.vn/images/newhome/cities1/HCM-web-2.jpg",
                "https://file4.batdongsan.com.vn/images/newhome/cities1/HCM-web-3.jpg",
              ],
            }}
          />
          <Placecard
            place={{
              code: "DDN",
              title: "Đà Nẵng",
              bgImgs: [
                "https://file4.batdongsan.com.vn/images/newhome/cities1/DDN-web-1.jpg",
                "https://file4.batdongsan.com.vn/images/newhome/cities1/DDN-web-2.jpg",
                "https://file4.batdongsan.com.vn/images/newhome/cities1/DDN-web-3.jpg",
              ],
            }}
          />
          <Placecard
            place={{
              code: "BD",
              title: "Bình Dương",
              bgImgs: [
                "https://file4.batdongsan.com.vn/images/newhome/cities1/BD-web-1.jpg",
                "https://file4.batdongsan.com.vn/images/newhome/cities1/BD-web-2.jpg"
              ],
            }}
          />
          <Placecard
            place={{
              code: "DNA",
              title: "Đồng Nai",
              bgImgs: [
                "https://file4.batdongsan.com.vn/images/newhome/cities1/DNA-web-1.jpg",
                "https://file4.batdongsan.com.vn/images/newhome/cities1/DNA-web-2.jpg",
                "https://file4.batdongsan.com.vn/images/newhome/cities1/DNA-web-3.jpg",
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};
