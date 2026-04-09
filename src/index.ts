import axios, { type AxiosInstance } from "axios";
import * as cheerio from "cheerio";
import type { IPage } from "./core/types";
import type {
  IAnimeItem,
  IAnimeDetail,
  IGroupEpisode,
} from "./core/types/anime";
import type { IExtension } from "./core/types/extension";
import { parseLatest } from "./parser/parseLatest";
import { parseSearchResult } from "./parser/parseSearchResult";
import { parseDetail } from "./parser/parseDetail";
import { parseEpisodes } from "./parser/parseEpisodes";
import { parseApiUrl, parseVideoSource } from "./parser/parseVideoSource";

export class AnimeRukaExtension implements IExtension {
  id = "iwara"
  name = "Iwara"
  icon = "https://animeruka.com/wp-content/uploads/2024/07/cropped-32bc1bc65f31e82e2f89eb399f4c93e8-1-192x192.png"
  baseUrl = "https://www.iwara.tv"
  thumbnailUrl = "https://i.iwara.tv"
  apiUrl = "https://api.iwara.tv"
  referer = "https://www.iwara.tv"
  headers = {
    "User-Agent":
      "PostmanRuntime/7.51.1",
  };

  private get client(): AxiosInstance {
    return axios.create({
      headers: this.headers,
      timeout: 10000,
    });
  }

  async getLatest(page: number = 0): Promise<IPage<IAnimeItem>> {
    const response = await this.client.get(
      `${this.apiUrl}/videos?rating=all&sort=date&page=${page}`,
      { headers: this.headers }
    )
    return await parseLatest(response.data.results, page);
  }

  async getSearchResult(
    keyword: string,
    page: number = 1,
  ): Promise<IPage<IAnimeItem>> {
    const response = await this.client.get(
      `${this.baseUrl}/page/${page}/?s=${encodeURI(keyword.trim())}`,
    );
    const $ = cheerio.load(response.data);
    return await parseSearchResult($, page);
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
    const $ = cheerio.load(response.data);
    const apiPath = parseApiUrl($);

    const apiResponse = await this.client.get(
      `${this.baseUrl}/wp-json/dooplayer/v2/${apiPath}`,
    );
    const embedUrl = apiResponse.data?.embed_url;

    if (!embedUrl) {
      throw new Error("Embed URL not found in API response");
    }

    const embedResponse = await this.client.get(embedUrl);
    const $embed = cheerio.load(embedResponse.data);
    return parseVideoSource($embed);
  }
}

// Export a default instance for easy loading
export default new AnimeRukaExtension();
