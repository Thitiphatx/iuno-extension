import type * as cheerio from "cheerio";
import type { IPage } from "../core/types";
import type { IAnimeItem } from "../core/types/anime";

export async function parseLatest(
  $: cheerio.CheerioAPI,
  page: number = 1,
): Promise<IPage<IAnimeItem>> {
  const items: IAnimeItem[] = [];

  $("article").each((i, el) => {
    const img = $(el).find("img");
    let cover =
      img.attr("data-lazy-src")?.trim() ||
      img.attr("data-src")?.trim() ||
      img.attr("src")?.trim() ||
      "";

    if (cover.startsWith("//")) {
      cover = `https:${cover}`;
    }

    const url = $(el).find("a").attr("href")?.trim() ?? "";
    const title = $(el).find(".movie-title").text().trim() ?? "";
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
