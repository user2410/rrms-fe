"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import Step1Features from "./_components/step1-features";
import Step1Address from "./_components/step1-address";
import Step1BasicInfo from "./_components/step1-basicinfo";
import Step1ExtraInfo from "./_components/step1-extrainfo";
import Step1MediaUpload from "./_components/step1-mediaupload";
import { Step1Tag } from "./_components/step1-tag";

export default function Step1() {

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <Card className="xl:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Thông tin cơ bản về bất động sản của bạn</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Step1BasicInfo/>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Địa chỉ</CardTitle>
          <CardDescription>Thông tin chi tiết địa chỉ của bất động sản</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Step1Address/>
        </CardContent>
      </Card>
      <Card className="xl:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle>Media</CardTitle>
          <CardDescription>Hình ảnh, video về bất động sản</CardDescription>
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
          <CardDescription>Giúp nhận diện bất động sản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <Step1ExtraInfo/>
        </CardContent>
      </Card>
      <Card className="xl:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle>Tiện ích</CardTitle>
          <CardDescription>Một số tiện ích, đặc điểm nổi bật của bất động sản</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Step1Features/>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Sắp xếp</CardTitle>
          <CardDescription>Thêm thông tin tùy chỉnh mô tả bất động sản của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Step1Tag/>
        </CardContent>
      </Card>
    </div>
  );
}
