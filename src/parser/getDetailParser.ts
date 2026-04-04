import type * as cheerio from "cheerio";
import type { IAnimeDetail } from "../core/types/anime";

export function getDetailParser($: cheerio.CheerioAPI): IAnimeDetail {
    return {
        title: "",
        cover: "",
        description: "",
        tags: []
    };
}
