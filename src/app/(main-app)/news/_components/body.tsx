"use client";

import { ArticleItem, ArticleList } from "@/models/article";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import NewsItem from "./news_item";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type Data = {
  data: {
    articleList: ArticleList;
  };
};

const pageSize = 6;

export default function Body() {
  const [page, setPage] = useState<number>(1);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [total, setTotal] = useState<{
    totalCount: number;
    totalPage: number;
  }>({
    totalCount: 0,
    totalPage: 0,
  });

  const query = useQuery<Data>({
    queryKey: ["news", "main", page],
    queryFn: async ({ queryKey }) => {
      return (await axios.post<Data>("https://api-angel-green.batdongsan.com.vn/graphql/bds", {
        "operationName": "Query",
        "variables": {
          "page": queryKey.at(-1),
          "pageSize": pageSize,
          "market": "vn",
          "language": "vn",
          "category": ["news"],
          "exclude": [807759, 103041, 807639, 807575]
        },
        "query": "query Query($page: Int, $pageSize: Int, $market: String!, $language: String, $category: [String], $exclude: [Int], $tag: String) {\n  articleList(\n    page: $page\n    pageSize: $pageSize\n    market: $market\n    language: $language\n    category: $category\n    exclude: $exclude\n    tag: $tag\n  ) {\n    totalCount\n    totalPage\n    items {\n      id\n      title\n      excerpt\n      slug\n      link\n      featuredImage\n      postDate\n      modifiedDate\n      location\n      author {\n        id\n        name\n        slug\n        link\n        profilePhoto\n        __typename\n      }\n      sponsor {\n        slug\n        name\n        picture\n        bio\n        __typename\n      }\n      category {\n        id\n        name\n        slug\n        link\n        __typename\n      }\n      tags {\n        id\n        name\n        slug\n        link\n        __typename\n      }\n      profiles {\n        id\n        name\n        slug\n        link\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}"
      })).data;
    },
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setArticles((prevArticles) => [...prevArticles, ...query.data.data.articleList.items]);
      setTotal({
        totalCount: query.data.data.articleList.totalCount,
        totalPage: query.data.data.articleList.totalPage,
      });
    }
  }, [query.isSuccess && query.data]);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
      {articles.map((a, i) => (
        <Fragment key={i}>
          <NewsItem article={a}/>
        </Fragment>
      ))}
      </div>
      <div className="flex flex-row justify-center">
        <Button variant="outline" onClick={() => setPage(v => v+1)}>Xem thêm</Button>
      </div>
    </div>
  );
};
