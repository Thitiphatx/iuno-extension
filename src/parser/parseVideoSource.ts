import type * as cheerio from "cheerio";

export function extractIframeSrc(html: string): string | undefined {
  const match = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : undefined;
}

export function extractListServer(html: string): any[] {
  const match = html.match(/list_server\s*:\s*(\[[^]*?\])/);
  if (!match) return [];
  try {
    // Basic attempt to fix unquoted keys if necessary, 
    // but usually these are already valid JSON strings in the script
    return JSON.parse(match[1]!!);
  } catch (e) {
    return [];
  }
}

export function extractSources(html: string): string | undefined {
  const match = html.match(/["']file["']\s*:\s*["']([^"']+)["']/);
  return match ? match[1] : undefined;
}

export function parseVideoSource($: cheerio.CheerioAPI): string {
  const dataAttr = $("#app").attr("data-page");
  if (!dataAttr) throw new Error("Data not found");

  const pageData = JSON.parse(dataAttr);
  const source = pageData.props?.video?.url;

  if (!source) throw new Error("Video URL missing in page data");
  return source;
}
