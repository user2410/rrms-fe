
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Editor from "@/components/ui/editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListingTag, ManagedListing } from "@/models/listing";
import { useState } from "react";
import { useDataCtx } from "../_context/data.context";
import { backendAPI } from "@/libs/axios";

type FormValues = {
  title: string;
  description: string;
  tags: string[];
}

export default function ListingDetail() {
  const { listing, sessionData, setListing } = useDataCtx();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [values, setValues] = useState<FormValues>({
    title: listing.title,
    description: listing.description,
    tags: listing.tags.map((tag: ListingTag) => tag.tag),
  });

  async function handleChangeEditing() {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    try {
      await backendAPI.patch(`/api/listings/listing/${listing.id}`, values, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        },
      });
      setListing({
        ...listing,
        ...values,
        tags: values.tags.map((tag) => ({
          id: 1,
          listingId: listing.id,
          tag,
        })),
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Chi tiết tin đăng</CardTitle>
        <span className="space-x-2">
          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setValues({
                  title: listing.title,
                  description: listing.description,
                  tags: listing.tags.map((tag: ListingTag) => tag.tag),
                });
                setIsEditing(v => !v);
              }}
            >
              Hủy chỉnh sửa
            </Button>
          )}
          <Button
            type="button"
            onClick={handleChangeEditing}
            variant={isEditing ? 'default' : 'outline'}
          >
            {isEditing ? 'Lưu' : 'Chỉnh sửa'}
          </Button>
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Tiêu đề</h3>
            {isEditing ? (
              <Input
                type="text"
                defaultValue={listing.title}
                value={values.title}
                onChange={(e) => setValues({ ...values, title: e.target.value })}
              />
            ) : (
              <p>{listing.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Mô tả</h3>
            {isEditing ? (
              <Editor
                value={values.description}
                onChange={(value) => setValues({ ...values, description: value })}
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: listing.description }}></div>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Gắn thẻ</h3>
            {isEditing ? (
              <>
                <Label>
                  Từ khóa bài đăng (tối đa 5 từ khóa, mỗi từ tối đa 32 ký tự)
                  {values.tags.length > 0 && (
                    <div className="hidden gap-1 lg:flex">
                      {values.tags.map((field, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="rounded-sm px-1 font-normal hover:cursor-pointer"
                          onClick={() => setValues(v => ({
                            ...v,
                            tags: values.tags.filter((_, j) => j !== i),
                          }))}
                        >
                          {field}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Label>
                <Input
                  placeholder="Nhập từ khóa, nhấn Enter để tạo"
                  onKeyDown={(e) => {
                    const v = e.currentTarget.value.trim();
                    if (e.key === "Enter" && values.tags.length < 5 && v !== "") {
                      e.preventDefault();
                      setValues(val => ({
                        ...val,
                        tags: [...val.tags, v],
                      }));
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </>
            ) : (
              values.tags.length === 0 ? (
                <p>Bài đăng chưa gắn thẻ</p>
              ) : (
                <div className="gap-1 lg:flex">
                  {values.tags.map((field, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal hover:cursor-pointer"
                    >
                      {field}
                    </Badge>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
