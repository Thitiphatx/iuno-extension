import type { ITag } from ".";

export interface IMangaItem {
    url: string;
    title: string;
    cover: string;
    latestChapter?: number;
}

export interface IMangaDetail extends Omit<IMangaItem, "url" | "latestChapter"> {
    author?: ITag;
    artist?: ITag;
    alias?: string
    description?: string;
    tags: ITag[];
    isNSFW?: boolean;
    isCompleted?: boolean;
    isLongStrip?: boolean;
}

export interface IChapter {
    url: string;
    number?: number;
    name?: string;
    time?: Date
}