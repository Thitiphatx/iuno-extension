import type * as cheerio from "cheerio";
import type { IPage } from "../core/types";
import type { IAnimeItem } from "../core/types/anime";

export function getSearchResultParser(
    $: cheerio.CheerioAPI,
    page: number = 1
): IPage<IAnimeItem> {
    const items: IAnimeItem[] = [];

    return {
        content: items,
        page: page,
        minPage: 1,
        maxPage: 1,
    };
}
