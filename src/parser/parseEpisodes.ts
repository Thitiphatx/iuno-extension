import type * as cheerio from "cheerio";
import type { IEpisode, IGroupEpisode } from "../core/types/anime";
import { cleanImageUrlSize } from "../utilts";

export async function parseEpisodes(
  $: cheerio.CheerioAPI,
): Promise<IGroupEpisode[]> {
  const groups: IGroupEpisode[] = [];

  $("#seasons .se-c").each((i, el) => {
    const episodes: IEpisode[] = [];
    const title = $(el).find("span.title").text().trim() ?? "";

    $(el)
      .find(".se-a ul.episodios li")
      .each((indexEp, elementEp) => {
        const epNum =
          $(elementEp).find(".numerando").text().split("-").at(-1)?.trim() ??
          undefined;
        const url = $(elementEp).find(".episodiotitle a").attr("href") ?? "";
        const img = $(elementEp).find(".imagen img");
        let preview =
          img.attr("data-lazy-src")?.trim() ||
          img.attr("data-src")?.trim() ||
          img.attr("src")?.trim() ||
          "";

        if (preview.startsWith("//")) {
          preview = `https:${preview}`;
        }
        console.log(
          !preview || preview.includes("dt_backdrop")
            ? undefined
            : cleanImageUrlSize(preview),
        );
        episodes.push({
          url,
          number: Number(epNum),
          preview:
            !preview || preview.includes("dt_backdrop")
              ? undefined
              : cleanImageUrlSize(preview),
        });
      });

    groups.push({
      title,
      episodes,
    });
  });
  return groups;
}
