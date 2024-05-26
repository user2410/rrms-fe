import { Article } from "@/models/article";
import * as cheerio from "cheerio";

export interface WebScrapper {
  scrape(url: string) : Promise<Article[]>;
}

export class BatdongsanVNScrapper implements WebScrapper{
  private domain = "https://batdongsan.com.vn";

  constructor() {}

  private getNews(url: string) {
    return fetch(url, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        Referer: "https://batdongsan.com.vn/",
      },
      body: null,
      method: "GET",
    });
  }

  private async getOriginalSource(url: string) {
    // follow the link
    const res = await fetch(url, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua":
          '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
      },
      body: null,
      method: "GET",
    });
    if (res.status !== 200) {
      throw {
        status: res.status,
        data: res.body,
      };
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    const sourceElement = $(
      "div[class^='ArticlePageTemplate_tnvUrlSection__']",
    );
    if (sourceElement.length === 0) {
      throw new Error("No source element");
    }
    return sourceElement.attr("title");
  }

  async scrape(url: string) : Promise<Article[]> {
    const request = await this.getNews(url);
    const html = await request.text();
    const $ = cheerio.load(html);
    const news : Article[] = [];

    const itemElements = $("div.re__article-info-container").find(
      "div.re__article-info-item",
    );
    
    // traverse itemElements
    for (const item of itemElements) {
      const a = $(item).find("h3").find("a");
      const time = $(item).find("span.article-time").find("span").text();
      // console.log({ time });
      const imgSrc = $(a).find("img").attr("data-src");
      const title = $(a).find("span").text();
      const link = a.attr("href");
      // follow the link
      var originalSource: string | undefined;
      try {
        originalSource = await this.getOriginalSource(this.domain + link!);
      } catch(err) {
        console.error(err);
      }
      // console.log({ link, imgSrc, title });
      news.push({
        imgSrc: imgSrc!,
        title: title!,
        link: link!,
        originalSource,
        time: time,
      });
    }
    return news;
  }
}
