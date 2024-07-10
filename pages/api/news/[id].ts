import type { NextApiRequest, NextApiResponse } from "next";
import { BatdongsanVNScrapper } from "./get-news";

const timeout = 3000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const { id } = req.query;
  if (
    typeof id !== "string" ||
    ![
      "GetNewNewsAsHtml",
      "GetHotSubjectHNAsHtml",
      "GetHotSubjectHCMAsHtml",
    ].includes(id)
  ) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(defaultArticles[id as keyof typeof defaultArticles]);
    }, timeout);
  });

  try {
    const scrapper = new BatdongsanVNScrapper();
    const articles = await Promise.race([
      scrapper.scrape(
        `https://batdongsan.com.vn/microservice-architecture-router/Systems/Home/${id}`,
      ),
      timeoutPromise,
    ]);
    return res.status(200).json(articles);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const defaultArticles = {
  GetNewNewsAsHtml: [
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/dang-ky-tam-tru_online-1.webp",
      title:
        "Hướng Dẫn 2 Cách Đăng Ký Tạm Trú Online Nhanh Chóng Nhất Năm 2024",
      link: "/wiki/huong-dan-dang-ky-tam-tru-online-807675",
      originalSource:
        "https://thanhnienviet.vn/2024/07/10/huong-dan-2-cach-dang-ky-tam-tru-online-nhanh-chong-nhat-nam-2024",
      time: "6 giờ trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/03/lai-suat-ngan-hang-vietinbank.jpg",
      title: "Lãi Suất Ngân Hàng VietinBank Tháng 7/2024",
      link: "/wiki/lai-suat-ngan-hang-vietinbank-evr-796523",
      originalSource:
        "https://thanhnienviet.vn/2024/06/10/lai-suat-ngan-hang-vietinbank-thang-6-2024",
      time: "23 giờ trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/plant-pot-table-close-up_23-2148928479.jpg",
      title:
        "Người Sinh Năm 1984 Mệnh Gì? Top 5 Loại Cây Phong Thủy Người Giáp Tý Nên Biết",
      link: "/wiki/1984-menh-gi-807521",
      originalSource:
        "https://thanhnienviet.vn/2024/07/08/nguoi-sinh-nam-1984-menh-gi-top-5-loai-cay-phong-thuy-nguoi-giap-ty-nen-biet",
      time: "2 ngày trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/tuong-sinh-la-gi-6.png",
      title:
        "Tương Sinh Là Gì? Cách Ứng Dụng Ngũ Hành Tương Sinh Khi Thiết Kế Nhà Ở 2024",
      link: "/wiki/tuong-sinh-la-gi-807714",
      originalSource:
        "https://thanhnienviet.vn/2024/07/08/tuong-sinh-la-gi-cach-ung-dung-ngu-hanh-tuong-sinh-khi-thiet-ke-nha-o-2024",
      time: "2 ngày trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/ngay-dep-thang-7-nam-2024.jpg",
      title:
        "Xem Ngày Đẹp Tháng 7 Năm 2024 Để Làm Nhà, Nhập Trạch, Mua Xe, Cưới Hỏi",
      link: "/wiki/ngay-dep-thang-evr-794015",
      originalSource:
        "https://thanhnienviet.vn/2024/07/05/xem-ngay-dep-thang-7-nam-2024-de-lam-nha-nhap-trach-mua-xe-cuoi-hoi",
      time: "5 ngày trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2023/12/quy-nhon-thuoc-tinh-nao-1.jpg",
      title: "Quy Nhơn Thuộc Tỉnh Nào? Cập Nhật Giá Thuê, Mua Nhà Mới Nhất",
      link: "/wiki/quy-nhon-thuoc-tinh-nao-789980",
      originalSource:
        "https://thanhnienviet.vn/2024/05/09/quy-nhon-thuoc-tinh-nao-tinh-hinh-thi-truong-bat-dong-san-ra-sao/",
      time: "10 tuần trước",
    },
  ],
  GetHotSubjectHNAsHtml: [
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/Mega-Grand-World-ha-noi-o-dau-1.jpg",
      title:
        "Mega Grand World Hà Nội Ở Đâu? Giá Vé Và Kinh Nghiệm Đi Mega Grand World",
      link: "/tin-tuc/mega-grand-world-ha-noi-o-dau-807277",
      originalSource:
        "https://thanhnienviet.vn/2024/07/04/mega-grand-world-ha-noi-o-dau-gia-ve-va-kinh-nghiem-di-mega-grand-world",
      time: "5 ngày trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/biet-thu-1.jpeg",
      title: "Biệt Thự, Liền Kề Hà Nội: Giá Bán Tăng Nhẹ",
      link: "/tin-tuc/biet-thu-lien-ke-ha-noi-gia-ban-tang-nhe-cd-hn-807032",
      originalSource:
        "https://thanhnienviet.vn/2024/07/02/biet-thu-lien-ke-ha-noi-gia-ban-tang-nhe",
      time: "6 ngày trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/dat-nen-1.webp",
      title: "Thị Trường Đất Nền: Giới Đầu Tư Đang Ráo Riết Săn Hàng",
      link: "/tin-tuc/thi-truong-dat-nen-gioi-dau-tu-dang-rao-riet-san-hang-cd-hn-806995",
      originalSource:
        "https://thanhnienviet.vn/2024/07/02/thi-truong-dat-nen-gioi-dau-tu-dang-rao-riet-san-hang",
      time: "7 ngày trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/chung-cu-2.jpeg",
      title: "Chung Cư Hà Nội: Nhà Chưa Sổ Vẫn Hút Khách",
      link: "/tin-tuc/chung-cu-ha-noi-nha-chua-so-van-hut-khach-cd-hn-806908",
      originalSource:
        "https://thanhnienviet.vn/2024/07/02/chung-cu-ha-noi-nha-chua-so-van-hut-khach",
      time: "7 ngày trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/07/hoa-lac-2.jpg",
      title: "Đất Nền Hòa Lạc (Hà Nội) Bắt Đầu Tăng Giá",
      link: "/tin-tuc/dat-nen-hoa-lac-ha-noi-bat-dau-tang-gia-cd-hn-806874",
      originalSource:
        "https://thanhnienviet.vn/2024/07/01/dat-nen-hoa-lac-ha-noi-bat-dau-tang-gia",
      time: "1 tuần trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/05/chung-cu-2.webp",
      title:
        "Thị Trường Chung Cư Hà Nội Tháng 5/2024: Điểm Sáng Trên Bức Tranh Sụt Giảm",
      link: "/tin-tuc/thi-truong-chung-cu-ha-noi-evr-795400",
      originalSource:
        "https://thanhnienviet.vn/2024/06/28/thi-truong-chung-cu-ha-noi-thang-5-2024-diem-sang-tren-buc-tranh-sut-giam",
      time: "1 tuần trước",
    },
  ],
  GetHotSubjectHCMAsHtml: [
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/02/365759406_10224056830750730_804422244735425949_n.jpg",
      title: "TP.HCM: Giá Chung Cư Cao Cấp Tăng Vì Thiếu Nguồn Cung",
      link: "/tin-tuc/gia-chung-cu-cao-cap-tp-hcm-tang-cd-hcm-807975",
      originalSource:
        "https://thanhnienviet.vn/2024/07/10/tp-hcm-gia-chung-cu-cao-cap-tang-vi-thieu-nguon-cung",
      time: "3 giờ trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2023/05/Week-1.1-Mizuki.00_02_33_14.Still010-2.png",
      title: "TP HCM: Sức Mua Đổ Về Các Dự Án Hoàn Thiện",
      link: "/tin-tuc/tp-hcm-suc-mua-do-ve-cac-du-an-hoan-thien-cd-hcm-806589",
      originalSource:
        "https://thanhnienviet.vn/2024/07/02/tp-hcm-suc-mua-do-ve-cac-du-an-hoan-thien",
      time: "1 tuần trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/05/54.jpg",
      title: "Quý 2/2024: Nhà Riêng, Đất Nền Giao Dịch Chậm Hơn Đầu Năm",
      link: "/tin-tuc/giao-dich-nha-rieng-dat-nen-dang-cham-lai-cd-hcm-806528",
      originalSource:
        "https://thanhnienviet.vn/2024/07/01/quy-2-2024-nha-rieng-dat-nen-giao-dich-cham-hon-dau-nam",
      time: "1 tuần trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/06/2.jpeg",
      title: "Thực Hư Giá Thứ Cấp Chung Cư TP.HCM Tăng Trở Lại?",
      link: "/tin-tuc/gia-chung-cu-tp-hcm-van-giam-tren-thi-truong-thu-cap-cd-hcm-806087",
      originalSource:
        "https://thanhnienviet.vn/2024/06/24/thuc-hu-gia-thu-cap-chung-cu-tp-hcm-tang-tro-lai",
      time: "2 tuần trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/06/12-scaled.jpg",
      title: "Biến Động Giá Trên Thị Trường BĐS TP.HCM Tháng 5/2024",
      link: "/tin-tuc/thi-truong-bds-tp-hcm-evr-794905",
      originalSource:
        "https://thanhnienviet.vn/2024/06/17/bien-dong-gia-tren-thi-truong-bds-tp-hcm-thang-5-2024",
      time: "3 tuần trước",
    },
    {
      imgSrc:
        "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2024/06/D75_84971.jpg",
      title: "Khởi Công Dự Án Khu Dân Cư An Huy Đức Hòa",
      link: "/tin-tuc/khoi-cong-du-an-khu-dan-cu-an-huy-duc-hoa-805287",
      originalSource:
        "https://thanhnienviet.vn/2024/06/16/khoi-cong-du-an-khu-dan-cu-an-huy-duc-hoa",
      time: "3 tuần trước",
    },
  ],
};
