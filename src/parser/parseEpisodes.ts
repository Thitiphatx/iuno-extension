import type * as cheerio from "cheerio";
import type { IEpisode, IGroupEpisode } from "../core/types/anime";

export async function parseEpisodes($: cheerio.CheerioAPI): Promise<IGroupEpisode[]> {
  const groups: IGroupEpisode[] = [];

  $("#seasons > div.se-c").each((i, el) => {
    const episodes: IEpisode[] = [];
    const title = $(el).find("span.title").text().trim() ?? "";
    
    $(el)
      .find(".se-a ul.episodios li")
      .each((indexEp, elementEp) => {
        const epNum =
          $(elementEp).find(".numerando").text().replace("ตอนที่", "").trim() ??
          undefined;
        const url = $(elementEp).find(".episodiotitle a").attr("href") ?? "";
        episodes.push({
          url,
          number: Number(epNum),
        });
      });
    groups.push({
      title,
      episodes,
    });
  });
  
  return groups;
}
