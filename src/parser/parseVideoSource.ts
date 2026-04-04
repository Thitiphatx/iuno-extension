import type * as cheerio from "cheerio";

export function parseApiUrl($: cheerio.CheerioAPI): string {
  const opt = $(".dooplay_player_option").first();
  if (!opt.length) throw new Error("No player found");

  const post = opt.attr("data-post");
  const type = opt.attr("data-type");
  const nume = opt.attr("data-nume");

  if (!post || !type || !nume) {
    throw new Error("Required player data-attributes not found");
  }

  return `${post}/${type}/${nume}`;
}

export function parseVideoSource($: cheerio.CheerioAPI): string {
  const dataAttr = $("#app").attr("data-page");
  if (!dataAttr) throw new Error("Data not found");

  const pageData = JSON.parse(dataAttr);
  const source = pageData.props?.video?.url;

  if (!source) throw new Error("Video URL missing in page data");
  return source;
}
