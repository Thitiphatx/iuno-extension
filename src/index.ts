import axios, { type AxiosInstance } from "axios";
import * as cheerio from "cheerio";
import type { IPage } from "./core/types";
import type { IAnimeItem, IAnimeDetail, IGroupEpisode } from "./core/types/anime";
import type { IExtension } from "./core/types/extension";
import { getLatestParser } from "./parser/getLatestParser";
import { getSearchResultParser } from "./parser/getSearchResultParser";
import { getDetailParser } from "./parser/getDetailParser";
import { getEpisodesParser } from "./parser/getEpisodesParser";
import { getVideoSourceParser } from "./parser/getVideoSourceParser";

export class SampleExtension implements IExtension {
    id = "sample-extension";
    name = "Sample Extension";
    icon = "https://example.com/favicon.ico";
    baseUrl = "https://example.com";
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Ext-Referer": this.baseUrl,
        "Ext-Origin": this.baseUrl
    };

    private get client(): AxiosInstance {
        return axios.create({
            headers: this.headers,
            timeout: 10000,
        });
    }

    async getLatest(page: number = 1): Promise<IPage<IAnimeItem>> {
        const response = await this.client.get(`${this.baseUrl}/latest?page=${page}`);
        const $ = cheerio.load(response.data);
        return getLatestParser($, page);
    }

    async getSearchResult(keyword: string, page: number = 1): Promise<IPage<IAnimeItem>> {
        const response = await this.client.get(`${this.baseUrl}/search?q=${keyword}&page=${page}`);
        const $ = cheerio.load(response.data);
        return getSearchResultParser($, page);
    }

    async getDetail(url: string): Promise<IAnimeDetail> {
        const response = await this.client.get(url);
        const $ = cheerio.load(response.data);
        return getDetailParser($);
    }

    async getEpisodes(url: string): Promise<IGroupEpisode[]> {
        const response = await this.client.get(url);
        const $ = cheerio.load(response.data);
        return getEpisodesParser($);
    }

    async getVideoSource(url: string): Promise<string> {
        const response = await this.client.get(url);
        const $ = cheerio.load(response.data);
        return getVideoSourceParser($);
    }
}

// Export a default instance for easy loading
export default new SampleExtension();
