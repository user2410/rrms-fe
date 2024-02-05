"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import Step1Features from "./_components/step1-features";
import Step1Address from "./_components/step1-address";
import Step1BasicInfo from "./_components/step1-basicinfo";
import Step1ExtraInfo from "./_components/step1-extrainfo";
import Step1MediaUpload from "./_components/step1-mediaupload";

export default function Step1() {

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <Card className="xl:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Thông tin cơ bản về nhà cho thuê của bạn</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Step1BasicInfo/>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Địa chỉ</CardTitle>
          <CardDescription>Thông tin chi tiết địa chỉ của nhà cho thuê</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Step1Address/>
        </CardContent>
      </Card>
      <Card className="xl:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle>Media</CardTitle>
          <CardDescription>Hình ảnh, video về nhà cho thuê</CardDescription>
        </CardHeader>
        <CardContent>
          <Step1MediaUpload
            accept="image/*"
            multiple={true}
          />
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Thông tin thêm</CardTitle>
          <CardDescription>Giúp nhận diện nhà cho thuê của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <Step1ExtraInfo/>
        </CardContent>
      </Card>
      <Card className="xl:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle>Tiện ích</CardTitle>
          <CardDescription>Một số tiện ích, đặc điểm nổi bật của nhà cho thuê</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Step1Features/>
        </CardContent>
      </Card>
    </div>
  );
}
