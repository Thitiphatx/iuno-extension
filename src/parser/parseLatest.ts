import type * as cheerio from "cheerio";
import type { IPage } from "../core/types";
import type { IAnimeItem } from "../core/types/anime";

export async function parseLatest(
  $: cheerio.CheerioAPI,
  page: number = 1,
): Promise<IPage<IAnimeItem>> {
  const items: IAnimeItem[] = [];
  $(".items.normal article").each((i, el) => {
    const cover = $(el).find("img.img-thumbnail").attr("src")?.replace(/-\d+x\d+(?=\.(jpg|jpeg|png|webp)$)/i, '').trim() ?? "";
    const url = $(el).find("a").attr("href")?.trim() ?? "";
    const title = $(el).find("a > h3").text() ?? "";
    items.push({
      url,
      title,
      cover,
    });
  });
  return {
    content: items,
    page: page,
    minPage: 1,
    maxPage: 10,
  };
}
