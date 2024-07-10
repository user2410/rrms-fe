"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArticleList } from "@/models/article";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

const baseUrl = "https://batdongsan.com.vn/";

type Data = {
  data: {
    popularArticles: ArticleList;
  }
};

export default function Sidebar() {
  const query = useQuery<Data>({
    queryKey: ["news", "sidebar"],
    queryFn: async ({ queryKey }) => {
      return (await axios.post<Data>("https://api-angel-green.batdongsan.com.vn/graphql/bds", {
        "operationName": "Query",
        "variables": {
          "page": 1,
          "pageSize": 5,
          "market": "vn",
          "language": "vn",
          "category": [
            "news"
          ],
          "exclude": [807759, 103041, 807639, 807575],
        },
        "query": "query Query($page: Int, $pageSize: Int, $market: String!, $language: String, $category: [String], $exclude: [Int]) {\n  popularArticles(\n    page: $page\n    pageSize: $pageSize\n    market: $market\n    language: $language\n    category: $category\n    exclude: $exclude\n  ) {\n    totalCount\n    totalPage\n    items {\n      id\n      title\n     slug\n      link\n      author {\n        id\n        __typename\n      }\n      category {\n        slug\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}"
      })).data;
    },
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 30,
  });

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Bài viết được xem nhiều nhất</CardTitle>
        </CardHeader>
        <CardContent className="">
          <Table>
            <TableBody>
              {query.data?.data.popularArticles.items.map((article, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="text-sm font-semibold">
                    <Link href={`${baseUrl}/tin-tuc/${article.link}`}>
                      {article.title}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Thị trường BĐS tại các tỉnh / thành sôi động nhất</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row justify-center gap-2">\
          <Link href=""></Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Thị trường BĐS tại 10 tỉnh / thành phố lớn</CardTitle>
        </CardHeader>
        <CardContent>

        </CardContent>
      </Card> */}
    </div>
  );
};
