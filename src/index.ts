import axios, { type AxiosInstance } from "axios";
import * as cheerio from "cheerio";
import type { IPage } from "./core/types";
import type {
  IAnimeDetail,
  IAnimeItem,
  IGroupEpisode,
} from "./core/types/anime";
import type { IExtension } from "./core/types/extension";
import { parseDetail } from "./parser/parseDetail";
import { parseEpisodes } from "./parser/parseEpisodes";
import { parseLatest } from "./parser/parseLatest";
import {
  extractIframeSrc,
  extractListServer,
  extractSources,
} from "./parser/parseVideoSource";
import { cleanImageUrlSize } from "./utilts";

export class AnimeWakuExtension implements IExtension {
  id = "animewaku";
  name = "Animewaku";
  icon =
    "https://www.animewaku.com/wp-content/uploads/2024/02/cropped-Favicon-192x192.png";
  baseUrl = "https://www.animewaku.com";
  referer = "https://private-okru.doodee-player.com";
  headers = {
    "Ext-user-agent":
      "Mozilla/5.0 (Linux; Android 15; SM-S931B Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.103 Mobile Safari/537.36",
    "Ext-referer": this.baseUrl,
    "Ext-origin": this.baseUrl,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Accept-Language": "en-US,en;q=0.9,th;q=0.8",
    "Cache-Control": "max-age=0",
    "Upgrade-Insecure-Requests": "1",
  };

  private get client(): AxiosInstance {
    return axios.create({
      headers: this.headers,
      timeout: 10000,
    });
  }

  async getLatest(page: number = 1): Promise<IPage<IAnimeItem>> {
    const response = await this.client.get(
      `${this.baseUrl}/anime/page/${page}`,
    );
    const $ = cheerio.load(response.data);
    return parseLatest($, page);
  }

  private async getNonce(): Promise<string> {
    const response = await this.client.get(this.baseUrl);
    const nonceMatch = response.data.match(/"nonce":"([a-zA-Z0-9]+)"/);
    if (!nonceMatch) {
      // Try another common pattern for dooplay nonces
      const altMatch = response.data.match(/nonce\s*[:=]\s*"([a-zA-Z0-9]+)"/);
      if (!altMatch) {
        throw new Error("Nonce not found in homepage");
      }
      return altMatch[1];
    }
    return nonceMatch[1];
  }

  async getSearchResult(
    keyword: string,
    page: number = 1,
  ): Promise<IPage<IAnimeItem>> {
    const nonce = await this.getNonce();
    const response = await this.client.get(
      `${this.baseUrl}/wp-json/dooplay/search/`,
      {
        params: {
          keyword: keyword.trim(),
          nonce: nonce,
        },
      },
    );

    const items: IAnimeItem[] = [];
    if (response.data && typeof response.data === "object") {
      Object.values(response.data).forEach((item: any) => {
        if (item.title && item.url) {
          items.push({
            title: item.title,
            url: item.url,
            cover: cleanImageUrlSize(item.img) || "",
          });
        }
      });
    }

    return {
      content: items,
      page: page,
      minPage: 1,
      maxPage: 1,
    };
  }

  async getDetail(url: string): Promise<IAnimeDetail> {
    const response = await this.client.get(url);
    const $ = cheerio.load(response.data);
    return await parseDetail($);
  }

  async getEpisodes(url: string): Promise<IGroupEpisode[]> {
    const response = await this.client.get(url);
    const $ = cheerio.load(response.data);
    return await parseEpisodes($);
  }

  async getVideoSource(url: string): Promise<string> {
    const response = await this.client.get(url);
    const postId = url.split("/").filter(Boolean).pop() || "";

    const cookies = response.headers["set-cookie"];
    const cookieHeader = cookies
      ? cookies.map((c) => c.split(";")[0]).join("; ")
      : "";

    const ajaxParams = new URLSearchParams();
    ajaxParams.append("action", "doo_player_ajax");
    ajaxParams.append("post", postId);
    ajaxParams.append("nume", "1");
    ajaxParams.append("type", "tv");

    const ajaxResponse = await this.client.post(
      `${this.baseUrl}/wp-admin/admin-ajax.php`,
      ajaxParams.toString(),
      {
        headers: {
          ...this.headers,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          "Ext-referer": url,
          Cookie: cookieHeader,
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
        },
      },
    );

    const embedUrl = ajaxResponse.data?.embed_url;
    if (!embedUrl) throw new Error("Embed URL not found");

    const embedResponse = await this.client.get(embedUrl, {
      headers: { ...this.headers, "Ext-referer": url },
    });
    const playerPath = extractIframeSrc(embedResponse.data);
    if (!playerPath) throw new Error("Player iframe not found");

    const playerUrl = playerPath.startsWith("http")
      ? playerPath
      : `${this.baseUrl}${playerPath}`;

    const playerResponse = await this.client.get(playerUrl, {
      headers: { ...this.headers, "Ext-referer": embedUrl },
    });
    const servers = extractListServer(playerResponse.data);
    const server2 =
      servers.find((s: any) => s.name?.includes("2")) || servers[0];
    if (!server2) throw new Error("No video server found");

    const sourceResponse = await this.client.get(server2.src, {
      headers: { ...this.headers, "Ext-referer": playerUrl },
    });
    const finalSource = extractSources(sourceResponse.data);
    if (!finalSource) throw new Error("Final video source not found");

    return finalSource;
  }
}

// Export a default instance for easy loading
export default new AnimeWakuExtension();
