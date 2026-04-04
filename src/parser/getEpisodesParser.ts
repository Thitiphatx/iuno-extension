import type * as cheerio from "cheerio";
import type { IGroupEpisode } from "../core/types/anime";

export function getEpisodesParser($: cheerio.CheerioAPI): IGroupEpisode[] {
    return [{
        title: "Default",
        episodes: []
    }];
}
