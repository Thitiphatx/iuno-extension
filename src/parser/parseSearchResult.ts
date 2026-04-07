import type * as cheerio from "cheerio";
import type { IPage } from "../core/types";
import type { IAnimeItem } from "../core/types/anime";

export async function parseSearchResult(
  $: cheerio.CheerioAPI,
  page: number = 1,
): Promise<IPage<IAnimeItem>> {
  const items: IAnimeItem[] = [];

  $(".search-page .result-item article").each((i, el) => {
    const cover =
      $(el).find(".image .thumbnail.animation-2 a img").attr("src")?.replace(/-\d+x\d+(?=\.(jpg|jpeg|png|webp)$)/i, '').trim() ??
      "";
    const url = $(el).find("a").attr("href")?.trim() ?? "";
    const title =
      $(el).find(".image .thumbnail.animation-2 a img").attr("alt") ?? "";
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
    maxPage: 5,
  };
}
