import type { IPage } from "."
import type { IAnimeDetail, IAnimeItem, IGroupEpisode } from "./anime"

export interface IExtension {
    id: string
    name: string
    icon: string
    baseUrl: string
    referer?: string
    headers?: Record<string, string>
    sessionCookie?: string
    setSession?(cookies: string, userAgent?: string): void
    getLatest(page?: number): Promise<IPage<IAnimeItem>>
    getSearchResult(keyword: string, page?: number): Promise<IPage<IAnimeItem>>
    getDetail(url: string): Promise<IAnimeDetail>
    getEpisodes(url: string): Promise<IGroupEpisode[]>
    getVideoSource(url: string): Promise<string>
}
