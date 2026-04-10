import axios, { type AxiosInstance } from "axios";
import type { IPage } from "./core/types";
import type { IMangaExtension } from "./core/types/extension";
import type { IChapter, IMangaDetail, IMangaItem } from "./core/types/manga";
import { parseChapterPages } from "./parser/parseChapterPages";
import { parseChapters } from "./parser/parseChapters";
import { parseDetail } from "./parser/parseDetail";
import { parseList } from "./parser/parseList";
import type { INekopostChapterImage as INekopostChapterPages, INekopostMangaItem } from "./type";

export class NekopostExtension implements IMangaExtension {
  id = "nekopost";
  name = "Nekopost";
  icon = "https://www.nekopost.net/new-favicon.ico";
  baseUrl = "https://www.nekopost.net";
  apiUrl = "https://api.osemocphoto.com/frontAPI";
  referer = "https://www.nekopost.net";
  headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Referer": this.baseUrl,
    "Origin": this.baseUrl,
  };

  private get client(): AxiosInstance {
    return axios.create({
      headers: this.headers,
      timeout: 10000,
    });
  }

  async getLatest(page: number = 1): Promise<IPage<IMangaItem>> {
    const response = await this.client.get(
      `${this.apiUrl}/getLatestChapterF3/m/0/12/${page}`,
    );
    return parseList(page, response.data.listChapter as INekopostMangaItem[]);
  }

  async getSearchResult(
    keyword: string,
    page: number = 1,
  ): Promise<IPage<IMangaItem>> {
    const response = await this.client.post(
      `${this.apiUrl}/getProjectSearch`,
      JSON.stringify({
        ipKeyword: keyword
      })
    );

    return parseList(page, response.data.listChapter as INekopostMangaItem[])
  }

  async getDetail(mangaId: string): Promise<IMangaDetail> {
    const response = await this.client.get(`${this.apiUrl}/getProjectInfo/${mangaId}`);

    return parseDetail(response.data);
  }

  async getChapters(mangaId: string): Promise<IChapter[]> {
    const response = await this.client.get(`${this.apiUrl}/getProjectInfo/${mangaId}`);

    return parseChapters(response.data);
  }

  async getChapterPages(mangaId: string, chapterId: string): Promise<string[]> {
    const response = await this.client.get(`https://www.osemocphoto.com/collectManga/${mangaId}/${chapterId}/${mangaId}_${chapterId}.json`);

    return parseChapterPages(response.data, mangaId, chapterId);
  }
}

export default new NekopostExtension();
