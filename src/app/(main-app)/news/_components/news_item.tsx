import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArticleItem } from "@/models/article";
import Link from "next/link";

const baseUrl = "https://batdongsan.com.vn/";

export default function NewsItem({
  article,
} : {
  article: ArticleItem;
}) {
  return (
    <Card className="border-none py-2.5 px-2">
      <div className="flex flex-row gap-3">
        <div className="w-64 flex-[20%]">
          <Link target="_blank" href={`${baseUrl}/tin-tuc/${article.link}`}>
            <span className="bg-slate-400 text-white rounded-sm absolute text-ellipsis mt-2 uppercase py-0.5 px-2 font-semibold text-base leading-4"> Tin tức </span>
            <img src={article.featuredImage} className="rounded-md h-[156px] w-[260px] object-cover m-0 inline-block"/>
          </Link>
        </div>
        <div className="flex-[80%]">
          <div className="border-box">
            <p>
              <span className=" text-sm text-muted-foreground leading-4">
                {article.postDate as any} • {article.author.name}
              </span>
            </p>
          </div>
          <h3>
            <Link target="_blank" href={`${baseUrl}/tin-tuc/${article.link}`} className="font-semibold text-lg">
            {article.title}
            </Link>
          </h3>
          <div className="text-black font-normal text-base leading-5">
            <p>{article.excerpt}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-center pl-0 pt-3 font-normal text-base leading-5 gap-2">
        {article.tags?.map((tag, index) => (
          <Badge key={index} className="list-none inline-block rounded-sm py-1 px-4 cursor-pointer no-underline font-normal text-sm leading-5 h-fit bg-slate-400 hover:bg-slate-600">
            {tag.name}
          </Badge>
        ))}
      </div>
    </Card>
  );
};
