import type * as cheerio from "cheerio";
import type { IPage } from "../core/types";
import type { IAnimeItem } from "../core/types/anime";

export async function parseSearchResult(
  $: cheerio.CheerioAPI,
  page: number = 1,
): Promise<IPage<IAnimeItem>> {
  const items: IAnimeItem[] = [];

  $(".result-item").each((i, el) => {
    const img = $(el).find(".image img");
    let cover =
      img.attr("data-lazy-src")?.trim() ||
      img.attr("data-src")?.trim() ||
      img.attr("src")?.trim() ||
      "";

    if (cover.startsWith("//")) {
      cover = `https:${cover}`;
    }
    const url = $(el).find(".title a").attr("href") ?? "";
    const title = $(el).find(".title a").text().trim() ?? "";
    items.push({
      url,
      title,
      cover,
    });
  });

  const lastPage =
    parseInt($(".pagination .nav-links a.page-numbers").last().text()) || page;

  return {
    content: items,
    page: page,
    minPage: 1,
    maxPage: lastPage,
  };
}
