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
    queryKey: ["news", tab],
    queryFn: async ({ queryKey }) => {
      return (await axios.get<Article[]>(`/api/news/${queryKey.at(1)}`)).data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
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
              <h2 className={clsx("text-2xl font-normal min-w-max", tab === item.value ? "text-foreground" : "text-muted-foreground")}>{item.label}</h2>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Link href="#" className="text-sm hover:underline flex flex-row items-center gap-1">
          Xem thêm
          <MoveRight className="h-4 w-4"/>
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
    <div className="grid grid-cols-2 gap-7">
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
              <h2 className="text-lg mb-2">{article.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-7">
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
