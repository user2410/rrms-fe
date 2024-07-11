"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Article } from "@/models/article";
import * as Tabs from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import { Clock, MoveRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type TAB = "GetNewNewsAsHtml" | "GetHotSubjectHNAsHtml" | "GetHotSubjectHCMAsHtml";
export default function NewsTab() {
  const [tab, setTab] = useState<TAB>("GetNewNewsAsHtml");
  const query = useQuery<Article[]>({
    queryKey: ["home", "news", tab],
    queryFn: async ({ queryKey }) => {
      const fetchedData = (await axios.get<Article[]>(`/api/news/${queryKey.at(-1)}?_r=${new Date().getTime()}`)).data;
      // for some weird reasons, vercel return empty result set with status 304
      if (fetchedData.length === 0) {
        return defaultArticles[queryKey.at(-1) as keyof typeof defaultArticles];
      }
      return fetchedData;
    },
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
  });

  return (
    <Tabs.Root defaultValue="GetNewNewsAsHtml" value={tab} onValueChange={v => { console.log("change", v); setTab(v as TAB); }} className="TabsRoot bg-transparent">
      <div className="flex flex-row justify-between items-center">
        <Tabs.List className="TabsList">
          {[
            {
              value: "GetNewNewsAsHtml",
              label: "Tin tức",
            },
            {
              value: "GetHotSubjectHNAsHtml",
              label: "BĐS HÀ NỘI",
            },
            {
              value: "GetHotSubjectHCMAsHtml",
              label: "BĐS TPHCM",
            }
          ].map((item, index) => (
            <Tabs.Trigger key={index} className="TabsTrigger" value={item.value}>
              <h2 className={clsx("text-base lg:text-lg xl:text-xl font-normal min-w-max", tab === item.value ? "text-foreground" : "text-muted-foreground")}>{item.label}</h2>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Link href="#" className="text-sm hover:underline hidden lg:flex flex-row items-center gap-1">
          Xem thêm
          <MoveRight className="h-4 w-4" />
        </Link>
      </div>
      <Tabs.Content className="TabsContent" value="GetNewNewsAsHtml">
        <TabView articles={query.data || []} />
      </Tabs.Content>
      <Tabs.Content className="TabsContent" value="GetHotSubjectHNAsHtml">
        <TabView articles={query.data || []} />
      </Tabs.Content>
      <Tabs.Content className="TabsContent" value="GetHotSubjectHCMAsHtml">
        <TabView articles={query.data || []} />
      </Tabs.Content>
    </Tabs.Root>
  );
};

function TabView({ articles }: { articles: Article[] }) {
  const [selectedArticle, setSelectedArticle] = useState<number>(0);

  return articles.length > 0 ? (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
      <Link
        target="_blank"
        href={articles[selectedArticle].originalSource ?? articles[selectedArticle].link}
      >
        <div className="space-y-2">
          <img src={articles[selectedArticle].imgSrc} alt={articles[selectedArticle].title} />
          <h2 className="font-bold text-xl mb-2">{articles[selectedArticle].title}</h2>
          <span className="flex flex-row items-center gap-1 text-sm text-gray-500">
            <Clock className="w-2 h-2 inline" />
            {articles[selectedArticle].time}
          </span>
        </div>
      </Link>
      <div>
        {articles.map((article, index) => (
          <Link
            key={index}
            target="_blank"
            href={article.originalSource ?? article.link}
            onMouseEnter={() => setSelectedArticle(index)}
          >
            <div className="py-4 cursor-pointer hover:underline border-b border-gray-200">
              <h2 className="text-base lg:text-lg mb-2">{article.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
      <div className="space-y-2">
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="w-full h-14" />
        <Skeleton className="h-5" />
      </div>
      <div>
        <div className="py-4 border-b">
          <Skeleton className="w-full h-13 p-3" />
        </div>
        <div className="py-4 border-b">
          <Skeleton className="w-full h-13 p-3" />
        </div>
        <div className="py-4 border-b">
          <Skeleton className="w-full h-13 p-3" />
        </div>
        <div className="py-4 border-b">
          <Skeleton className="w-full h-13 p-3" />
        </div>
      </div>
    </div>
  );
}

const defaultArticles = {
  "GetNewNewsAsHtml": [
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/dang-ky-tam-tru_online-1.webp",
      "title": "Hướng Dẫn 2 Cách Đăng Ký Tạm Trú Online Nhanh Chóng Nhất Năm 2024",
      "link": "/wiki/huong-dan-dang-ky-tam-tru-online-807675",
      "originalSource": "https://thanhnienviet.vn/2024/07/10/huong-dan-2-cach-dang-ky-tam-tru-online-nhanh-chong-nhat-nam-2024",
      "time": "21 giờ trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/03/lai-suat-ngan-hang-vietinbank.jpg",
      "title": "Lãi Suất Ngân Hàng VietinBank Tháng 7/2024",
      "link": "/wiki/lai-suat-ngan-hang-vietinbank-evr-796523",
      "originalSource": "https://thanhnienviet.vn/2024/06/10/lai-suat-ngan-hang-vietinbank-thang-6-2024",
      "time": "2 ngày trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/plant-pot-table-close-up_23-2148928479.jpg",
      "title": "Người Sinh Năm 1984 Mệnh Gì? Top 5 Loại Cây Phong Thủy Người Giáp Tý Nên Biết",
      "link": "/wiki/1984-menh-gi-807521",
      "originalSource": "https://thanhnienviet.vn/2024/07/08/nguoi-sinh-nam-1984-menh-gi-top-5-loai-cay-phong-thuy-nguoi-giap-ty-nen-biet",
      "time": "3 ngày trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/tuong-sinh-la-gi-6.png",
      "title": "Tương Sinh Là Gì? Cách Ứng Dụng Ngũ Hành Tương Sinh Khi Thiết Kế Nhà Ở 2024",
      "link": "/wiki/tuong-sinh-la-gi-807714",
      "originalSource": "https://thanhnienviet.vn/2024/07/08/tuong-sinh-la-gi-cach-ung-dung-ngu-hanh-tuong-sinh-khi-thiet-ke-nha-o-2024",
      "time": "3 ngày trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/ngay-dep-thang-7-nam-2024.jpg",
      "title": "Xem Ngày Đẹp Tháng 7 Năm 2024 Để Làm Nhà, Nhập Trạch, Mua Xe, Cưới Hỏi",
      "link": "/wiki/ngay-dep-thang-evr-794015",
      "originalSource": "https://thanhnienviet.vn/2024/07/05/xem-ngay-dep-thang-7-nam-2024-de-lam-nha-nhap-trach-mua-xe-cuoi-hoi",
      "time": "6 ngày trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2023/12/quy-nhon-thuoc-tinh-nao-1.jpg",
      "title": "Quy Nhơn Thuộc Tỉnh Nào? Cập Nhật Giá Thuê, Mua Nhà Mới Nhất",
      "link": "/wiki/quy-nhon-thuoc-tinh-nao-789980",
      "originalSource": "https://thanhnienviet.vn/2024/05/09/quy-nhon-thuoc-tinh-nao-tinh-hinh-thi-truong-bat-dong-san-ra-sao/",
      "time": "10 tuần trước"
    }
  ],
  "GetHotSubjectHNAsHtml": [
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/Mega-Grand-World-ha-noi-o-dau-1.jpg",
      "title": "Mega Grand World Hà Nội Ở Đâu? Giá Vé Và Kinh Nghiệm Đi Mega Grand World",
      "link": "/tin-tuc/mega-grand-world-ha-noi-o-dau-807277",
      "originalSource": "https://thanhnienviet.vn/2024/07/04/mega-grand-world-ha-noi-o-dau-gia-ve-va-kinh-nghiem-di-mega-grand-world",
      "time": "6 ngày trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/biet-thu-1.jpeg",
      "title": "Biệt Thự, Liền Kề Hà Nội: Giá Bán Tăng Nhẹ",
      "link": "/tin-tuc/biet-thu-lien-ke-ha-noi-gia-ban-tang-nhe-cd-hn-807032",
      "originalSource": "https://thanhnienviet.vn/2024/07/02/biet-thu-lien-ke-ha-noi-gia-ban-tang-nhe",
      "time": "7 ngày trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/dat-nen-1.webp",
      "title": "Thị Trường Đất Nền: Giới Đầu Tư Đang Ráo Riết Săn Hàng",
      "link": "/tin-tuc/thi-truong-dat-nen-gioi-dau-tu-dang-rao-riet-san-hang-cd-hn-806995",
      "originalSource": "https://thanhnienviet.vn/2024/07/02/thi-truong-dat-nen-gioi-dau-tu-dang-rao-riet-san-hang",
      "time": "1 tuần trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/chung-cu-2.jpeg",
      "title": "Chung Cư Hà Nội: Nhà Chưa Sổ Vẫn Hút Khách",
      "link": "/tin-tuc/chung-cu-ha-noi-nha-chua-so-van-hut-khach-cd-hn-806908",
      "originalSource": "https://thanhnienviet.vn/2024/07/02/chung-cu-ha-noi-nha-chua-so-van-hut-khach",
      "time": "1 tuần trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/hoa-lac-2.jpg",
      "title": "Đất Nền Hòa Lạc (Hà Nội) Bắt Đầu Tăng Giá",
      "link": "/tin-tuc/dat-nen-hoa-lac-ha-noi-bat-dau-tang-gia-cd-hn-806874",
      "originalSource": "https://thanhnienviet.vn/2024/07/01/dat-nen-hoa-lac-ha-noi-bat-dau-tang-gia",
      "time": "1 tuần trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/05/chung-cu-2.webp",
      "title": "Thị Trường Chung Cư Hà Nội Tháng 5/2024: Điểm Sáng Trên Bức Tranh Sụt Giảm",
      "link": "/tin-tuc/thi-truong-chung-cu-ha-noi-evr-795400",
      "originalSource": "https://thanhnienviet.vn/2024/06/28/thi-truong-chung-cu-ha-noi-thang-5-2024-diem-sang-tren-buc-tranh-sut-giam",
      "time": "1 tuần trước"
    }
  ],
  "GetHotSubjectHCMAsHtml": [
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/02/365759406_10224056830750730_804422244735425949_n.jpg",
      "title": "TP.HCM: Giá Chung Cư Cao Cấp Tăng Vì Thiếu Nguồn Cung",
      "link": "/tin-tuc/gia-chung-cu-cao-cap-tp-hcm-tang-cd-hcm-807975",
      "originalSource": "https://thanhnienviet.vn/2024/07/10/tp-hcm-gia-chung-cu-cao-cap-tang-vi-thieu-nguon-cung",
      "time": "18 giờ trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2023/05/Week-1.1-Mizuki.00_02_33_14.Still010-2.png",
      "title": "TP HCM: Sức Mua Đổ Về Các Dự Án Hoàn Thiện",
      "link": "/tin-tuc/tp-hcm-suc-mua-do-ve-cac-du-an-hoan-thien-cd-hcm-806589",
      "originalSource": "https://thanhnienviet.vn/2024/07/02/tp-hcm-suc-mua-do-ve-cac-du-an-hoan-thien",
      "time": "1 tuần trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/05/54.jpg",
      "title": "Quý 2/2024: Nhà Riêng, Đất Nền Giao Dịch Chậm Hơn Đầu Năm",
      "link": "/tin-tuc/giao-dich-nha-rieng-dat-nen-dang-cham-lai-cd-hcm-806528",
      "originalSource": "https://thanhnienviet.vn/2024/07/01/quy-2-2024-nha-rieng-dat-nen-giao-dich-cham-hon-dau-nam",
      "time": "1 tuần trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/06/2.jpeg",
      "title": "Thực Hư Giá Thứ Cấp Chung Cư TP.HCM Tăng Trở Lại?",
      "link": "/tin-tuc/gia-chung-cu-tp-hcm-van-giam-tren-thi-truong-thu-cap-cd-hcm-806087",
      "originalSource": "https://thanhnienviet.vn/2024/06/24/thuc-hu-gia-thu-cap-chung-cu-tp-hcm-tang-tro-lai",
      "time": "2 tuần trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/06/12-scaled.jpg",
      "title": "Biến Động Giá Trên Thị Trường BĐS TP.HCM Tháng 5/2024",
      "link": "/tin-tuc/thi-truong-bds-tp-hcm-evr-794905",
      "originalSource": "https://thanhnienviet.vn/2024/06/17/bien-dong-gia-tren-thi-truong-bds-tp-hcm-thang-5-2024",
      "time": "3 tuần trước"
    },
    {
      "imgSrc": "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/06/D75_84971.jpg",
      "title": "Khởi Công Dự Án Khu Dân Cư An Huy Đức Hòa",
      "link": "/tin-tuc/khoi-cong-du-an-khu-dan-cu-an-huy-duc-hoa-805287",
      "originalSource": "https://thanhnienviet.vn/2024/06/16/khoi-cong-du-an-khu-dan-cu-an-huy-duc-hoa",
      "time": "3 tuần trước"
    }
  ],
};
