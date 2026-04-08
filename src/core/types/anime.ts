import type { ITag } from ".";

export interface IAnimeItem {
  url: string;
  title: string;
  cover: string;
}

export interface IAnimeDetail extends Omit<IAnimeItem, "url"> {
  alias?: string;
  description?: string;
  tags: ITag[];
}

export interface IGroupEpisode {
  title: string;
  episodes: IEpisode[];
}

export interface IEpisode {
  url: string;
  number?: number;
  name?: string;
  preview?: string;
}
