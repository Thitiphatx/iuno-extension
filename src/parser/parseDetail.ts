import type * as cheerio from "cheerio";
import type { IAnimeDetail, ITag } from "../core/types/anime";

export async function parseDetail($: cheerio.CheerioAPI): Promise<IAnimeDetail> {
  const cover =
    $("#single > div.content > div.sheader > div.poster > img").attr("src") ??
    "";
  const title =
    $("#single > div.content > div.sheader > div.data > h1").text().trim() ??
    "";
  const description =
    $("#episodes > div.wp-content > p:nth-child(1)").text().trim() ?? "";
  const tags: ITag[] = [];

  $(
    "#single > div.content > div.sheader > div.data > div:nth-child(6) a[href]",
  ).each((i, el) => {
    const tagLabel = $(el).text().trim() ?? "";
    const tagUrl = $(el).attr("href")?.trim() ?? "";
    tags.push({
      url: tagUrl,
      label: tagLabel,
    });
  });

  return {
    title,
    description,
    cover,
    tags,
  };
}
