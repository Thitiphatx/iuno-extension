import type * as cheerio from "cheerio";
import type { IEpisode, IGroupEpisode } from "../core/types/anime";
import { cleanImageUrlSize } from "../utils";

export async function parseEpisodes(
  $: cheerio.CheerioAPI,
): Promise<IGroupEpisode[]> {
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
        const preview = $(elementEp).find(".imagen img").attr("src");
        episodes.push({
          url,
          preview:
            !preview || preview.includes("dt_backdrop.png")
              ? undefined
              : cleanImageUrlSize(preview),
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
