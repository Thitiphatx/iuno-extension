import type { ITag } from ".";

export interface IMangaItem {
    url: string;
    title: string;
    cover: string;
    latestChapter?: number;
}

export interface IMangaDetail extends Omit<IMangaItem, "url"> {
    author?: ITag;
    artist?: ITag;
    alias?: string
    description?: string;
    tags: ITag[];
}

export interface IChapter {
    url: string;
    number?: number;
    name?: string;
}