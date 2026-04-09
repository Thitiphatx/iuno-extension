import type { IPage } from "."
import type { IAnimeDetail, IAnimeItem, IGroupEpisode } from "./anime"
import type { IChapter, IMangaDetail, IMangaItem } from "./manga"

export interface IBaseExtension {
    id: string
    name: string
    icon: string
    baseUrl: string
    headers?: Record<string, string>
}

export interface IAnimeExtension extends IBaseExtension {
    getLatest(page?: number): Promise<IPage<IAnimeItem>>
    getSearchResult(keyword: string, page?: number): Promise<IPage<IAnimeItem>>
    getDetail(url: string): Promise<IAnimeDetail>
    getEpisodes(url: string): Promise<IGroupEpisode[]>
    getVideoSource(url: string): Promise<string>
}

export interface IMangaExtension extends IBaseExtension {
    getLatest(page?: number): Promise<IPage<IMangaItem>>
    getSearchResult(keyword: string, page?: number): Promise<IPage<IMangaItem>>
    getDetail(url: string): Promise<IMangaDetail>
    getChapters(url: string): Promise<IChapter[]>
    getChapterPages(mangaId: string, chapterId: string): Promise<string[]>
}