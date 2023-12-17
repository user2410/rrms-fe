import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyTag } from "@/models/property";
import Link from "next/link";

export default function Tags({tags} : {tags: PropertyTag[]}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tìm kiếm theo từ khóa</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row gap-2">
        {tags.map((tag, index) => (
          <Link key={index} href="/"><Badge className="bg-gray-100 text-gray-500">{tag.tag}</Badge></Link>
        ))}
      </CardContent>
    </Card>
  );
}
