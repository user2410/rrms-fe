"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { DialogClose } from "@radix-ui/react-dialog";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useRef } from "react";
import toast from "react-hot-toast";

export default function PropertyCard({ property }: { property: Property }) {
  const router = useRouter();

  const deleteDialogBtn = useRef<HTMLButtonElement>(null);

  async function handleDeleteProperty() {
    try {
      await backendAPI.delete(`api/properties/${property.id}`);
      toast.success("Đã xoá bất động sản này");
    } catch(err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi xoá bất động sản này");
    }
  }

  return (
    <Fragment>
      <Card className="w-full overflow-hidden">
        <Dialog>
          <DialogTrigger asChild><button hidden ref={deleteDialogBtn} /></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xóa bất động sản này</DialogTitle>
              <DialogDescription>NOTE: Bất động sản không sử dụng chức năng quản lý dịch vụ hoặc đăng tin sẽ không tiêu tốn chi phí.</DialogDescription>
            </DialogHeader>
            <p>Xoá bất động sản này sẽ xóa tất cả các tin đăng liên quan</p>
            <p>Bạn có chắc chắn muốn xoá bất động sản này?</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Huỷ</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" variant="destructive" onClick={handleDeleteProperty}>Xoá</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <CardHeader className="w-full p-0">
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              aspectRatio: "16/9",
            }}
            center={{ lat: property.lat, lng: property.lng }}
            zoom={15}
          >
            <MarkerF position={{ lat: property.lat, lng: property.lng }} />
          </GoogleMap>
        </CardHeader>
        <CardContent className="mt-3 space-y-2">
          <div className="flex flex-row justify-between">
            <CardTitle className="font-medium text-lg">{property.fullAddress}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">...</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/manage/properties/property/${property.id}`)}>Xem chi tiết</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/manage/properties/property/${property.id}`)}>Sửa</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive hover:bg-red-200" onClick={() => deleteDialogBtn.current?.click()}>Xoá</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="text-sm text-muted-foreground flex flex-row gap-2">
            <span>1 Unit</span>
            <Link href={"/"}>Manage Unit</Link>
          </CardDescription>
          <Separator />
          <div className="flex flex-row justify-between">
            <div className="font-normal text-base">Tin đăng: {"Không có"}</div>
            <Link href={"/"}>Reactivate</Link>
          </div>
        </CardContent>
      </Card>
    </Fragment>
  );
};
